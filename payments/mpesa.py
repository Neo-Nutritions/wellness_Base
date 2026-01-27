def initiate_stk_push(phone, amount, payment_intent):
    """
    Sends STK push and stores CheckoutRequestID
    """
    response = {
        "CheckoutRequestID": "ws_CO_123456789"
    }

    # Save reference
    payment_intent.provider_reference = response["CheckoutRequestID"]
    payment_intent.save(update_fields=["provider_reference"])
