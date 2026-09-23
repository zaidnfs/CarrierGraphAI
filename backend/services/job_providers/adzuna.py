"""
Adzuna Job Data Provider Implementation.
Integrates with the Adzuna Search and Salary APIs.
"""

from datetime import datetime
import html
import logging
import re
from typing import Any

import httpx

from .base import JobDataProvider
from .exceptions import (
    ProviderAuthError,
    ProviderRateLimitError,
    ProviderResponseError,
    ProviderUnavailableError,
)
from .schemas import JobListing, SalaryEstimate

logger = logging.getLogger(__name__)

# Currency mapping by country code
COUNTRY_CURRENCY_MAP: dict[str, str] = {
    "in": "INR",
    "gb": "GBP",
    "us": "USD",
    "ca": "CAD",
    "au": "AUD",
    "de": "EUR",
    "fr": "EUR",
    "nl": "EUR",
    "nz": "NZD",
    "sg": "SGD",
    "za": "ZAR",
}


def _clean_text(text: str | None) -> str:
    """Strip HTML tags and unescape HTML entities from API response strings."""
    if not text:
        return ""
    # Strip HTML tags like <strong>...</strong>
    cleaned = re.sub(r"<[^>]+>", "", text)
    return html.unescape(cleaned).strip()


class AdzunaProvider(JobDataProvider):
    """
    Concrete JobDataProvider implementation for the Adzuna API.
    Handles job searches, categories, and salary histogram benchmarks.
    """

    BASE_URL = "https://api.adzuna.com/v1/api"

    def __init__(self, config: dict[str, Any] | None = None) -> None:
        super().__init__(config)
        self.app_id = self.config.get("app_id") or ""
        self.app_key = self.config.get("app_key") or ""
        self.default_country = self.config.get("default_country", "in").lower()
        self.timeout = float(self.config.get("timeout", 10.0))

        # Attempt fallback to django settings if available and config didn't supply credentials
        if not self.app_id or not self.app_key:
            self._load_from_django_settings()

    def _load_from_django_settings(self) -> None:
        """Attempt to read credentials from Django settings."""
        try:
            from django.conf import settings

            adzuna_conf = getattr(settings, "JOB_PROVIDERS", {}).get("adzuna", {})
            if not self.app_id:
                self.app_id = adzuna_conf.get("app_id") or getattr(settings, "ADZUNA_APP_ID", "")
            if not self.app_key:
                self.app_key = adzuna_conf.get("app_key") or getattr(settings, "ADZUNA_APP_KEY", "")
            if not self.config.get("default_country"):
                self.default_country = adzuna_conf.get("default_country", self.default_country)
        except Exception:
            # Django might not be configured in non-Django standalone scripts or tests
            pass

    @property
    def provider_name(self) -> str:
        return "adzuna"

    def _get_auth_params(self) -> dict[str, str]:
        """Verify and return auth query parameters."""
        if not self.app_id or not self.app_key:
            raise ProviderAuthError(
                "Adzuna app_id or app_key is not configured",
                provider=self.provider_name,
            )
        return {
            "app_id": self.app_id,
            "app_key": self.app_key,
        }

    def _handle_http_errors(self, response: httpx.Response) -> None:
        """Check status code and raise appropriate domain exceptions."""
        if response.status_code in (401, 403):
            raise ProviderAuthError(
                f"Adzuna authentication failed: {response.text}",
                provider=self.provider_name,
                status_code=response.status_code,
            )
        if response.status_code == 429:
            retry_after = response.headers.get("Retry-After")
            retry_seconds = int(retry_after) if retry_after and retry_after.isdigit() else 60
            raise ProviderRateLimitError(
                "Adzuna API rate limit exceeded",
                provider=self.provider_name,
                retry_after=retry_seconds,
                status_code=429,
            )
        if response.status_code >= 500:
            raise ProviderUnavailableError(
                f"Adzuna service error: HTTP {response.status_code}",
                provider=self.provider_name,
                status_code=response.status_code,
            )
        if not response.is_success:
            raise ProviderResponseError(
                f"Adzuna request failed with status {response.status_code}: {response.text}",
                provider=self.provider_name,
                status_code=response.status_code,
            )

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
        Search jobs on Adzuna.
        """
        c_code = (country or self.default_country).lower()
        url = f"{self.BASE_URL}/jobs/{c_code}/search/{page}"
        params: dict[str, Any] = {
            **self._get_auth_params(),
            "what": keywords,
            "results_per_page": min(results_per_page, 50),
            "content-type": "application/json",
        }
        if location:
            params["where"] = location

        # Forward optional Adzuna-specific params if passed
        for extra_param in ("max_days_old", "category", "sort_by"):
            if extra_param in kwargs and kwargs[extra_param]:
                params[extra_param] = kwargs[extra_param]

        try:
            with httpx.Client(timeout=self.timeout) as client:
                resp = client.get(url, params=params)
                self._handle_http_errors(resp)
                data = resp.json()
        except (httpx.TimeoutException, httpx.NetworkError) as err:
            raise ProviderUnavailableError(
                f"Failed to connect to Adzuna: {err}",
                provider=self.provider_name,
            ) from err
        except (ProviderAuthError, ProviderRateLimitError, ProviderUnavailableError, ProviderResponseError):
            raise
        except Exception as err:
            raise ProviderResponseError(
                f"Failed to parse Adzuna response: {err}",
                provider=self.provider_name,
            ) from err

        results = data.get("results", [])
        currency = COUNTRY_CURRENCY_MAP.get(c_code, "INR")

        listings: list[JobListing] = []
        for item in results:
            listings.append(self._map_to_listing(item, c_code, currency))
        return listings

    def _map_to_listing(self, item: dict[str, Any], country_code: str, currency: str) -> JobListing:
        """Map raw Adzuna JSON item to normalized JobListing dataclass."""
        raw_loc = item.get("location", {})
        area_list = raw_loc.get("area", [])
        city = area_list[-1] if area_list else raw_loc.get("display_name", "")
        country = area_list[0] if area_list else country_code.upper()

        company_dict = item.get("company", {})
        company_name = _clean_text(company_dict.get("display_name", "Unknown Company"))

        # Parsing salary
        salary_min = float(item["salary_min"]) if item.get("salary_min") is not None else None
        salary_max = float(item["salary_max"]) if item.get("salary_max") is not None else None

        # Parse posted date
        posted_str = item.get("created")
        posted_date = None
        if posted_str:
            try:
                posted_date = datetime.fromisoformat(posted_str.replace("Z", "+00:00"))
            except Exception:
                posted_date = posted_str

        category_dict = item.get("category", {})
        category_label = category_dict.get("label", "")

        return JobListing(
            title=_clean_text(item.get("title", "Untitled Position")),
            company=company_name,
            url=item.get("redirect_url", ""),
            source_provider=self.provider_name,
            source_id=str(item.get("id", "")),
            description=_clean_text(item.get("description", "")),
            location_city=city,
            location_country=country,
            salary_min=salary_min,
            salary_max=salary_max,
            currency=currency,
            posted_date=posted_date,
            category=category_label,
            raw_data=item,
        )

    def get_salary_data(
        self,
        job_title: str,
        location: str = "",
        country: str = "in",
        **kwargs: Any,
    ) -> SalaryEstimate | None:
        """
        Fetch salary histogram benchmarks from Adzuna and compute average/min/max.
        """
        c_code = (country or self.default_country).lower()
        url = f"{self.BASE_URL}/jobs/{c_code}/histogram"
        params: dict[str, Any] = {
            **self._get_auth_params(),
            "what": job_title,
            "content-type": "application/json",
        }
        if location:
            params["where"] = location

        try:
            with httpx.Client(timeout=self.timeout) as client:
                resp = client.get(url, params=params)
                self._handle_http_errors(resp)
                data = resp.json()
        except (httpx.TimeoutException, httpx.NetworkError) as err:
            raise ProviderUnavailableError(
                f"Failed to connect to Adzuna salary API: {err}",
                provider=self.provider_name,
            ) from err
        except (ProviderAuthError, ProviderRateLimitError, ProviderUnavailableError, ProviderResponseError):
            raise
        except Exception as err:
            raise ProviderResponseError(
                f"Failed to parse Adzuna salary response: {err}",
                provider=self.provider_name,
            ) from err

        histogram = data.get("histogram", {})
        if not histogram:
            return None

        currency = COUNTRY_CURRENCY_MAP.get(c_code, "INR")

        total_weight = 0
        weighted_sum = 0.0
        salaries: list[float] = []

        for salary_str, count in histogram.items():
            try:
                sal_val = float(salary_str)
                cnt_val = int(count)
                if cnt_val > 0:
                    salaries.append(sal_val)
                    weighted_sum += sal_val * cnt_val
                    total_weight += cnt_val
            except (ValueError, TypeError):
                continue

        if not salaries or total_weight == 0:
            return None

        average = round(weighted_sum / total_weight, 2)
        min_salary = min(salaries)
        max_salary = max(salaries)

        return SalaryEstimate(
            job_title=job_title,
            location=location or c_code.upper(),
            average=average,
            min=min_salary,
            max=max_salary,
            currency=currency,
            source_provider=self.provider_name,
            raw_data=data,
        )

    def get_categories(self, country: str = "in") -> list[dict[str, Any]]:
        """
        Fetch job categories supported by Adzuna for the given country.
        """
        c_code = (country or self.default_country).lower()
        url = f"{self.BASE_URL}/jobs/{c_code}/categories"
        params = {
            **self._get_auth_params(),
            "content-type": "application/json",
        }

        try:
            with httpx.Client(timeout=self.timeout) as client:
                resp = client.get(url, params=params)
                self._handle_http_errors(resp)
                data = resp.json()
        except (httpx.TimeoutException, httpx.NetworkError) as err:
            raise ProviderUnavailableError(
                f"Failed to connect to Adzuna categories API: {err}",
                provider=self.provider_name,
            ) from err
        except (ProviderAuthError, ProviderRateLimitError, ProviderUnavailableError, ProviderResponseError):
            raise
        except Exception as err:
            raise ProviderResponseError(
                f"Failed to parse Adzuna categories: {err}",
                provider=self.provider_name,
            ) from err

        categories: list[dict[str, Any]] = []
        for cat in data.get("results", []):
            categories.append({
                "tag": cat.get("tag", ""),
                "label": cat.get("label", ""),
            })
        return categories

    def health_check(self) -> bool:
        """
        Check if Adzuna is reachable and credentials are valid by querying categories.
        """
        if not self.app_id or not self.app_key:
            return False
        try:
            categories = self.get_categories(country=self.default_country)
            return len(categories) > 0
        except Exception as err:
            logger.warning("Adzuna health check failed: %s", err)
            return False
