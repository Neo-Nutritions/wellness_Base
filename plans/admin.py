from django.contrib import admin
from .models import SubscriptionPlan

@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'billing_period', 'price', 'currency', 'is_active', 'is_public', 'highlighted', 'sort_order')
    list_filter = ('billing_period', 'currency', 'is_active', 'is_public', 'highlighted')
    search_fields = ('name', 'slug', 'description')
    ordering = ('sort_order', 'name')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('name', 'slug', 'description')
        }),
        ('Billing Information', {
            'fields': ('price', 'currency', 'billing_period')
        }),
        ('Trial Period', {
            'fields': ('trial_period_days',)
        }),
        ('Visibility and Life Cycle', {
            'fields': ('is_active', 'is_public', 'highlighted', 'sort_order')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )