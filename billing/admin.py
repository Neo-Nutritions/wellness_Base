from django.contrib import admin
from .models import BillingRecord

@admin.register(BillingRecord)
class BillingRecordAdmin(admin.ModelAdmin):
    list_display = ('user', 'billing_name', 'email', 'country_code', 'is_tax_exempt', 'default_payment_method', 'is_active', 'created_at')
    list_filter = ('is_tax_exempt', 'default_payment_method', 'is_active', 'country_code')
    search_fields = ('user__email', 'billing_name', 'email', 'stripe_customer_id', 'mpesa_customer_ref')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    