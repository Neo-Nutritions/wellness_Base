# payments/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from payments.models import PaymentIntent
from subscriptions.services import activate_subscription

class MpesaCallbackView(APIView):
    authentication_classes = []  # M-Pesa callback is public
    permission_classes = []

    def post(self, request):
        data = request.data

        try:
            checkout_id = data["Body"]["stkCallback"]["CheckoutRequestID"]
            result_code = data["Body"]["stkCallback"]["ResultCode"]
        except KeyError:
            return Response({"error": "Invalid callback structure"}, status=400)

        # Get pending payment intent
        try:
            payment = PaymentIntent.objects.get(
                provider_reference=checkout_id,
                status="pending"
            )
        except PaymentIntent.DoesNotExist:
            return Response({"error": "Invalid or already used payment reference"}, status=400)

        # Save raw callback
        payment.raw_callback = data

        if result_code == 0:
            payment.status = "success"
            payment.save(update_fields=["status", "raw_callback"])
            activate_subscription(payment.subscription)  # Activate subscription
        else:
            payment.status = "failed"
            payment.save(update_fields=["status", "raw_callback"])

        return Response({"status": "ok"})
