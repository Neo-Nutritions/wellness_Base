from rest_framework import generics 
from plans.models import SubscriptionPlan
from plans.serializers import SubscriptionPlanSerializer
from rest_framework.permissions import AllowAny

class SubscriptionPlanListView(generics.ListAPIView):
    """
    API view to list all active subscription plans.
    """
    queryset = SubscriptionPlan.objects.filter(is_active=True, is_public=True).order_by('sort_order', 'price')
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [AllowAny]