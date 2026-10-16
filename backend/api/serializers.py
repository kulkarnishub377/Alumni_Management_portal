from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Department, AlumniProfile, MentorProfile, UserSocialLink,
    UserExperience, Post, PostLike, PostComment, Job, Event,
    EventAttendee, Message, Notification, GalleryItem,
    JobApplication, MentorshipRequest, Announcement, Testimonial, WhyJoin
)

User = get_user_model()


# =============================================================================
# CORE SERIALIZERS
# =============================================================================

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'


class UserSocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSocialLink
        fields = ['id', 'platform', 'url']


class UserExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserExperience
        fields = '__all__'


class AlumniProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlumniProfile
        fields = '__all__'


class MentorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = MentorProfile
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    """
    Handles user CRUD including registration.
    The `password` field is write-only — it is accepted on create/update
    but never returned in API responses.
    """
    department_details = DepartmentSerializer(source='department', read_only=True)
    social_links = UserSocialLinkSerializer(many=True, read_only=True)
    experiences = UserExperienceSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'password', 'role',
            'department', 'department_details', 'batch_year',
            'phone', 'avatar_url', 'status', 'social_links', 'experiences'
        ]
        extra_kwargs = {
            'password': {'write_only': True, 'required': True, 'min_length': 8},
        }

    def create(self, validated_data):
        """Hash the password properly during user creation."""
        password = validated_data.pop('password', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

    def update(self, instance, validated_data):
        """Hash the password if it's being updated."""
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user


class PasswordChangeSerializer(serializers.Serializer):
    """Handles password change requests for authenticated users."""
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect.')
        return value


# =============================================================================
# FEED & SOCIAL SERIALIZERS
# =============================================================================

class PostCommentSerializer(serializers.ModelSerializer):
    user_details = serializers.SerializerMethodField()

    class Meta:
        model = PostComment
        fields = '__all__'

    def get_user_details(self, obj):
        return {
            "id": obj.user.id,
            "name": f"{obj.user.first_name} {obj.user.last_name}",
            "avatar": obj.user.avatar_url
        }


class PostLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostLike
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    user_details = serializers.SerializerMethodField()
    comments = PostCommentSerializer(many=True, read_only=True)
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)

    class Meta:
        model = Post
        fields = '__all__'

    def get_user_details(self, obj):
        return {
            "id": obj.user.id,
            "name": f"{obj.user.first_name} {obj.user.last_name}",
            "avatar": obj.user.avatar_url
        }


# =============================================================================
# JOB & EVENT SERIALIZERS
# =============================================================================

class JobSerializer(serializers.ModelSerializer):
    posted_by_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Job
        fields = '__all__'

    def get_posted_by_name(self, obj):
        if obj.posted_by:
            return f"{obj.posted_by.first_name} {obj.posted_by.last_name}"
        return None


class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = '__all__'


class EventSerializer(serializers.ModelSerializer):
    attendee_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Event
        fields = '__all__'

    def get_attendee_count(self, obj):
        return obj.attendees.count()


class EventAttendeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventAttendee
        fields = '__all__'


# =============================================================================
# COMMUNICATION SERIALIZERS
# =============================================================================

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Message
        fields = '__all__'

    def get_sender_name(self, obj):
        return f"{obj.sender.first_name} {obj.sender.last_name}"


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


class GalleryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryItem
        fields = '__all__'


# =============================================================================
# MENTORSHIP SERIALIZERS
# =============================================================================

class MentorshipRequestSerializer(serializers.ModelSerializer):
    mentee_details = UserSerializer(source='mentee', read_only=True)
    mentor_details = UserSerializer(source='mentor', read_only=True)

    class Meta:
        model = MentorshipRequest
        fields = '__all__'


# =============================================================================
# HOMEPAGE / STATIC CONTENT SERIALIZERS
# =============================================================================

class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = '__all__'


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'


class WhyJoinSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhyJoin
        fields = '__all__'
