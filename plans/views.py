from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from plans.models import SubscriptionPlan
from plans.serializers import SubscriptionPlanSerializer

class SubscriptionPlanListView(generics.ListAPIView):
    """
    List all active public subscription plans.
    """
    queryset = SubscriptionPlan.objects.filter(
        is_active=True,
        is_public=True
    ).order_by('sort_order', 'price')
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [AllowAny]
class SubscriptionPlanDetailView(generics.RetrieveAPIView):
    """
    Retrieve a specific subscription plan by ID.
    """
    queryset = SubscriptionPlan.objects.filter(
        is_active=True,
        is_public=True
    )
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"
