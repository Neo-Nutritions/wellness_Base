import uuid
from django.db import models
from django.utils import timezone
from userAuth.models import AppUser
from plans.models import SubscriptionPlan


class UserSubscription(models.Model):
    """
    Represents a user's subscription to a plan.
    """
    STATUS_CHOICES = (
        ('inactive', 'Inactive'),
        ('trialing', 'Trialing'),
        ('active', 'Active'),
        ('past_due', 'Past Due'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.PROTECT, related_name='user_subscriptions')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='inactive')
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    auto_renew = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    trial_end_date = models.DateTimeField(null=True, blank=True)

    def is_active(self):
        now = timezone.now()
        return (
            self.status in ['active', 'trialing'] and
            (self.end_date is None or self.end_date > now)
        )

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
        ]

    def __str__(self):
        return f"Subscription of {self.plan} to {self.status}"