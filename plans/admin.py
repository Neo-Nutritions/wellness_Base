from django.contrib import admin
from .models import SubscriptionPlan, PlanEntitlement

@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'billing_period', 'price', 'currency', 'is_active', 'is_public', 'highlighted', 'sort_order','features')
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
        ('Features', {
            'fields': ('features',)
        }),
    )

@admin.register(PlanEntitlement)
class PlanEntitlementAdmin(admin.ModelAdmin):
    list_display = ('plan', 'key', 'value', 'description')
    list_filter = ('plan',)
    search_fields = ('key', 'description')
    ordering = ('plan', 'key')
    readonly_fields = ('created_at',)
    fieldsets = (
        (None, {
            'fields': ('plan', 'key', 'value', 'description')
        }),
        ('Timestamps', {
            'fields': ('created_at',)
        }),
    )