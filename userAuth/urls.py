from django.urls import path
from .views import (
    firebase_user_created, 
    firebase_user_deleted,
    firebase_user_created_test,
    CurrentUserView,
    UserProfileUpdateView,
    UserBillingProfileView,
    sync_user_from_firebase,
    get_current_user
)

app_name = 'users'

urlpatterns = [
    path("webhooks/firebase/user-created/", firebase_user_created, name="firebase_user_created"),
    path("webhooks/firebase/user-deleted/", firebase_user_deleted, name="firebase_user_deleted"),
    path("webhooks/firebase/user-created-test/", firebase_user_created_test, name="firebase_user_created_test"),
    path('user/me/', CurrentUserView.as_view(), name='current-user'),
    path('user/profile/', UserProfileUpdateView.as_view(), name='update-profile'),
    path('user/billing/', UserBillingProfileView.as_view(), name='user-billing'),
    path('user/sync/', sync_user_from_firebase, name='sync-user'),
    path('user/current/', get_current_user, name='get-current-user'),
]