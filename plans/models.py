import uuid
from django.db import models

class SubscriptionPlan(models.Model):
    """
    Defines what a subscription plan offers to users.
    id: Auto-generated primary key.
    """

    BILLING_PERIOD_CHOICES = [
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
        ('lifetime', 'Lifetime'),
        ('quarterly', 'Quarterly'),
    ]
    CURRENCY_CHOICES = [
        ('KES', 'Kenyan Shilling'),
        ('USD', 'US Dollar'),
        ('EUR', 'Euro'),
        ('GBP', 'British Pound'),
    ]


    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    #Identity
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField(blank=True)

    # Billing
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='KES')
    billing_period = models.CharField(max_length=10, choices=BILLING_PERIOD_CHOICES, default='monthly')

    #Trial
    trial_period_days = models.PositiveIntegerField(default=0, help_text="Number of trial days offered with this plan.")

    #Visibility and life cycle
    is_active = models.BooleanField(default=True, help_text="Designates whether this plan is active.")
    is_public = models.BooleanField(default=True, help_text="Designates whether this plan is visible to users.")
    sort_order = models.PositiveIntegerField(default=0, help_text="Determines the order in which plans are displayed.")
    highlighted = models.BooleanField(default=False, help_text="If true, this plan is highlighted in the UI.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.billing_period})"