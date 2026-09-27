"""
DRF Serializers for the jobs app.
"""
from rest_framework import serializers
from .models import JobPosting


class JobPostingListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for listing and searching job postings.
    """

    class Meta:
        model = JobPosting
        fields = [
            "id",
            "title",
            "company",
            "location_city",
            "location_country",
            "is_remote",
            "salary_min",
            "salary_max",
            "currency",
            "category",
            "posted_date",
            "source_provider",
            "source_url",
            "extracted_skills",
            "extracted_role",
            "is_processed",
        ]


class JobPostingDetailSerializer(serializers.ModelSerializer):
    """
    Full detail serializer including the complete job description and raw data summary.
    """

    class Meta:
        model = JobPosting
        fields = [
            "id",
            "title",
            "company",
            "description",
            "location_city",
            "location_country",
            "is_remote",
            "salary_min",
            "salary_max",
            "currency",
            "category",
            "posted_date",
            "source_provider",
            "source_id",
            "source_url",
            "extracted_skills",
            "extracted_role",
            "is_processed",
            "processed_at",
            "created_at",
            "updated_at",
        ]
