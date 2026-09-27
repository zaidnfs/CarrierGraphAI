"""
Job Data Service Facade and Aggregator.
Unified entry point for consuming code to search and query job data across one or multiple providers.
"""

import logging
from typing import Any, Type

from .adzuna import AdzunaProvider
from .base import JobDataProvider
from .exceptions import JobProviderError, ProviderUnavailableError
from .schemas import JobListing, SalaryEstimate

logger = logging.getLogger(__name__)

# Registry mapping provider keys in settings to their implementation classes
PROVIDER_REGISTRY: dict[str, Type[JobDataProvider]] = {
    "adzuna": AdzunaProvider,
}


def register_provider_class(name: str, provider_cls: Type[JobDataProvider]) -> None:
    """Register a new provider class with the system."""
    PROVIDER_REGISTRY[name.lower()] = provider_cls


class JobDataService:
    """
    Facade and aggregator service that coordinates one or multiple job data providers.
    Consumer applications interact solely with this class.
    """

    def __init__(self, providers: list[JobDataProvider] | None = None) -> None:
        if providers is not None:
            self._providers = {p.provider_name: p for p in providers}
        else:
            self._providers = self._load_providers_from_settings()

    def _load_providers_from_settings(self) -> dict[str, JobDataProvider]:
        """
        Instantiate configured and enabled providers from Django settings.
        """
        loaded: dict[str, JobDataProvider] = {}
        try:
            from django.conf import settings

            conf_providers = getattr(settings, "JOB_PROVIDERS", {})
            for name, conf in conf_providers.items():
                if not conf.get("enabled", True):
                    continue
                cls = PROVIDER_REGISTRY.get(name.lower())
                if cls:
                    loaded[name.lower()] = cls(config=conf)
                else:
                    logger.warning("Unknown job provider registered in settings: %s", name)
        except Exception as err:
            logger.debug("Could not load job providers from Django settings: %s", err)

        # If no providers loaded from settings (e.g. running in test or standalone), fallback to default Adzuna
        if not loaded and "adzuna" in PROVIDER_REGISTRY:
            loaded["adzuna"] = PROVIDER_REGISTRY["adzuna"]()

        return loaded

    @property
    def providers(self) -> list[JobDataProvider]:
        """Return registered providers sorted by priority (1 is highest priority)."""
        return sorted(self._providers.values(), key=lambda p: p.priority)

    def get_provider(self, name: str) -> JobDataProvider | None:
        """Get a specific provider instance by name."""
        return self._providers.get(name.lower())

    def register_provider(self, provider: JobDataProvider) -> None:
        """Dynamically add or replace a provider instance."""
        self._providers[provider.provider_name.lower()] = provider

    def search_jobs(
        self,
        keywords: str,
        location: str = "",
        page: int = 1,
        results_per_page: int = 20,
        country: str = "in",
        providers: list[str] | None = None,
        deduplicate: bool = True,
        **kwargs: Any,
    ) -> list[JobListing]:
        """
        Search for jobs across active providers with optional deduplication.

        Args:
            keywords: Search keywords.
            location: Geographic location filter.
            page: Results page number.
            results_per_page: Number of items per provider.
            country: ISO country code.
            providers: Optional list of provider names to restrict search to.
            deduplicate: Whether to deduplicate identical postings across providers.
            **kwargs: Extra parameters passed to providers.

        Returns:
            List of normalized JobListing objects.
        """
        active_providers = self.providers
        if providers:
            target_names = {p.lower() for p in providers}
            active_providers = [p for p in active_providers if p.provider_name.lower() in target_names]

        if not active_providers:
            logger.warning("No active job data providers available for search.")
            return []

        all_listings: list[JobListing] = []
        errors: list[tuple[str, Exception]] = []

        for provider in active_providers:
            try:
                listings = provider.search_jobs(
                    keywords=keywords,
                    location=location,
                    page=page,
                    results_per_page=results_per_page,
                    country=country,
                    **kwargs,
                )
                all_listings.extend(listings)
            except Exception as err:
                logger.error("Job search failed on provider %s: %s", provider.provider_name, err)
                errors.append((provider.provider_name, err))

        # If all providers failed and none returned results, raise the last exception
        if errors and not all_listings and len(errors) == len(active_providers):
            provider_name, last_err = errors[0]
            if isinstance(last_err, JobProviderError):
                raise last_err
            raise ProviderUnavailableError(
                f"All providers failed during job search: {last_err}",
                provider=provider_name,
            ) from last_err

        if deduplicate:
            all_listings = self._deduplicate_listings(all_listings)

        return all_listings

    def _deduplicate_listings(self, listings: list[JobListing]) -> list[JobListing]:
        """
        Deduplicate listings based on (title, company, city) dedup key.
        Preserves the first occurrence (which belongs to the higher-priority provider).
        """
        seen: set[tuple[str, str, str]] = set()
        deduped: list[JobListing] = []
        for item in listings:
            key = item.dedup_key
            # If key is valid and already seen, skip
            if key in seen:
                continue
            seen.add(key)
            deduped.append(item)
        return deduped

    def get_salary_data(
        self,
        job_title: str,
        location: str = "",
        country: str = "in",
        provider: str | None = None,
        **kwargs: Any,
    ) -> SalaryEstimate | None:
        """
        Query salary statistics from the requested or highest-priority available provider.
        """
        if provider:
            target = self.get_provider(provider)
            if not target:
                raise ValueError(f"Requested provider '{provider}' is not configured or enabled.")
            return target.get_salary_data(job_title, location=location, country=country, **kwargs)

        for p in self.providers:
            try:
                estimate = p.get_salary_data(job_title, location=location, country=country, **kwargs)
                if estimate:
                    return estimate
            except Exception as err:
                logger.warning("Salary data fetch failed on provider %s: %s", p.provider_name, err)
        return None

    def get_categories(self, country: str = "in", provider: str | None = None) -> list[dict[str, Any]]:
        """
        Retrieve categories from a specific provider or the highest-priority provider.
        """
        if provider:
            target = self.get_provider(provider)
            if not target:
                raise ValueError(f"Requested provider '{provider}' is not configured or enabled.")
            return target.get_categories(country=country)

        for p in self.providers:
            try:
                categories = p.get_categories(country=country)
                if categories:
                    return categories
            except Exception as err:
                logger.warning("Categories fetch failed on provider %s: %s", p.provider_name, err)
        return []

    def health_check(self) -> dict[str, Any]:
        """
        Run health check across all registered providers.
        Returns a dict of status per provider and overall system health.
        """
        provider_status: dict[str, bool] = {}
        for p in self.providers:
            try:
                provider_status[p.provider_name] = p.health_check()
            except Exception:
                provider_status[p.provider_name] = False

        return {
            "healthy": any(provider_status.values()) if provider_status else False,
            "all_healthy": all(provider_status.values()) if provider_status else False,
            "providers": provider_status,
        }


# Singleton service instance cache
_default_service: JobDataService | None = None


def get_job_service(reload: bool = False) -> JobDataService:
    """
    Factory function returning the singleton JobDataService instance.
    """
    global _default_service
    if _default_service is None or reload:
        _default_service = JobDataService()
    return _default_service
