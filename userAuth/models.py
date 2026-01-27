from django.db import models
from django.contrib.auth.models import AbstractUser
from billing.models import BillingRecord
from django.utils import timezone


class Administrator(AbstractUser):
    pass


class AppUser(models.Model):
    firebase_uid = models.CharField(max_length=128, unique=True, db_index=True)
    email = models.EmailField(unique=True)
    email_verified = models.BooleanField(default=False)
    is_anonymous = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_creator = models.BooleanField(default=False)
    full_name = models.CharField(max_length=255, null=True, blank=True)
    display_name = models.CharField(max_length=255, null=True, blank=True)
    phone_number = models.CharField(max_length=30, null=True, blank=True)
    photo_url = models.URLField(null=True, blank=True)
    provider_data = models.JSONField(default=list, blank=True, null=True)
    tenant_id = models.CharField(max_length=128, null=True, blank=True)
    firebase_created_at = models.CharField(max_length=64, null=True, blank=True)
    firebase_last_login_at = models.CharField(max_length=64, null=True, blank=True)
    user_synced_to_django = models.BooleanField(default=True)
    last_sync_attempt = models.DateTimeField(null=True, blank=True)
    synced_to_django_error = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    @property
    def is_authenticated(self):
        """
        Always return True. This is a way to tell if the user has been authenticated.
        """
        return True
    
    @property
    def is_staff(self):
        """
        Returns True if user is a staff member (for admin access).
        You can customize this logic based on your needs.
        """
        return False  

    @property
    def is_superuser(self):
        """
        Returns True if user is a superuser.
        """
        return False

    def get_or_create_billing_record(self):
        billing_record, _ = BillingRecord.objects.get_or_create(
            user=self,
            defaults={
                "billing_name": self.full_name or "Unnamed",
                "email": self.email,
                "country_code": "KE",
                "currency": "KES",
            },
        )
        return billing_record

    def __str__(self):
        return self.email or self.firebase_uid

    class Meta:
        ordering = ["-created_at"]