from django.db import models
import uuid
from userAuth.models import AppUser
class BillingRecord(models.Model):
    """
    Represents a billing record for a user.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name='billing_records')
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

    def __str__(self):
        return f"BillingRecord for {self.user.email} - {self.billing_name}"