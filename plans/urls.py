from django.urls import path
from .views import SubscriptionPlanDetailView, SubscriptionPlanListView

urlpatterns = [
    path("plans/", SubscriptionPlanListView.as_view()),
    path("plans/<uuid:id>/", SubscriptionPlanDetailView.as_view()),
]
