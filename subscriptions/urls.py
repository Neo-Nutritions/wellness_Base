from django.urls import path
from .views import SubscribePlanView

urlpatterns = [
    path("subscribe/", SubscribePlanView.as_view(), name="subscribe-plan"),
]
