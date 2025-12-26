from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.conf import settings
import logging

from .serializers import FirebaseUserSerializer
from .services import sync_firebase_user, deactivate_firebase_user

logger = logging.getLogger(__name__)

def verify_firebase_secret(request):
    """
    Verify the Firebase webhook secret from request headers
    """
    print('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',request.data)
    secret = request.headers.get("X-Firebase-Secret")
    expected_secret = getattr(settings, 'FIREBASE_WEBHOOK_SECRET', None)
    
    logger.info(f"🔐 Verifying secret...")
    logger.debug(f"Received: {secret[:20]}..." if secret else "None")
    logger.debug(f"Expected: {expected_secret[:20]}..." if expected_secret else "None")
    
    if not expected_secret:
        logger.error("❌ FIREBASE_WEBHOOK_SECRET not configured in settings!")
        return False
    
    is_valid = secret == expected_secret
    logger.info(f"{'✅' if is_valid else '❌'} Secret validation: {is_valid}")
    return is_valid


@api_view(["POST"])
@permission_classes([AllowAny])
def firebase_user_created(request):
    """
    Webhook endpoint for Firebase user creation/update
    """
    logger.info("=" * 60)
    logger.info("📥 Received firebase_user_created webhook")
    logger.info(f"Data: {request.data}")
    logger.info("=" * 60)
    
    if not verify_firebase_secret(request):
        logger.warning("❌ Unauthorized webhook attempt - invalid secret")
        return Response({"detail": "Unauthorized"}, status=401)

    serializer = FirebaseUserSerializer(data=request.data)
    if not serializer.is_valid():
        logger.error(f"❌ Invalid webhook data: {serializer.errors}")
        return Response(serializer.errors, status=400)

    try:
        user = sync_firebase_user(serializer.validated_data)
        response_data = {
            "status": "synced",
            "user_id": user.id,
            "firebase_uid": user.firebase_uid,
            "email": user.email
        }
        logger.info(f"✅ Successfully synced user: {response_data}")
        return Response(response_data, status=200)
    except Exception as e:
        logger.error(f"❌ Error in firebase_user_created: {str(e)}")
        return Response({"detail": str(e)}, status=500)


@api_view(["POST"])
@permission_classes([AllowAny])
def firebase_user_deleted(request):
    """
    Webhook endpoint for Firebase user deletion
    """
    logger.info("=" * 60)
    logger.info("📥 Received firebase_user_deleted webhook")
    logger.info(f"Data: {request.data}")
    logger.info("=" * 60)
    
    if not verify_firebase_secret(request):
        logger.warning("❌ Unauthorized webhook attempt - invalid secret")
        return Response({"detail": "Unauthorized"}, status=401)

    uid = request.data.get("uid")
    if not uid:
        return Response({"detail": "uid is required"}, status=400)

    try:
        success = deactivate_firebase_user(uid)
        return Response({
            "status": "deactivated" if success else "not_found",
            "firebase_uid": uid
        }, status=200)
    except Exception as e:
        logger.error(f"❌ Error in firebase_user_deleted: {str(e)}")
        return Response({"detail": str(e)}, status=500)


# TEST ENDPOINT - Remove in production
@api_view(["POST"])
@permission_classes([AllowAny])
def firebase_user_created_test(request):
    """
    TEST ENDPOINT - No authentication required
    """
    logger.info("🧪 TEST MODE - Received data: {request.data}")
    
    serializer = FirebaseUserSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    try:
        user = sync_firebase_user(serializer.validated_data)
        return Response({
            "status": "synced",
            "user_id": user.id,
            "firebase_uid": user.firebase_uid,
            "email": user.email,
            "message": "⚠️ TEST MODE - Authentication bypassed"
        }, status=200)
    except Exception as e:
        return Response({"detail": str(e)}, status=500)