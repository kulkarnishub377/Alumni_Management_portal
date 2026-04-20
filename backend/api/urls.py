from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    UserViewSet, DepartmentViewSet, AlumniProfileViewSet,
    MentorProfileViewSet, UserSocialLinkViewSet, UserExperienceViewSet,
    PostViewSet, PostCommentViewSet, JobViewSet, EventViewSet,
    MessageViewSet, NotificationViewSet, GalleryItemViewSet
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
router.register(r'events', EventViewSet)
router.register(r'messages', MessageViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'gallery', GalleryItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # JWT Authentication Endpoints
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
