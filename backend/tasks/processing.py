"""
Celery asynchronous background processing tasks for SkillBridge AI.
Processes unprocessed JobPosting records by extracting skills & roles via NER,
and prepares data for downstream Knowledge Graph & Vector Store indexing.
"""
import logging
from typing import Any

from celery import shared_task
from django.utils import timezone

from apps.jobs.models import JobPosting
from services.ner_service import get_ner_service

logger = logging.getLogger(__name__)


@shared_task(name="tasks.processing.process_unprocessed_jobs")
def process_unprocessed_jobs(batch_size: int = 100) -> dict[str, Any]:
    """
    Extract skills and normalized roles for all unprocessed JobPosting records.

    Args:
        batch_size: Maximum number of records to process in a single batch.

    Returns:
        Summary dict containing count of processed records.
    """
    logger.info(f"Starting entity extraction processing task (batch size: {batch_size})")
    unprocessed_jobs = JobPosting.objects.filter(is_processed=False)[:batch_size]

    if not unprocessed_jobs.exists():
        logger.info("No unprocessed job postings found.")
        return {"processed_count": 0, "status": "idle"}

    ner_service = get_ner_service()
    processed_count = 0
    errors: list[str] = []

    for job in unprocessed_jobs:
        try:
            # Run NER extraction on description + title
            extraction = ner_service.process_text(job.description, title=job.title)

            job.extracted_skills = extraction["skill_names"]
            job.extracted_role = extraction["role"]["normalized_role"]
            job.is_processed = True
            job.processed_at = timezone.now()
            job.save(
                update_fields=[
                    "extracted_skills",
                    "extracted_role",
                    "is_processed",
                    "processed_at",
                    "updated_at",
                ]
            )
            processed_count += 1
        except Exception as exc:
            logger.error(f"Error processing JobPosting {job.id}: {exc}")
            errors.append(f"{job.id}: {str(exc)}")

    logger.info(f"Entity extraction completed. Processed: {processed_count}, Errors: {len(errors)}")

    return {
        "processed_count": processed_count,
        "errors_count": len(errors),
        "status": "completed",
    }
