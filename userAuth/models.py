from django.db import models
from django.contrib.auth.models import AbstractUser

class Administrator(AbstractUser):
    pass


class AppUser(models.Model):
    # Core Firebase identity
    firebase_uid = models.CharField(max_length=128, unique=True, db_index=True)
    email = models.EmailField(unique=True)
    email_verified = models.BooleanField(default=False)
    is_anonymous = models.BooleanField(default=False)

    # Profile
    full_name = models.CharField(max_length=255, blank=True)
    display_name = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=30, blank=True)
    photo_url = models.URLField(blank=True)

    # Firebase metadata
    provider_data = models.JSONField(blank=True, null=True)
    tenant_id = models.CharField(max_length=128, blank=True)

    # Firebase timestamps (converted from ms)
    firebase_created_at = models.DateTimeField(null=True, blank=True)
    firebase_last_login_at = models.DateTimeField(null=True, blank=True)

    # App-level flags
    is_active = models.BooleanField(default=True)
    is_creator = models.BooleanField(default=False)

    # Sync tracking (from second log)
    user_synced_to_django = models.BooleanField(default=False)
    last_sync_attempt = models.DateTimeField(null=True, blank=True)
    synced_to_django_error = models.TextField(blank=True)

    # Local timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email or self.firebase_uid

    class Meta:
        ordering = ['-created_at']
