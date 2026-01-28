from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
import logging
from rest_framework.views import APIView, status
from .serializers import FirebaseUserSerializer, AppUserSerializer, UserProfileUpdateSerializer
from .services import sync_firebase_user, deactivate_firebase_user
from .models import AppUser
from django.utils import timezone


logger = logging.getLogger(__name__)


def verify_firebase_secret(request):
    """
    Verify the Firebase webhook secret from request headers
    """
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
    logger.info("Received firebase_user_created webhook")
    logger.info(f"Data: {request.data}")
    logger.info("=" * 60)
    
    if not verify_firebase_secret(request):
        logger.warning("Unauthorized webhook attempt - invalid secret")
        return Response({"detail": "Unauthorized"}, status=401)

    serializer = FirebaseUserSerializer(data=request.data)
    if not serializer.is_valid():
        logger.error(f"Invalid webhook data: {serializer.errors}")
        return Response(serializer.errors, status=400)

    try:
        user = sync_firebase_user(serializer.validated_data)
        response_data = {
            "status": "synced",
            "user_id": user.id,
            "firebase_uid": user.firebase_uid,
            "email": user.email,
            "full_name": user.full_name
        }
        logger.info(f"Successfully synced user: {response_data}")
        return Response(response_data, status=200)
    except Exception as e:
        logger.error(f"Error in firebase_user_created: {str(e)}")
        return Response({"detail": str(e)}, status=500)


@api_view(["POST"])
@permission_classes([AllowAny])
def firebase_user_deleted(request):
    """
    Webhook endpoint for Firebase user deletion
    """
    logger.info("=" * 60)
    logger.info("Received firebase_user_deleted webhook")
    logger.info(f"Data: {request.data}")
    logger.info("=" * 60)
    
    if not verify_firebase_secret(request):
        logger.warning("Unauthorized webhook attempt - invalid secret")
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
        logger.error(f"Error in firebase_user_deleted: {str(e)}")
        return Response({"detail": str(e)}, status=500)


# TEST ENDPOINT - Remove in production
@api_view(["POST"])
@permission_classes([AllowAny])
def firebase_user_created_test(request):
    """
    TEST ENDPOINT - No authentication required
    """
    logger.info(f"TEST MODE - Received data: {request.data}")
    
    serializer = FirebaseUserSerializer(data=request.data)
    if not serializer.is_valid():
        logger.error(f"Validation errors: {serializer.errors}")
        return Response(serializer.errors, status=400)

    try:
        user = sync_firebase_user(serializer.validated_data)
        return Response({
            "status": "synced",
            "user_id": user.id,
            "firebase_uid": user.firebase_uid,
            "email": user.email,
            "full_name": user.full_name,
            "message": "TEST MODE - Authentication bypassed"
        }, status=200)
    except Exception as e:
        logger.error(f"Error in test endpoint: {str(e)}")
        return Response({"detail": str(e)}, status=500)
    
class CurrentUserView(APIView):
    """
    Get current authenticated user profile
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = AppUserSerializer(request.user)
        return Response(serializer.data)


class UserProfileUpdateView(APIView):
    """
    Update current user profile
    """
    permission_classes = [IsAuthenticated]
    
    def patch(self, request):
        user = request.user
        serializer = UserProfileUpdateSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save(updated_at=timezone.now())
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        user = request.user
        serializer = UserProfileUpdateSerializer(user, data=request.data)
        
        if serializer.is_valid():
            serializer.save(updated_at=timezone.now())
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserBillingProfileView(APIView):
    """
    Get or create user billing profile
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        billing_profile = user.get_or_create_billing_profile()
        
        return Response({
            'billing_name': billing_profile.billing_name,
            'email': billing_profile.email,
            'country_code': billing_profile.country_code,
            'currency': billing_profile.currency,
        })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sync_user_from_firebase(request):
    """
    Manually sync user data from Firebase
    """
    user = request.user
    
    try:
        from firebase_admin import auth
        
        # Get fresh data from Firebase
        firebase_user = auth.get_user(user.firebase_uid)
        
        # Update user data
        user.email = firebase_user.email or user.email
        user.email_verified = firebase_user.email_verified
        user.full_name = firebase_user.display_name or user.full_name
        user.display_name = firebase_user.display_name or user.display_name
        user.phone_number = firebase_user.phone_number or user.phone_number
        user.photo_url = firebase_user.photo_url or user.photo_url
        user.last_sync_attempt = timezone.now()
        user.user_synced_to_django = True
        user.synced_to_django_error = ''
        user.save()
        
        serializer = AppUserSerializer(user)
        return Response({
            'message': 'User synced successfully',
            'user': serializer.data
        })
        
    except Exception as e:
        user.last_sync_attempt = timezone.now()
        user.synced_to_django_error = str(e)
        user.save()
        
        return Response({
            'error': 'Failed to sync user',
            'detail': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Optional: Function-based view alternative
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """
    Alternative function-based view to get current user
    """
    serializer = AppUserSerializer(request.user)
    return Response(serializer.data)