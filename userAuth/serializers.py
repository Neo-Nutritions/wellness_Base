from rest_framework import serializers

class FirebaseUserSerializer(serializers.Serializer):
    uid = serializers.CharField()
    email = serializers.EmailField(required=False, allow_blank=True, allow_null=True)
    displayName = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    phoneNumber = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    fullName = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    phone = serializers.CharField(required=False, allow_blank=True, allow_null=True)