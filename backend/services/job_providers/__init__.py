"""
Modular Job Data Provider Package.
Provides unified, provider-agnostic access to external job listings and market data.
"""

from .adzuna import AdzunaProvider
from .base import JobDataProvider
from .exceptions import (
    JobProviderError,
    ProviderAuthError,
    ProviderRateLimitError,
    ProviderResponseError,
    ProviderUnavailableError,
)
from .schemas import JobListing, ProviderConfig, SalaryEstimate
from .service import (
    JobDataService,
    get_job_service,
    register_provider_class,
)

__all__ = [
    "JobDataProvider",
    "AdzunaProvider",
    "JobListing",
    "SalaryEstimate",
    "ProviderConfig",
    "JobDataService",
    "get_job_service",
    "register_provider_class",
    "JobProviderError",
    "ProviderAuthError",
    "ProviderRateLimitError",
    "ProviderUnavailableError",
    "ProviderResponseError",
]
