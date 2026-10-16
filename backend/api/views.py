from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.db.models import Q, Count
from .models import (
    Department, AlumniProfile, MentorProfile, UserSocialLink,
    UserExperience, Post, PostLike, PostComment, Job, Event,
    EventAttendee, Message, Notification, GalleryItem,
    JobApplication, MentorshipRequest, Announcement, Testimonial, WhyJoin
)
from .serializers import (
    UserSerializer, PasswordChangeSerializer,
    DepartmentSerializer, AlumniProfileSerializer,
    MentorProfileSerializer, UserSocialLinkSerializer, UserExperienceSerializer,
    PostSerializer, PostLikeSerializer, PostCommentSerializer, JobSerializer,
    EventSerializer, EventAttendeeSerializer, MessageSerializer, NotificationSerializer,
    GalleryItemSerializer, JobApplicationSerializer, MentorshipRequestSerializer,
    AnnouncementSerializer, TestimonialSerializer, WhyJoinSerializer
)

User = get_user_model()


# =============================================================================
# CUSTOM PERMISSION CLASSES
# =============================================================================

class IsOwnerOrReadOnly(permissions.BasePermission):
    """Allow owners to edit their own objects; read-only for others."""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # Check common owner field names
        if hasattr(obj, 'user'):
            return obj.user == request.user
        if hasattr(obj, 'posted_by'):
            return obj.posted_by == request.user
        if hasattr(obj, 'created_by'):
            return obj.created_by == request.user
        if hasattr(obj, 'sender'):
            return obj.sender == request.user
        return obj == request.user


class IsAdminRole(permissions.BasePermission):
    """Only allow users with the 'admin' role."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class IsCoordinatorOrAdmin(permissions.BasePermission):
    """Allow coordinators and admins."""
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role in ('coordinator', 'admin')
        )


class IsMentorOrAdmin(permissions.BasePermission):
    """Allow mentors and admins."""
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role in ('mentor', 'admin')
        )


# =============================================================================
# PAGE-WISE AGGREGATED APIs (Custom endpoints for specific frontend pages)
# =============================================================================

class HomepageAPIView(APIView):
    """
    Aggregated endpoint for the public landing page.
    Returns all data needed to hydrate index.html in a single request.
    """
    permission_classes = [permissions.AllowAny]

    @method_decorator(cache_page(60 * 15))
    def get(self, request, *args, **kwargs):
        stats = {
            "totalAlumni": User.objects.filter(role='alumni').count(),
            "companiesHiring": Job.objects.filter(status='approved').values('company').distinct().count(),
            "eventsConducted": Event.objects.count(),
            "activeMentors": MentorProfile.objects.count(),
            "studentsPlaced": User.objects.filter(
                role='alumni', status='approved'
            ).exclude(
                alumni_profile__current_company__isnull=True
            ).exclude(
                alumni_profile__current_company=''
            ).count(),
            "jobPostings": Job.objects.filter(status='approved').count(),
        }
        top_alumni = User.objects.filter(
            role='alumni', status='approved'
        ).order_by('-id')[:8]
        jobs = Job.objects.filter(status='approved').order_by('-created_at')[:6]
        events = Event.objects.all().order_by('event_date')[:4]
        testimonials = Testimonial.objects.filter(is_active=True)
        why_join = WhyJoin.objects.all()

        return Response({
            "stats": stats,
            "topAlumni": UserSerializer(top_alumni, many=True).data,
            "jobs": JobSerializer(jobs, many=True).data,
            "events": EventSerializer(events, many=True).data,
            "testimonials": TestimonialSerializer(testimonials, many=True).data,
            "whyJoin": WhyJoinSerializer(why_join, many=True).data,
        })


class AlumniDashboardAPIView(APIView):
    """Aggregated data for the Alumni dashboard page."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        upcoming_events = Event.objects.all().order_by('event_date')[:3]
        announcements = Announcement.objects.order_by('-created_at')[:5]
        recent_jobs = Job.objects.filter(status='approved').order_by('-created_at')[:3]
        unread_messages = Message.objects.filter(receiver=user, read_status=False).count()
        unread_notifications = Notification.objects.filter(user=user, is_read=False).count()

        return Response({
            "announcements": AnnouncementSerializer(announcements, many=True).data,
            "upcoming_events": EventSerializer(upcoming_events, many=True).data,
            "recommended_jobs": JobSerializer(recent_jobs, many=True).data,
            "unread_messages": unread_messages,
            "unread_notifications": unread_notifications,
        })


class MentorDashboardAPIView(APIView):
    """Aggregated data for the Mentor dashboard page."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        pending = MentorshipRequest.objects.filter(mentor=user, status='pending')
        active = MentorshipRequest.objects.filter(mentor=user, status='approved')
        announcements = Announcement.objects.order_by('-created_at')[:3]

        return Response({
            "pending_requests_count": pending.count(),
            "active_mentees_count": active.count(),
            "pending_requests": MentorshipRequestSerializer(pending[:5], many=True).data,
            "announcements": AnnouncementSerializer(announcements, many=True).data,
        })


class CoordinatorDashboardAPIView(APIView):
    """Aggregated data for the Coordinator dashboard page."""
    permission_classes = [permissions.IsAuthenticated, IsCoordinatorOrAdmin]

    def get(self, request, *args, **kwargs):
        user = request.user
        dept = user.department

        # Pending job approvals for this coordinator's department
        pending_jobs = Job.objects.filter(status='pending_coordinator')
        if dept:
            pending_jobs = pending_jobs.filter(posted_by__department=dept)

        # Alumni in this department
        dept_alumni_count = User.objects.filter(
            role='alumni', department=dept
        ).count() if dept else 0

        # Pending alumni registrations
        pending_alumni = User.objects.filter(
            status='pending', department=dept
        ) if dept else User.objects.none()

        # Department mentors
        dept_mentors = MentorProfile.objects.filter(
            user__department=dept
        ) if dept else MentorProfile.objects.none()

        announcements = Announcement.objects.order_by('-created_at')[:3]

        return Response({
            "pending_jobs_count": pending_jobs.count(),
            "pending_jobs": JobSerializer(pending_jobs[:5], many=True).data,
            "department_alumni_count": dept_alumni_count,
            "pending_alumni_count": pending_alumni.count(),
            "department_mentors_count": dept_mentors.count(),
            "announcements": AnnouncementSerializer(announcements, many=True).data,
        })


class AdminDashboardAPIView(APIView):
    """Aggregated data for the Admin dashboard page."""
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request, *args, **kwargs):
        return Response({
            "total_users": User.objects.count(),
            "total_alumni": User.objects.filter(role='alumni').count(),
            "total_mentors": User.objects.filter(role='mentor').count(),
            "total_coordinators": User.objects.filter(role='coordinator').count(),
            "pending_registrations": User.objects.filter(status='pending').count(),
            "total_jobs": Job.objects.count(),
            "approved_jobs": Job.objects.filter(status='approved').count(),
            "pending_jobs": Job.objects.filter(
                status__in=['pending_coordinator', 'pending_admin']
            ).count(),
            "total_events": Event.objects.count(),
            "total_departments": Department.objects.count(),
            "announcements": AnnouncementSerializer(
                Announcement.objects.order_by('-created_at')[:5], many=True
            ).data,
        })


# =============================================================================
# USER MANAGEMENT
# =============================================================================

class UserViewSet(viewsets.ModelViewSet):
    """
    User CRUD with proper permission boundaries.
    - Anyone can register (create).
    - Only authenticated users can list/retrieve.
    - Only the owner or admin can update/delete.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        if self.action in ('update', 'partial_update', 'destroy'):
            return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['get', 'patch'],
            permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """Get or update the currently authenticated user's profile."""
        if request.method == 'PATCH':
            serializer = self.get_serializer(
                request.user, data=request.data, partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'],
            permission_classes=[permissions.IsAuthenticated])
    def change_password(self, request):
        """Change the authenticated user's password."""
        serializer = PasswordChangeSerializer(
            data=request.data, context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        return Response({"detail": "Password changed successfully."})

    @action(detail=True, methods=['post'],
            permission_classes=[permissions.IsAuthenticated, IsMentorOrAdmin])
    def approve(self, request, pk=None):
        """Approve a pending user registration."""
        user = self.get_object()
        if user.status != 'pending':
            return Response(
                {"detail": "User is not in pending status."},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.status = 'approved'
        user.save()
        return Response({"detail": f"User {user.email} approved."})

    @action(detail=True, methods=['post'],
            permission_classes=[permissions.IsAuthenticated, IsMentorOrAdmin])
    def reject(self, request, pk=None):
        """Reject a pending user registration."""
        user = self.get_object()
        if user.status != 'pending':
            return Response(
                {"detail": "User is not in pending status."},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.status = 'rejected'
        user.save()
        return Response({"detail": f"User {user.email} rejected."})


# =============================================================================
# JOB BOARD
# =============================================================================

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all().order_by('-created_at')
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)

    @action(detail=True, methods=['post'],
            permission_classes=[permissions.IsAuthenticated])
    def apply(self, request, pk=None):
        """Apply to a job posting. Prevents duplicate applications."""
        job = self.get_object()
        application, created = JobApplication.objects.get_or_create(
            job=job, applicant=request.user,
            defaults={'cover_letter': request.data.get('cover_letter', '')}
        )
        if not created:
            return Response(
                {"detail": "Already applied."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(
            {"detail": "Application submitted."},
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['post'],
            permission_classes=[permissions.IsAuthenticated, IsCoordinatorOrAdmin])
    def approve_job(self, request, pk=None):
        """Coordinator/Admin approves a pending job posting."""
        job = self.get_object()
        if job.status == 'pending_coordinator':
            job.status = 'pending_admin'
        elif job.status == 'pending_admin':
            job.status = 'approved'
        else:
            return Response(
                {"detail": f"Job is in '{job.status}' state and cannot be approved further."},
                status=status.HTTP_400_BAD_REQUEST
            )
        job.save()
        return Response({"detail": f"Job status updated to '{job.status}'."})

    @action(detail=True, methods=['post'],
            permission_classes=[permissions.IsAuthenticated, IsCoordinatorOrAdmin])
    def reject_job(self, request, pk=None):
        """Coordinator/Admin rejects a job posting."""
        job = self.get_object()
        job.status = 'rejected'
        job.save()
        return Response({"detail": "Job rejected."})


# =============================================================================
# MENTORSHIP
# =============================================================================

class MentorshipRequestViewSet(viewsets.ModelViewSet):
    queryset = MentorshipRequest.objects.all().order_by('-created_at')
    serializer_class = MentorshipRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(mentee=self.request.user)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Mentor approves a mentorship request."""
        m_req = self.get_object()
        if m_req.mentor != request.user:
            return Response(
                {"detail": "Only the assigned mentor can approve this request."},
                status=status.HTTP_403_FORBIDDEN
            )
        # Check mentor capacity
        profile, _ = MentorProfile.objects.get_or_create(user=m_req.mentor)
        if profile.active_mentees >= profile.max_mentees:
            return Response(
                {"detail": f"Mentor has reached maximum capacity ({profile.max_mentees})."},
                status=status.HTTP_400_BAD_REQUEST
            )
        m_req.status = 'approved'
        m_req.save()
        profile.active_mentees += 1
        profile.save()
        return Response({"detail": "Mentorship request approved."})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Mentor rejects a mentorship request."""
        m_req = self.get_object()
        if m_req.mentor != request.user:
            return Response(
                {"detail": "Only the assigned mentor can reject this request."},
                status=status.HTTP_403_FORBIDDEN
            )
        m_req.status = 'rejected'
        m_req.save()
        return Response({"detail": "Mentorship request rejected."})


# =============================================================================
# NETWORK FEED (Posts, Likes, Comments)
# =============================================================================

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.select_related('user').prefetch_related(
        'comments', 'likes'
    ).order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'],
            permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        """Toggle like on a post."""
        post = self.get_object()
        like, created = PostLike.objects.get_or_create(
            post=post, user=request.user
        )
        if not created:
            like.delete()
            return Response({"detail": "Unliked.", "liked": False})
        return Response({"detail": "Liked.", "liked": True})


class PostCommentViewSet(viewsets.ModelViewSet):
    queryset = PostComment.objects.select_related('user').all()
    serializer_class = PostCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# =============================================================================
# MESSAGING
# =============================================================================

class MessageViewSet(viewsets.ModelViewSet):
    """
    Direct messaging system.
    Users can only see messages they sent or received.
    """
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).order_by('-sent_at')

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    @action(detail=True, methods=['patch'])
    def mark_read(self, request, pk=None):
        """Mark a specific message as read."""
        message = self.get_object()
        if message.receiver != request.user:
            return Response(
                {"detail": "You can only mark your own messages as read."},
                status=status.HTTP_403_FORBIDDEN
            )
        message.read_status = True
        message.save()
        return Response({"detail": "Message marked as read."})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all unread messages for the current user as read."""
        count = Message.objects.filter(
            receiver=request.user, read_status=False
        ).update(read_status=True)
        return Response({"detail": f"Marked {count} messages as read."})


# =============================================================================
# NOTIFICATIONS
# =============================================================================

class NotificationViewSet(viewsets.ModelViewSet):
    """
    Notification system.
    Users can only see their own notifications.
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(
            user=self.request.user
        ).order_by('-created_at')

    @action(detail=True, methods=['patch'])
    def mark_read(self, request, pk=None):
        """Mark a notification as read."""
        notification = self.get_object()
        if notification.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        notification.is_read = True
        notification.save()
        return Response({"detail": "Notification marked as read."})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read."""
        count = Notification.objects.filter(
            user=request.user, is_read=False
        ).update(is_read=True)
        return Response({"detail": f"Marked {count} notifications as read."})


# =============================================================================
# STANDARD CRUD VIEWSETS (with proper permissions)
# =============================================================================

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsAdminRole()]


class AlumniProfileViewSet(viewsets.ModelViewSet):
    queryset = AlumniProfile.objects.all()
    serializer_class = AlumniProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]


class MentorProfileViewSet(viewsets.ModelViewSet):
    queryset = MentorProfile.objects.all()
    serializer_class = MentorProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]


class UserSocialLinkViewSet(viewsets.ModelViewSet):
    queryset = UserSocialLink.objects.all()
    serializer_class = UserSocialLinkSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]


class UserExperienceViewSet(viewsets.ModelViewSet):
    queryset = UserExperience.objects.all()
    serializer_class = UserExperienceSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('event_date')
    serializer_class = EventSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.IsAuthenticatedOrReadOnly()]
        return [permissions.IsAuthenticated(), IsCoordinatorOrAdmin()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class EventAttendeeViewSet(viewsets.ModelViewSet):
    queryset = EventAttendee.objects.all()
    serializer_class = EventAttendeeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class GalleryItemViewSet(viewsets.ModelViewSet):
    queryset = GalleryItem.objects.all().order_by('-created_at')
    serializer_class = GalleryItemSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsCoordinatorOrAdmin()]


class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all().order_by('-created_at')
    serializer_class = AnnouncementSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsCoordinatorOrAdmin()]


class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsAdminRole()]


class WhyJoinViewSet(viewsets.ModelViewSet):
    queryset = WhyJoin.objects.all()
    serializer_class = WhyJoinSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsAdminRole()]


class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Users see only their own applications; admins see all."""
        user = self.request.user
        if user.role == 'admin':
            return JobApplication.objects.all()
        return JobApplication.objects.filter(applicant=user)
