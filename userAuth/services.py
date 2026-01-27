from .models import AppUser
import logging
from django.utils import timezone
from datetime import datetime
from email.utils import parsedate_to_datetime

logger = logging.getLogger(__name__)

def parse_firebase_timestamp(timestamp):
    """
    Convert Firebase timestamp to timezone-aware datetime.
    Handles both milliseconds (int) and date strings.
    Returns None if input is None or invalid.
    """
    if not timestamp:
        return None
    
    try:
        # If it's a number (milliseconds)
        if isinstance(timestamp, (int, float)):
            return datetime.fromtimestamp(timestamp / 1000, tz=timezone.utc)
        # If it's a string, parse it
        if isinstance(timestamp, str):
            # Try parsing RFC 2822 format (e.g., 'Fri, 23 Jan 2026 20:55:15 GMT')
            try:
                dt = parsedate_to_datetime(timestamp)
                return dt
            except:
                # Try ISO format
                return datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
    except Exception as e:
        logger.warning(f"Failed to parse timestamp '{timestamp}': {e}")
        return None


def sync_firebase_user(payload: dict):
    """
    Create or update a user based on Firebase data
    """
    try:
        uid = payload["uid"]
        email = payload.get("email", "")
        full_name = payload.get("full_name", "")
        phone_number = payload.get("phone_number", "")
        email_verified = bool(payload.get("email_verified", False))
        is_anonymous = bool(payload.get("is_anonymous", False))
        is_active = bool(payload.get("is_active", True))

        firebase_created_at = parse_firebase_timestamp(payload.get("firebase_created_at"))
        firebase_last_login_at = parse_firebase_timestamp(payload.get("firebase_last_login_at"))
        created_at = parse_firebase_timestamp(payload.get("created_at")) or timezone.now()
        updated_at = parse_firebase_timestamp(payload.get("updated_at")) or timezone.now()
        last_sync_attempt = parse_firebase_timestamp(payload.get("last_sync_attempt", None)) or timezone.now()

        user, created = AppUser.objects.update_or_create(
            firebase_uid=uid,
            defaults={
                "email": email,
                "full_name": full_name,
                "phone_number": phone_number,
                "is_active": is_active,
                "email_verified": email_verified,
                "is_anonymous": is_anonymous,
                "created_at": created_at,
                "updated_at": updated_at,
                "firebase_created_at": str(firebase_created_at) if firebase_created_at else "",
                "firebase_last_login_at": str(firebase_last_login_at) if firebase_last_login_at else "",
                "provider_data": payload.get("provider_data") or [],
                "tenant_id": payload.get("tenant_id") or "",
                "photo_url": payload.get("photo_url") or "",
                "display_name": payload.get("display_name") or "",
                "user_synced_to_django": bool(payload.get("user_synced_to_django", True)),
                "last_sync_attempt": last_sync_attempt,
                "synced_to_django_error": payload.get("synced_to_django_error") or "",
            },
        )

        action = "created" if created else "updated"
        logger.info(f"User {action}: {user.email} (UID: {uid}, full_name: {full_name})")
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