from .models import AppUser
import logging
from django.utils import timezone
from datetime import datetime

logger = logging.getLogger(__name__)

def ms_to_datetime(ms):
    """
    Convert Firebase milliseconds timestamp to timezone-aware datetime.
    Returns None if input is None or invalid.
    """
    if not ms:
        return None
    try:
        ms = int(ms)
        return datetime.fromtimestamp(ms / 1000, tz=timezone.utc)
    except Exception:
        return None

def sync_firebase_user(payload: dict):
    """
    Create or update a user based on Firebase data
    """
    try:
        uid = payload["uid"]
        email = payload.get("email", "")
        phone = payload.get("phone_number", "")
        email_verified = bool(payload.get("email_verified", False))
        is_anonymous = bool(payload.get("is_anonymous", False))
        is_active = bool(payload.get("is_active", True))  # fallback to True

        firebase_created_at = ms_to_datetime(payload.get("firebase_created_at"))
        firebase_last_login_at = ms_to_datetime(payload.get("firebase_last_login_at"))
        created_at = ms_to_datetime(payload.get("created_at")) or timezone.now()
        updated_at = ms_to_datetime(payload.get("updated_at")) or timezone.now()
        last_sync_attempt = ms_to_datetime(payload.get("last_sync_attempt"))

        user, created = AppUser.objects.update_or_create(
            firebase_uid=uid,
            defaults={
                "email": email,
                "full_name": email,
                "phone_number": phone,
                "is_active": is_active,
                "email_verified": email_verified,
                "is_anonymous": is_anonymous,
                "created_at": created_at,
                "updated_at": updated_at,
                "firebase_created_at": firebase_created_at,
                "firebase_last_login_at": firebase_last_login_at,
                "provider_data": payload.get("provider_data") or {},
                "tenant_id": payload.get("tenant_id") or "",
                "photo_url": payload.get("photo_url") or "",
                "display_name": payload.get("display_name") or "",
                "user_synced_to_django": bool(payload.get("user_synced_to_django", False)),
                "last_sync_attempt": last_sync_attempt,
                "synced_to_django_error": payload.get("synced_to_django_error") or "",
            },
        )

        action = "created" if created else "updated"
        logger.info(f"User {action}: {user.email} (UID: {uid})")
        return user

    except Exception as e:
        logger.error(f"Error syncing Firebase user: {str(e)}")
        raise

def deactivate_firebase_user(uid: str):
    """
    Deactivate a user when deleted from Firebase
    """
    try:
        updated = AppUser.objects.filter(firebase_uid=uid).update(is_active=False)
        if updated:
            logger.info(f"Deactivated user: {uid}")
        else:
            logger.warning(f"User not found for deactivation: {uid}")
        return updated > 0
    except Exception as e:
        logger.error(f"Error deactivating Firebase user: {str(e)}")
        raise
