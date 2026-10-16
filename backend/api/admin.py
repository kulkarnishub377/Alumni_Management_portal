from django.contrib import admin
from .models import (
    Department, User, AlumniProfile, MentorProfile, UserSocialLink,
    UserExperience, Post, PostLike, PostComment, Job, Event,
    EventAttendee, Message, Notification, GalleryItem,
    JobApplication, MentorshipRequest, Announcement, Testimonial, WhyJoin
)

# Customize User Admin to show custom fields
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'role', 'status', 'department', 'batch_year')
    list_filter = ('role', 'status', 'department', 'batch_year')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('-created_at',)

@admin.register(AlumniProfile)
class AlumniProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'current_company', 'current_role')
    search_fields = ('user__email', 'current_company')

@admin.register(MentorProfile)
class MentorProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'specialization', 'active_mentees', 'max_mentees')

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'job_type', 'status', 'posted_by', 'created_at')
    list_filter = ('status', 'job_type')

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'event_date', 'category', 'created_by')
    list_filter = ('category', 'event_date')

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('user', 'post_type', 'created_at')
    list_filter = ('post_type',)

# Register the rest simply
admin.site.register(Department)
admin.site.register(UserSocialLink)
admin.site.register(UserExperience)
admin.site.register(PostLike)
admin.site.register(PostComment)
admin.site.register(EventAttendee)
admin.site.register(Message)
admin.site.register(Notification)
admin.site.register(GalleryItem)
admin.site.register(JobApplication)
admin.site.register(MentorshipRequest)
admin.site.register(Announcement)
admin.site.register(Testimonial)
admin.site.register(WhyJoin)

# Change Admin Titles
admin.site.site_header = "Alumni Portal Superadmin"
admin.site.site_title = "Admin Portal"
admin.site.index_title = "Welcome to the Alumni Platform Back-Office"
