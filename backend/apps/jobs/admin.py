"""
Django admin integration for the jobs app.
"""
from django.contrib import admin
from .models import JobPosting


@admin.register(JobPosting)
class JobPostingAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "company",
        "location_city",
        "source_provider",
        "is_remote",
        "is_processed",
        "posted_date",
        "created_at",
    )
    list_filter = (
        "source_provider",
        "is_processed",
        "is_remote",
        "location_country",
        "posted_date",
    )
    search_fields = (
        "title",
        "company",
        "location_city",
        "description",
        "extracted_role",
    )
    readonly_fields = (
        "id",
        "dedup_hash",
        "created_at",
        "updated_at",
        "processed_at",
        "raw_data",
    )
    ordering = ("-posted_date", "-created_at")
