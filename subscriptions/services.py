from django.utils import timezone
from datetime import timedelta

def activate_subscription(subscription):
    """
    Activates a subscription based on its plan.
    Handles trial periods and ensures idempotency.
    """

    if not subscription or subscription.status in ["active", "trialing"]:
        # Already active or trialing, do nothing
        return subscription

    now = timezone.now()
    plan = subscription.plan

    if not plan:
        raise ValueError("Subscription has no plan assigned")

    # Determine start and end dates
    subscription.start_date = now

    if plan.trial_days and plan.trial_days > 0:
        subscription.status = "trialing"
        subscription.end_date = now + timedelta(days=plan.trial_days)
    else:
        subscription.status = "active"
        subscription.end_date = now + timedelta(days=plan.duration_days)

    # Save changes
    subscription.save(update_fields=["status", "start_date", "end_date"])
    return subscription
