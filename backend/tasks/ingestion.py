"""
Celery background and periodic tasks for job data ingestion.
Coordinates with JobDataService (Adzuna + modular providers) to fetch,
deduplicate, and store raw job postings in PostgreSQL.
"""
import logging
from typing import Any

from celery import shared_task
from django.db import IntegrityError, transaction
from django.utils import timezone

from apps.jobs.models import JobPosting
from services.job_providers import get_job_service
from services.job_providers.exceptions import (
    JobProviderError,
    ProviderAuthError,
    ProviderRateLimitError,
    ProviderUnavailableError,
)

logger = logging.getLogger(__name__)

# Default roles and locations for periodic scheduled ingestion
DEFAULT_TARGET_ROLES = [
    "Software Engineer",
    "Python Developer",
    "Full Stack Developer",
    "Backend Developer",
    "Frontend Developer",
    "Data Scientist",
    "DevOps Engineer",
    "Machine Learning Engineer",
]

DEFAULT_TARGET_LOCATIONS = [
    "Bengaluru",
    "Hyderabad",
    "Pune",
    "Mumbai",
    "Delhi",
    "Chennai",
    "Gurgaon",
    "Noida",
]


@shared_task(bind=True, name="tasks.ingestion.fetch_and_store_jobs", max_retries=3)
def fetch_and_store_jobs(
    self,
    keywords: list[str] | str | None = None,
    locations: list[str] | str | None = None,
    country: str = "in",
    max_pages_per_query: int = 1,
    results_per_page: int = 20,
    auto_trigger_processing: bool = True,
) -> dict[str, Any]:
    """
    Periodic or on-demand task to fetch job listings from configured providers,
    deduplicate against existing listings, and store new JobPosting records.

    Args:
        keywords: Role keyword or list of keywords to search.
        locations: Location city or list of locations.
        country: ISO 3166-1 alpha-2 country code (default 'in').
        max_pages_per_query: Max pages to crawl per keyword/location combination.
        results_per_page: Number of items per request page.
        auto_trigger_processing: If True, triggers entity extraction for newly stored jobs.

    Returns:
        Summary dict containing counts of fetched, created, and duplicate jobs.
    """
    logger.info("Starting scheduled job data ingestion task")
    job_service = get_job_service()

    # Normalize inputs
    if keywords is None:
        target_roles = DEFAULT_TARGET_ROLES
    elif isinstance(keywords, str):
        target_roles = [keywords]
    else:
        target_roles = keywords

    if locations is None:
        target_cities = DEFAULT_TARGET_LOCATIONS
    elif isinstance(locations, str):
        target_cities = [locations]
    else:
        target_cities = locations

    total_fetched = 0
    total_created = 0
    total_duplicates = 0
    errors: list[str] = []
    new_job_ids: list[str] = []

    for role in target_roles:
        for city in target_cities:
            for page in range(1, max_pages_per_query + 1):
                try:
                    logger.debug(
                        f"Fetching jobs: role='{role}', location='{city}', page={page}"
                    )
                    listings = job_service.search_jobs(
                        keywords=role,
                        location=city,
                        country=country,
                        page=page,
                        results_per_page=results_per_page,
                    )
                except ProviderRateLimitError as exc:
                    logger.warning(f"Rate limit exceeded while querying '{role}' in '{city}': {exc}")
                    errors.append(f"Rate limit: {role} - {city}")
                    # Stop querying this role/city for now
                    break
                except (ProviderAuthError, ProviderUnavailableError, JobProviderError) as exc:
                    logger.error(f"Provider error while querying '{role}' in '{city}': {exc}")
                    errors.append(f"Provider error: {role} - {city}: {str(exc)}")
                    break
                except Exception as exc:
                    logger.exception(f"Unexpected error while querying '{role}' in '{city}': {exc}")
                    errors.append(f"Unexpected error: {role} - {city}: {str(exc)}")
                    break

                total_fetched += len(listings)

                for listing in listings:
                    dedup_hash = JobPosting.compute_dedup_hash(
                        title=listing.title,
                        company=listing.company,
                        location_city=listing.location_city,
                    )

                    # Deduplication check: by provider+id OR dedup_hash fingerprint
                    exists = JobPosting.objects.filter(
                        source_provider=listing.source_provider,
                        source_id=str(listing.source_id),
                    ).exists() or JobPosting.objects.filter(dedup_hash=dedup_hash).exists()

                    if exists:
                        total_duplicates += 1
                        continue

                    try:
                        with transaction.atomic():
                            job_posting = JobPosting.from_job_listing(listing)
                            job_posting.save()
                            total_created += 1
                            new_job_ids.append(str(job_posting.id))
                    except IntegrityError:
                        total_duplicates += 1
                    except Exception as exc:
                        logger.error(f"Failed to save job posting '{listing.title}': {exc}")
                        errors.append(f"Save error for {listing.title}: {str(exc)}")

    summary = {
        "status": "completed",
        "timestamp": timezone.now().isoformat(),
        "total_fetched": total_fetched,
        "total_created": total_created,
        "total_duplicates": total_duplicates,
        "errors_count": len(errors),
        "errors": errors[:20],  # cap error reports
    }
    logger.info(
        f"Job ingestion finished: fetched={total_fetched}, created={total_created}, duplicates={total_duplicates}"
    )

    # Optionally trigger downstream processing task if new jobs were ingested
    if auto_trigger_processing and total_created > 0:
        try:
            from tasks.processing import process_unprocessed_jobs
            process_unprocessed_jobs.delay()
        except Exception as exc:
            logger.warning(f"Failed to auto-trigger downstream processing: {exc}")

    return summary
