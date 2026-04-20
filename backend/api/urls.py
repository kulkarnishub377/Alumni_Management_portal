from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    UserViewSet, DepartmentViewSet, AlumniProfileViewSet,
    MentorProfileViewSet, UserSocialLinkViewSet, UserExperienceViewSet,
    PostViewSet, PostCommentViewSet, JobViewSet, EventViewSet,
    MessageViewSet, NotificationViewSet, GalleryItemViewSet,
    JobApplicationViewSet, MentorshipRequestViewSet, AnnouncementViewSet,
    TestimonialViewSet, WhyJoinViewSet, EventAttendeeViewSet,
    HomepageAPIView, AlumniDashboardAPIView, MentorDashboardAPIView
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'profiles/alumni', AlumniProfileViewSet)
router.register(r'profiles/mentors', MentorProfileViewSet)
router.register(r'social-links', UserSocialLinkViewSet)
router.register(r'experiences', UserExperienceViewSet)
router.register(r'feed', PostViewSet)
router.register(r'comments', PostCommentViewSet)
router.register(r'jobs', JobViewSet)
router.register(r'job-applications', JobApplicationViewSet)
router.register(r'events', EventViewSet)
router.register(r'event-attendees', EventAttendeeViewSet)
router.register(r'mentorship-requests', MentorshipRequestViewSet)
router.register(r'messages', MessageViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'gallery', GalleryItemViewSet)
router.register(r'announcements', AnnouncementViewSet)
router.register(r'testimonials', TestimonialViewSet)
router.register(r'why-join', WhyJoinViewSet)

urlpatterns = [
    # Page-Wise Custom Aggregate APIs
    path('pages/homepage/', HomepageAPIView.as_view(), name='page-homepage'),
    path('pages/dashboard/alumni/', AlumniDashboardAPIView.as_view(), name='page-alumni-dash'),
    path('pages/dashboard/mentor/', MentorDashboardAPIView.as_view(), name='page-mentor-dash'),

    # REST Router APIs
    path('', include(router.urls)),

    # JWT Authentication Endpoints
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
