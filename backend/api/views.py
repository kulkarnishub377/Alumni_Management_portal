from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .models import (
    Department, AlumniProfile, MentorProfile, UserSocialLink,
    UserExperience, Post, PostLike, PostComment, Job, Event,
    EventAttendee, Message, Notification, GalleryItem,
    JobApplication, MentorshipRequest, Announcement, Testimonial, WhyJoin
)
from .serializers import (
    UserSerializer, DepartmentSerializer, AlumniProfileSerializer,
    MentorProfileSerializer, UserSocialLinkSerializer, UserExperienceSerializer,
    PostSerializer, PostLikeSerializer, PostCommentSerializer, JobSerializer,
    EventSerializer, EventAttendeeSerializer, MessageSerializer, NotificationSerializer,
    GalleryItemSerializer, JobApplicationSerializer, MentorshipRequestSerializer,
    AnnouncementSerializer, TestimonialSerializer, WhyJoinSerializer
)

User = get_user_model()

# ============================================
# PAGE-WISE AGGREGATED APIs
# ============================================

class HomepageAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        stats = {
            "totalAlumni": User.objects.filter(role='alumni').count() + 12500,
            "companiesHiring": Job.objects.values('company').distinct().count() + 350,
            "eventsConducted": Event.objects.count() + 120,
            "activeMentors": MentorProfile.objects.count() + 84,
            "studentsPlaced": 8700
        }
        top_alumni = User.objects.filter(role='alumni', status='approved').order_by('-id')[:8]
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
            "whyJoin": WhyJoinSerializer(why_join, many=True).data
        })

class AlumniDashboardAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        upcoming_events = Event.objects.all().order_by('event_date')[:3]
        announcements = Announcement.objects.order_by('-created_at')[:5]
        recent_jobs = Job.objects.filter(status='approved').order_by('-created_at')[:3]
        return Response({
            "announcements": AnnouncementSerializer(announcements, many=True).data,
            "upcoming_events": EventSerializer(upcoming_events, many=True).data,
            "recommended_jobs": JobSerializer(recent_jobs, many=True).data,
        })

class MentorDashboardAPIView(APIView):
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
            "announcements": AnnouncementSerializer(announcements, many=True).data
        })

# ============================================
# STANDARD APIs WITH BUSINESS LOGIC
# ============================================

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny] 

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all().order_by('-created_at')
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def apply(self, request, pk=None):
        job = self.get_object()
        application, created = JobApplication.objects.get_or_create(
            job=job, applicant=request.user,
            defaults={'cover_letter': request.data.get('cover_letter', '')}
        )
        if not created:
            return Response({"detail": "Already applied."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Application submitted."}, status=status.HTTP_201_CREATED)

class MentorshipRequestViewSet(viewsets.ModelViewSet):
    queryset = MentorshipRequest.objects.all().order_by('-created_at')
    serializer_class = MentorshipRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(mentee=self.request.user)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        m_req = self.get_object()
        if m_req.mentor != request.user: return Response(status=status.HTTP_403_FORBIDDEN)
        m_req.status = 'approved'
        m_req.save()
        profile, _ = MentorProfile.objects.get_or_create(user=m_req.mentor)
        profile.active_mentees += 1
        profile.save()
        return Response({"detail": "Approved."})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        m_req = self.get_object()
        if m_req.mentor != request.user: return Response(status=status.HTTP_403_FORBIDDEN)
        m_req.status = 'rejected'
        m_req.save()
        return Response({"detail": "Rejected."})

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        post = self.get_object()
        like, created = PostLike.objects.get_or_create(post=post, user=request.user)
        if not created:
            like.delete() # Toggle like
            return Response({"detail": "Unliked."})
        return Response({"detail": "Liked."})

class PostCommentViewSet(viewsets.ModelViewSet):
    queryset = PostComment.objects.all()
    serializer_class = PostCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Standard Viewsets continue ...
class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class AlumniProfileViewSet(viewsets.ModelViewSet):
    queryset = AlumniProfile.objects.all()
    serializer_class = AlumniProfileSerializer

class MentorProfileViewSet(viewsets.ModelViewSet):
    queryset = MentorProfile.objects.all()
    serializer_class = MentorProfileSerializer

class UserSocialLinkViewSet(viewsets.ModelViewSet):
    queryset = UserSocialLink.objects.all()
    serializer_class = UserSocialLinkSerializer

class UserExperienceViewSet(viewsets.ModelViewSet):
    queryset = UserExperience.objects.all()
    serializer_class = UserExperienceSerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('event_date')
    serializer_class = EventSerializer

class EventAttendeeViewSet(viewsets.ModelViewSet):
    queryset = EventAttendee.objects.all()
    serializer_class = EventAttendeeSerializer

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all().order_by('-sent_at')
    serializer_class = MessageSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer

class GalleryItemViewSet(viewsets.ModelViewSet):
    queryset = GalleryItem.objects.all().order_by('-created_at')
    serializer_class = GalleryItemSerializer

class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all().order_by('-created_at')
    serializer_class = AnnouncementSerializer

class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer

class WhyJoinViewSet(viewsets.ModelViewSet):
    queryset = WhyJoin.objects.all()
    serializer_class = WhyJoinSerializer

class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
