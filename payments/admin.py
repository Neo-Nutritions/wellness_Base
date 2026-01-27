from django.contrib import admin
from .models import PaymentIntent

@admin.register(PaymentIntent)
class PaymentIntentAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "subscription", "amount", "currency", "provider", "status", "created_at")
    list_filter = ("status", "provider", "created_at")
    search_fields = ("user__username", "provider_reference")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)

    