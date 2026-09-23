"""
URL routes for the jobs app.
"""
from django.urls import path
from .views import JobPostingListView, JobPostingDetailView

app_name = "jobs"

urlpatterns = [
    path("", JobPostingListView.as_view(), name="job-list"),
    path("<uuid:id>/", JobPostingDetailView.as_view(), name="job-detail"),
]
