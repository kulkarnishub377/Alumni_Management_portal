from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.contrib.postgres.fields import ArrayField

# ============================================
# 1. ENUMS & DEPARTMENTS
# ============================================

class RoleChoices(models.TextChoices):
    ADMIN = 'admin', 'Admin'
    ALUMNI = 'alumni', 'Alumni'
    MENTOR = 'mentor', 'Mentor'
    COORDINATOR = 'coordinator', 'Coordinator'

class Department(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    status = models.CharField(max_length=20, default='active')

    def __str__(self):
        return f"{self.name} ({self.code})"

# ============================================
# 2. CORE USERS
# ============================================

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is mandatory')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', RoleChoices.ADMIN)
        extra_fields.setdefault('status', 'approved')
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    username = None # using email exclusively
    email = models.EmailField('email address', unique=True)
    role = models.CharField(max_length=20, choices=RoleChoices.choices, default=RoleChoices.ALUMNI)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    batch_year = models.IntegerField(null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    avatar_url = models.TextField(blank=True)
    status = models.CharField(max_length=20, default='pending') # pending, approved, rejected
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    objects = CustomUserManager()

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

# ============================================
# 3. PROFILES & MENTORSHIP
# ============================================

class AlumniProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='alumni_profile')
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, null=True, blank=True)
    nationality = models.CharField(max_length=50, null=True, blank=True)
    degree = models.CharField(max_length=100, null=True, blank=True)
    current_address = models.TextField(null=True, blank=True)
    languages = ArrayField(models.CharField(max_length=50), default=list, blank=True)
    
    current_company = models.CharField(max_length=255, null=True, blank=True)
    current_role = models.CharField(max_length=255, null=True, blank=True)
    skills = ArrayField(models.CharField(max_length=100), default=list, blank=True)
    bio = models.TextField(null=True, blank=True)
    
    resume_file_name = models.CharField(max_length=255, null=True, blank=True)
    resume_url = models.TextField(null=True, blank=True)
    resume_size_kb = models.IntegerField(null=True, blank=True)
    resume_last_updated = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"ALUMNI: {self.user.email}"

class MentorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='mentor_profile')
    specialization = models.CharField(max_length=255)
    max_mentees = models.IntegerField(default=5)
    active_mentees = models.IntegerField(default=0)

    def __str__(self):
        return f"MENTOR: {self.user.email}"

class MentorshipRequest(models.Model):
    mentee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mentorship_requests_sent')
    mentor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mentorship_requests_received')
    message = models.TextField()
    status = models.CharField(max_length=20, default='pending') # pending, approved, rejected
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('mentee', 'mentor')

class UserSocialLink(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='social_links')
    platform = models.CharField(max_length=50) # linkedin, github, twitter
    url = models.URLField()

    class Meta:
        unique_together = ('user', 'platform')

class UserExperience(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='experiences')
    job_title = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True)
    is_current = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

# ============================================
# 4. NETWORK FEED & ANNOUNCEMENTS
# ============================================

class Announcement(models.Model):
    title = models.CharField(max_length=255)
    message = models.TextField()
    type_code = models.CharField(max_length=50, default='news') # important, news, event
    created_at = models.DateTimeField(auto_now_add=True)

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    post_type = models.CharField(max_length=50, default='update') # 'update', 'job_share', 'announcement'
    content = models.TextField()
    media_url = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class PostLike(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post', 'user')

class PostComment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

# ============================================
# 5. JOBS & APPLICATIONS
# ============================================

class Job(models.Model):
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    job_type = models.CharField(max_length=50) # Full-time, Internship
    experience_level = models.CharField(max_length=50)
    description = models.TextField()
    posted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jobs_posted')
    status = models.CharField(max_length=20, default='pending_coordinator')
    created_at = models.DateTimeField(auto_now_add=True)

class JobApplication(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_applications')
    cover_letter = models.TextField(blank=True)
    status = models.CharField(max_length=20, default='submitted') # submitted, interviewed, rejected, accepted
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('job', 'applicant')

# ============================================
# 6. EVENTS
# ============================================

class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    event_date = models.DateField()
    event_time = models.TimeField()
    location = models.CharField(max_length=255)
    category = models.CharField(max_length=50)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class EventAttendee(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='attendees')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rsvp_status = models.CharField(max_length=20, default='attending')

    class Meta:
        unique_together = ('event', 'user')

# ============================================
# 7. HOMEPAGE STATIC COMPONENTS
# ============================================

class Testimonial(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    avatar_url = models.TextField()
    text = models.TextField()
    rating = models.IntegerField(default=5)
    is_active = models.BooleanField(default=True)

class WhyJoin(models.Model):
    title = models.CharField(max_length=100)
    desc = models.TextField()
    icon = models.CharField(max_length=50)

# ============================================
# 8. COMMUNICATION & GALLERY
# ============================================

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    read_status = models.BooleanField(default=False)
    sent_at = models.DateTimeField(auto_now_add=True)

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    content = models.TextField()
    icon = models.CharField(max_length=50, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class GalleryItem(models.Model):
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=50)
    image_url = models.TextField()
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
