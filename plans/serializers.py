from rest_framework import serializers
from plans.models import SubscriptionPlan

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'price',
            'currency',
            'billing_period',
            'trial_period_days',
            'is_active',
            'is_public',
            'sort_order',
            'highlighted',
            'created_at',
            'updated_at',
            'features', 
        ]