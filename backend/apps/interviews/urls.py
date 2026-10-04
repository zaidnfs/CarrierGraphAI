"""
URL patterns for the interviews app (TASK-052).
"""
from django.urls import path
from apps.interviews.views import (
    InterviewSessionListCreateView,
    InterviewSessionDetailView,
    SubmitAnswerView,
    CompleteSessionView,
    SuggestedRolesView,
)

app_name = "interviews"

urlpatterns = [
    path("sessions/", InterviewSessionListCreateView.as_view(), name="session-list-create"),
    path("sessions/<uuid:session_id>/", InterviewSessionDetailView.as_view(), name="session-detail"),
    path("sessions/<uuid:session_id>/answer/", SubmitAnswerView.as_view(), name="submit-answer"),
    path("sessions/<uuid:session_id>/complete/", CompleteSessionView.as_view(), name="complete-session"),
    path("roles/", SuggestedRolesView.as_view(), name="suggested-roles"),
]
