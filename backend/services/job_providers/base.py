"""
Abstract Base Class for Job Data Providers.
Defines the uniform contract that every concrete provider must fulfill.
"""

from abc import ABC, abstractmethod
from typing import Any

from .schemas import JobListing, SalaryEstimate


class JobDataProvider(ABC):
    """
    Contract that every job data provider (Adzuna, Reed, LinkedIn, etc.) must implement.
    Consumer applications interact only with this interface, never concrete providers directly.
    """

    def __init__(self, config: dict[str, Any] | None = None) -> None:
        self.config = config or {}
        self.enabled = bool(self.config.get("enabled", True))
        self.priority = int(self.config.get("priority", 1))

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """
        Unique identifier name for this provider (e.g. 'adzuna', 'reed').
        """
        raise NotImplementedError

    @abstractmethod
    def search_jobs(
        self,
        keywords: str,
        location: str = "",
        page: int = 1,
        results_per_page: int = 20,
        country: str = "in",
        **kwargs: Any,
    ) -> list[JobListing]:
        """
        Search for job postings matching the query criteria.

        Args:
            keywords: Search keywords (e.g. 'python developer', 'machine learning').
            location: Optional geographic location (city, state, region).
            page: Results page number (1-indexed).
            results_per_page: Number of items to return per page.
            country: ISO 2-letter country code (default: 'in').
            **kwargs: Provider-specific additional parameters.

        Returns:
            List of normalized JobListing objects.
        """
        raise NotImplementedError

    @abstractmethod
    def get_salary_data(
        self,
        job_title: str,
        location: str = "",
        country: str = "in",
        **kwargs: Any,
    ) -> SalaryEstimate | None:
        """
        Fetch estimated salary benchmarks for a job title and location.

        Args:
            job_title: Target job role/title.
            location: Geographic location for salary benchmarking.
            country: ISO 2-letter country code (default: 'in').
            **kwargs: Provider-specific parameters.

        Returns:
            Normalized SalaryEstimate or None if unsupported/unavailable.
        """
        raise NotImplementedError

    @abstractmethod
    def get_categories(self, country: str = "in") -> list[dict[str, Any]]:
        """
        Fetch available job categories/industries from this provider.

        Args:
            country: ISO 2-letter country code (default: 'in').

        Returns:
            List of category dictionaries containing at least 'tag' and 'label'.
        """
        raise NotImplementedError

    @abstractmethod
    def health_check(self) -> bool:
        """
        Check if the provider endpoint is reachable and credentials are valid.

        Returns:
            True if healthy and operational, False otherwise.
        """
        raise NotImplementedError
