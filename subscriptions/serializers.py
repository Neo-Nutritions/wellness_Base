from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import UserSubscription

class SubscriptionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSubscription
        fields = ["plan", "auto_renew"]

    def validate(self, attrs):
        user = self.context["request"].user

        if UserSubscription.objects.filter(
            user=user,
            status__in=["pending", "trialing", "active"]
        ).exists():
            raise ValidationError(
                "You already have a subscription in progress."
            )

        return attrs
