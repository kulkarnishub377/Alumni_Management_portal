"""
Tests for the Alumni Management Portal API.

Covers critical flows:
- User registration (password hashing)
- Authentication (JWT tokens)
- Permission boundaries
- Model validation
"""

from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from .models import (
    Department, Job, Event, MentorProfile, MentorshipRequest
)

User = get_user_model()


# =============================================================================
# MODEL TESTS
# =============================================================================

class UserModelTests(TestCase):
    """Test the custom User model."""

    def test_create_user_with_email(self):
        """Users should be created with email as the identifier."""
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.check_password('testpass123'))
        self.assertFalse(user.is_superuser)

    def test_create_superuser(self):
        """Superusers should have admin privileges."""
        admin = User.objects.create_superuser(
            email='admin@example.com',
            password='admin123',
            first_name='Admin',
            last_name='User'
        )
        self.assertTrue(admin.is_superuser)
        self.assertTrue(admin.is_staff)

    def test_user_default_role(self):
        """New users should default to 'alumni' role."""
        user = User.objects.create_user(
            email='alumni@example.com',
            password='testpass123'
        )
        self.assertEqual(user.role, 'alumni')

    def test_user_default_status(self):
        """New users should default to 'pending' status."""
        user = User.objects.create_user(
            email='pending@example.com',
            password='testpass123'
        )
        self.assertEqual(user.status, 'pending')

    def test_user_str_representation(self):
        """User string representation should be the email."""
        user = User.objects.create_user(
            email='repr@example.com',
            password='testpass123'
        )
        self.assertEqual(str(user), 'repr@example.com')


class DepartmentModelTests(TestCase):
    """Test the Department model."""

    def test_create_department(self):
        dept = Department.objects.create(
            name='Computer Engineering',
            code='COMP'
        )
        self.assertEqual(str(dept), 'Computer Engineering')


# =============================================================================
# REGISTRATION & AUTH TESTS
# =============================================================================

class RegistrationTests(APITestCase):
    """Test user registration via the API."""

    def test_register_user_sets_password(self):
        """POST /api/users/ should create a user with a properly hashed password."""
        response = self.client.post('/api/users/', {
            'email': 'newuser@example.com',
            'password': 'securepass123',
            'first_name': 'New',
            'last_name': 'User',
            'role': 'alumni'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Verify password is hashed (not stored in plaintext)
        user = User.objects.get(email='newuser@example.com')
        self.assertTrue(user.check_password('securepass123'))
        self.assertNotEqual(user.password, 'securepass123')

    def test_register_user_password_not_in_response(self):
        """Password should never be returned in API responses."""
        response = self.client.post('/api/users/', {
            'email': 'private@example.com',
            'password': 'securepass123',
            'first_name': 'Private',
            'last_name': 'User',
            'role': 'alumni'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertNotIn('password', response.data)

    def test_register_short_password_rejected(self):
        """Passwords shorter than 8 characters should be rejected."""
        response = self.client.post('/api/users/', {
            'email': 'short@example.com',
            'password': '123',
            'first_name': 'Short',
            'last_name': 'Pass',
            'role': 'alumni'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class AuthenticationTests(APITestCase):
    """Test JWT authentication flow."""

    def setUp(self):
        self.user = User.objects.create_user(
            email='auth@example.com',
            password='testpass123',
            first_name='Auth',
            last_name='User'
        )

    def test_login_returns_tokens(self):
        """POST /api/auth/token/ should return access and refresh tokens."""
        response = self.client.post('/api/auth/token/', {
            'email': 'auth@example.com',
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_wrong_password(self):
        """Login with wrong password should fail."""
        response = self.client.post('/api/auth/token/', {
            'email': 'auth@example.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_refresh_token(self):
        """POST /api/auth/token/refresh/ should return a new access token."""
        login_response = self.client.post('/api/auth/token/', {
            'email': 'auth@example.com',
            'password': 'testpass123'
        })
        refresh_token = login_response.data['refresh']
        response = self.client.post('/api/auth/token/refresh/', {
            'refresh': refresh_token
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)


# =============================================================================
# PERMISSION TESTS
# =============================================================================

class PermissionTests(APITestCase):
    """Test role-based access control."""

    def setUp(self):
        self.alumni = User.objects.create_user(
            email='alumni@test.com', password='pass12345',
            first_name='Alumni', last_name='User', role='alumni'
        )
        self.admin = User.objects.create_user(
            email='admin@test.com', password='pass12345',
            first_name='Admin', last_name='User', role='admin',
            is_staff=True
        )

    def test_unauthenticated_cannot_list_users(self):
        """GET /api/users/ should require authentication."""
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_alumni_can_list_users(self):
        """Authenticated alumni can list users."""
        self.client.force_authenticate(user=self.alumni)
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unauthenticated_can_register(self):
        """POST /api/users/ should be open for registration."""
        response = self.client.post('/api/users/', {
            'email': 'open@test.com',
            'password': 'pass12345',
            'first_name': 'Open',
            'last_name': 'User',
            'role': 'alumni'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_me_endpoint(self):
        """GET /api/users/me/ should return the authenticated user's data."""
        self.client.force_authenticate(user=self.alumni)
        response = self.client.get('/api/users/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'alumni@test.com')

    def test_me_patch(self):
        """PATCH /api/users/me/ should update the authenticated user."""
        self.client.force_authenticate(user=self.alumni)
        response = self.client.patch('/api/users/me/', {
            'first_name': 'Updated'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], 'Updated')


class PasswordChangeTests(APITestCase):
    """Test password change flow."""

    def setUp(self):
        self.user = User.objects.create_user(
            email='pwchange@test.com', password='oldpass123',
            first_name='PW', last_name='User'
        )
        self.client.force_authenticate(user=self.user)

    def test_change_password_success(self):
        response = self.client.post('/api/users/change_password/', {
            'old_password': 'oldpass123',
            'new_password': 'newpass456'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpass456'))

    def test_change_password_wrong_old(self):
        response = self.client.post('/api/users/change_password/', {
            'old_password': 'wrongold',
            'new_password': 'newpass456'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


# =============================================================================
# HOMEPAGE API TESTS
# =============================================================================

class HomepageAPITests(APITestCase):
    """Test the public homepage endpoint."""

    def test_homepage_is_public(self):
        """GET /api/pages/homepage/ should be accessible without auth."""
        response = self.client.get('/api/pages/homepage/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_homepage_returns_expected_keys(self):
        """Response should contain all required data sections."""
        response = self.client.get('/api/pages/homepage/')
        data = response.data
        self.assertIn('stats', data)
        self.assertIn('topAlumni', data)
        self.assertIn('jobs', data)
        self.assertIn('events', data)
        self.assertIn('testimonials', data)
        self.assertIn('whyJoin', data)

    def test_homepage_stats_are_real(self):
        """Stats should reflect actual DB counts, not inflated hardcodes."""
        User.objects.create_user(
            email='real@test.com', password='pass12345', role='alumni'
        )
        response = self.client.get('/api/pages/homepage/')
        self.assertEqual(response.data['stats']['totalAlumni'], 1)
