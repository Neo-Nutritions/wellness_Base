from django.urls import path
from .views import (
    firebase_user_created, 
    firebase_user_deleted,
    firebase_user_created_test
)

app_name = 'users'

urlpatterns = [
    path("webhooks/firebase/user-created/", firebase_user_created, name="firebase_user_created"),
    path("webhooks/firebase/user-deleted/", firebase_user_deleted, name="firebase_user_deleted"),
    path("webhooks/firebase/user-created-test/", firebase_user_created_test, name="firebase_user_created_test"),
]