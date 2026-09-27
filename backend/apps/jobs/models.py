"""
Django models for the jobs app.
Stores raw job postings ingested from external providers (e.g. Adzuna)
and tracks extraction status for the downstream Knowledge Graph & Vector Store.
"""
import hashlib
import uuid
from datetime import datetime
from typing import Any

from django.db import models
from django.utils import timezone


class JobPosting(models.Model):
    """
    Relational model representing a job posting ingested from external providers.
    Maintains raw text, provider metadata, deduplication identifiers,
    and cached extracted entities (skills, normalized roles).
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Core job information
    title = models.CharField(max_length=255, db_index=True)
    company = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True)
    location_city = models.CharField(max_length=100, blank=True, db_index=True)
    location_country = models.CharField(max_length=10, blank=True, default="IN")
    is_remote = models.BooleanField(default=False, db_index=True)

    # Compensation details
    salary_min = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True
    )
    salary_max = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True
    )
    currency = models.CharField(max_length=10, default="INR")

    # Dates and categorization
    posted_date = models.DateTimeField(null=True, blank=True, db_index=True)
    category = models.CharField(max_length=100, blank=True, db_index=True)

    # Provider & source metadata
    source_url = models.URLField(max_length=1024)
    source_provider = models.CharField(max_length=50, default="adzuna", db_index=True)
    source_id = models.CharField(max_length=255)

    # Deduplication hash: SHA-256(normalized title + company + city)
    dedup_hash = models.CharField(
        max_length=64,
        db_index=True,
        help_text="SHA-256 fingerprint for cross-provider duplicate detection.",
    )

    # Raw provider response payload
    raw_data = models.JSONField(
        default=dict, blank=True, help_text="Original unparsed JSON payload from provider."
    )

    # Cached AI/NER entity extraction outputs
    extracted_skills = models.JSONField(
        default=list,
        blank=True,
        help_text="List of technical/soft skills identified by the NER pipeline.",
    )
    extracted_role = models.CharField(
        max_length=255,
        blank=True,
        help_text="Canonical role category determined by entity extraction.",
    )

    # Pipeline processing lifecycle flags
    is_processed = models.BooleanField(
        default=False,
        db_index=True,
        help_text="True if NER extraction and downstream graph/vector indexing have succeeded.",
    )
    processed_at = models.DateTimeField(null=True, blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Job Posting"
        verbose_name_plural = "Job Postings"
        ordering = ["-posted_date", "-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["source_provider", "source_id"],
                name="unique_provider_source_id",
            )
        ]
        indexes = [
            models.Index(fields=["is_processed", "created_at"]),
            models.Index(fields=["location_city", "category"]),
            models.Index(fields=["title", "company"]),
        ]

    def __str__(self) -> str:
        return f"{self.title} at {self.company} ({self.location_city or 'Remote'})"

    @staticmethod
    def compute_dedup_hash(title: str, company: str, location_city: str) -> str:
        """
        Generate a deterministic SHA-256 hash from normalized title, company, and city.
        """
        norm_title = " ".join((title or "").lower().split())
        norm_company = " ".join((company or "").lower().split())
        norm_city = " ".join((location_city or "").lower().split())
        raw_key = f"{norm_title}|{norm_company}|{norm_city}"
        return hashlib.sha256(raw_key.encode("utf-8")).hexdigest()

    def save(self, *args: Any, **kwargs: Any) -> None:
        """
        Ensure dedup_hash is computed prior to saving.
        """
        if not self.dedup_hash:
            self.dedup_hash = self.compute_dedup_hash(
                self.title, self.company, self.location_city
            )
        # Check if job mentions remote in title or description
        if not self.is_remote:
            text_to_check = f"{self.title} {self.location_city} {self.description}".lower()
            if "remote" in text_to_check or "work from home" in text_to_check:
                self.is_remote = True

        super().save(*args, **kwargs)

    @classmethod
    def from_job_listing(cls, listing: Any) -> "JobPosting":
        """
        Factory method to convert a normalized JobListing dataclass instance
        from services.job_providers.schemas into a JobPosting model instance (unsaved).
        """
        posted = listing.posted_date
        if isinstance(posted, str) and posted:
            try:
                posted = datetime.fromisoformat(posted.replace("Z", "+00:00"))
            except ValueError:
                posted = timezone.now()
        elif not isinstance(posted, datetime):
            posted = timezone.now()

        dedup_hash = cls.compute_dedup_hash(
            title=listing.title,
            company=listing.company,
            location_city=listing.location_city,
        )

        return cls(
            title=listing.title[:255],
            company=listing.company[:255],
            description=listing.description,
            location_city=listing.location_city[:100],
            location_country=(listing.location_country or "IN")[:10],
            salary_min=listing.salary_min,
            salary_max=listing.salary_max,
            currency=(listing.currency or "INR")[:10],
            posted_date=posted,
            category=listing.category[:100],
            source_url=listing.url[:1024],
            source_provider=listing.source_provider[:50],
            source_id=str(listing.source_id)[:255],
            dedup_hash=dedup_hash,
            raw_data=listing.raw_data or {},
        )
