from rest_framework import serializers
from .models import AppUser

class FirebaseUserSerializer(serializers.Serializer):
    uid = serializers.CharField(required=True)
    
    email = serializers.EmailField(required=False, allow_null=True, allow_blank=True)
    email_verified = serializers.BooleanField(required=False, default=False)
    is_anonymous = serializers.BooleanField(required=False, default=False)
    is_active = serializers.BooleanField(required=False, default=True)
    display_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    full_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    phone_number = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    photo_url = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    provider_data = serializers.JSONField(required=False)
    tenant_id = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    firebase_created_at = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    firebase_last_login_at = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    user_synced_to_django = serializers.BooleanField(required=False, default=False)
    last_sync_attempt = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    synced_to_django_error = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    created_at = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    updated_at = serializers.CharField(required=False, allow_blank=True, allow_null=True)

class AppUserSerializer(serializers.ModelSerializer):
    """
    Serializer for AppUser model
    """
    
    class Meta:
        model = AppUser
        fields = [
            'id',
            'firebase_uid',
            'email',
            'email_verified',
            'is_anonymous',
            'is_active',
            'is_creator',
            'full_name',
            'display_name',
            'phone_number',
            'photo_url',
            'provider_data',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'firebase_uid',
            'email',
            'email_verified',
            'created_at',
            'updated_at',
        ]


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user profile
    """
    
    class Meta:
        model = AppUser
        fields = [
            'full_name',
            'display_name',
            'phone_number',
            'photo_url',
        ]