# subscriptions/views.py
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from .serializers import SubscriptionCreateSerializer
from subscriptions.models import UserSubscription
from payments.models import PaymentIntent
from payments.mpesa import initiate_stk_push


class SubscribePlanView(generics.CreateAPIView):
    serializer_class = SubscriptionCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user

        # Ensure billing profile exists
        user.get_or_create_billing_record()

        # Save subscription as pending
        subscription = serializer.save(user=user, status="pending")

        # Create PaymentIntent
        payment = PaymentIntent.objects.create(
            user=user,
            subscription=subscription,
            amount=subscription.plan.price,
            currency=subscription.plan.currency,
            status="pending"
        )

        # Initiate STK push
        initiate_stk_push(
            phone=user.phone_number,
            amount=payment.amount,
            payment_intent=payment
        )

        return subscription

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subscription = self.perform_create(serializer)

        # Retrieve the payment reference
        payment_ref = subscription.paymentintent_set.first().provider_reference

        return Response({
            "subscription_id": subscription.id,
            "payment_reference": payment_ref,
            "status": subscription.status
        }, status=status.HTTP_201_CREATED)
