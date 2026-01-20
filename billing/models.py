from django.db import models
import uuid
from django.utils import timezone
class BillingRecord(models.Model):
    """
    Represents a billing record for a user.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField('userAuth.AppUser', on_delete=models.CASCADE, related_name='billing_records')
    billing_name = models.CharField(max_length=255)
    email = models.EmailField()
    country_code = models.CharField(max_length=2)
    tax_id = models.CharField(max_length=50, blank=True, help_text="Tax ID/ VAT for the billing record")
    is_tax_exempt = models.BooleanField(default=False)
    default_payment_method = models.CharField(
        max_length=50,
        choices=[
            ("card", "Card"),
            ("mpesa", "M-Pesa"),
            ("cash", "Cash"),
            ("bank", "Bank Transfer"),
            ("paypal", "PayPal"),
        ],
        default="mpesa"
    )
    stripe_customer_id = models.CharField(max_length=255, blank=True, help_text="Stripe Customer ID")
    mpesa_customer_ref = models.CharField(max_length=255, blank=True, help_text="M-Pesa Customer Reference")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"BillingRecord for {self.user.email} - {self.billing_name}"
    

class Payment(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("failed", "Failed"),
        ("refunded", "Refunded"),
    ]

    PAYMENT_METHOD_CHOICES = [
        ("card", "Card"),
        ("mpesa", "M-Pesa"),
        ("cash", "Cash"),
        ("bank", "Bank Transfer"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    billing_record = models.ForeignKey(BillingRecord, on_delete=models.CASCADE, related_name='payments')
    user = models.ForeignKey('userAuth.AppUser', on_delete=models.CASCADE, related_name='payments')
    subscription = models.ForeignKey('subscriptions.UserSubscription', on_delete=models.SET_NULL, related_name='payments', null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='KES')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='mpesa')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    transaction_id = models.CharField(max_length=255, blank=True, help_text="External payment gateway transaction ID")
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['subscription', 'status']),
        ]
    def __str__(self):
        return f"Payment of {self.amount} {self.currency} by {self.user.email} - {self.status}"
    
    def mark_completed(self):
        self.status = 'completed'
        self.completed_at = timezone.now()
        self.save()