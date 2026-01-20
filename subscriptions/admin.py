from django.contrib import admin
from .models import UserSubscription

@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan', 'status', 'start_date', 'end_date')
    list_filter = ('status', 'plan')
    search_fields = ('user__email', 'plan__name')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')