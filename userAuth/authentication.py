from rest_framework import authentication
from rest_framework import exceptions
from firebase_admin import auth
from django.utils import timezone
from .models import AppUser


class FirebaseAuthentication(authentication.BaseAuthentication):
    """
    Custom authentication class for Firebase tokens
    """
    
    def authenticate(self, request):
        # Get authorization header
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        
        if not auth_header:
            return None
        
        # Check if it's a Bearer token
        if not auth_header.startswith('Bearer '):
            return None
        
        # Extract token
        id_token = auth_header.split('Bearer ')[1]
        
        try:
            # Verify the Firebase token
            decoded_token = auth.verify_id_token(id_token)
            firebase_uid = decoded_token['uid']
            
            # Get or create user
            user = self.get_or_create_user(decoded_token)
            
            # Return (user, auth) tuple
            # The second value can be the token or None
            return (user, decoded_token)
            
        except auth.InvalidIdTokenError:
            raise exceptions.AuthenticationFailed('Invalid Firebase token')
        except auth.ExpiredIdTokenError:
            raise exceptions.AuthenticationFailed('Firebase token has expired')
        except Exception as e:
            raise exceptions.AuthenticationFailed(f'Authentication failed: {str(e)}')
    
    def get_or_create_user(self, decoded_token):
        """
        Get or create AppUser from Firebase token
        """
        firebase_uid = decoded_token.get('uid')
        email = decoded_token.get('email', '')
        
        try:
            # Try to get existing user
            user = AppUser.objects.get(firebase_uid=firebase_uid)
            
            # Update last login time
            user.firebase_last_login_at = str(decoded_token.get('auth_time', ''))
            user.last_sync_attempt = timezone.now()
            user.save(update_fields=['firebase_last_login_at', 'last_sync_attempt'])
            
            return user
            
        except AppUser.DoesNotExist:
            # Create new user from Firebase data
            user = AppUser.objects.create(
                firebase_uid=firebase_uid,
                email=email,
                email_verified=decoded_token.get('email_verified', False),
                full_name=decoded_token.get('name', ''),
                display_name=decoded_token.get('name', ''),
                phone_number=decoded_token.get('phone_number', ''),
                photo_url=decoded_token.get('picture', ''),
                provider_data=decoded_token.get('firebase', {}).get('identities', []),
                firebase_created_at=str(decoded_token.get('auth_time', '')),
                firebase_last_login_at=str(decoded_token.get('auth_time', '')),
                user_synced_to_django=True,
                last_sync_attempt=timezone.now(),
            )
            return user