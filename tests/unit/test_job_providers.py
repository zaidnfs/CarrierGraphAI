"""
Unit tests for the modular Job Data Provider service layer.
Tests schemas, AdzunaProvider mapping and error handling, and JobDataService aggregation.
"""

from datetime import datetime
from unittest.mock import MagicMock, patch
import httpx
import pytest

from services.job_providers import (
    AdzunaProvider,
    JobDataProvider,
    JobDataService,
    JobListing,
    JobProviderError,
    ProviderAuthError,
    ProviderConfig,
    ProviderRateLimitError,
    ProviderResponseError,
    ProviderUnavailableError,
    SalaryEstimate,
    get_job_service,
    register_provider_class,
)


# ==========================================
# 1. Schema Tests
# ==========================================

class TestJobProviderSchemas:
    """Test normalized dataclasses and helpers."""

    def test_job_listing_creation(self):
        listing = JobListing(
            title="Senior Python Engineer",
            company="Tech Corp",
            url="https://example.com/job/1",
            source_provider="adzuna",
            source_id="12345",
            description="Build scalable APIs with Django",
            location_city="Bangalore",
            location_country="India",
            salary_min=1200000.0,
            salary_max=1800000.0,
            currency="INR",
            posted_date=datetime(2026, 9, 20, 10, 0, 0),
            category="IT Jobs",
        )

        assert listing.title == "Senior Python Engineer"
        assert listing.company == "Tech Corp"
        assert listing.dedup_key == ("senior python engineer", "tech corp", "bangalore")

        data = listing.to_dict()
        assert data["title"] == "Senior Python Engineer"
        assert data["posted_date"] == "2026-09-20T10:00:00"
        assert data["currency"] == "INR"

    def test_job_listing_dedup_key_normalization(self):
        listing1 = JobListing(
            title="  Backend   Developer  ",
            company="Acme Inc.",
            url="https://example.com/1",
            source_provider="adzuna",
            source_id="1",
            location_city="Pune  ",
        )
        listing2 = JobListing(
            title="backend developer",
            company="acme inc.",
            url="https://example.com/2",
            source_provider="reed",
            source_id="99",
            location_city="pune",
        )
        assert listing1.dedup_key == listing2.dedup_key

    def test_salary_estimate_creation(self):
        estimate = SalaryEstimate(
            job_title="Data Scientist",
            location="India",
            average=1500000.0,
            min=800000.0,
            max=2500000.0,
            currency="INR",
            source_provider="adzuna",
        )
        assert estimate.average == 1500000.0
        data = estimate.to_dict()
        assert data["job_title"] == "Data Scientist"
        assert data["source_provider"] == "adzuna"

    def test_provider_config(self):
        config = ProviderConfig(
            name="adzuna",
            enabled=True,
            priority=1,
            rate_limit_per_minute=25,
            credentials={"app_id": "test_id", "app_key": "test_key"},
        )
        assert config.name == "adzuna"
        assert config.enabled is True
        assert config.priority == 1


# ==========================================
# 2. AdzunaProvider Tests
# ==========================================

class TestAdzunaProvider:
    """Test Adzuna provider mapping, parsing, and error handling."""

    @pytest.fixture
    def adzuna_provider(self):
        return AdzunaProvider(
            config={
                "app_id": "dummy_app_id",
                "app_key": "dummy_app_key",
                "default_country": "in",
            }
        )

    def test_missing_credentials_raises_auth_error(self):
        provider = AdzunaProvider(config={"app_id": "", "app_key": ""})
        with pytest.raises(ProviderAuthError) as exc_info:
            provider.search_jobs("python")
        assert "not configured" in str(exc_info.value)

    @patch("httpx.Client.get")
    def test_search_jobs_success_and_html_stripping(self, mock_get, adzuna_provider):
        raw_response = {
            "results": [
                {
                    "id": "1001",
                    "title": "<strong>Python</strong> Developer",
                    "description": "Looking for a <b>senior</b> backend dev.",
                    "company": {"display_name": "Initech"},
                    "location": {
                        "display_name": "Hyderabad, Telangana",
                        "area": ["India", "Telangana", "Hyderabad"],
                    },
                    "salary_min": 900000,
                    "salary_max": 1400000,
                    "redirect_url": "https://www.adzuna.in/land/ad/1001",
                    "created": "2026-09-22T08:30:00Z",
                    "category": {"label": "IT Jobs", "tag": "it-jobs"},
                }
            ],
            "count": 1,
        }

        mock_resp = MagicMock()
        mock_resp.is_success = True
        mock_resp.status_code = 200
        mock_resp.json.return_value = raw_response
        mock_get.return_value = mock_resp

        listings = adzuna_provider.search_jobs("Python", location="Hyderabad", country="in")

        assert len(listings) == 1
        job = listings[0]
        assert job.title == "Python Developer"  # HTML stripped!
        assert job.description == "Looking for a senior backend dev."
        assert job.company == "Initech"
        assert job.location_city == "Hyderabad"
        assert job.location_country == "India"
        assert job.salary_min == 900000.0
        assert job.salary_max == 1400000.0
        assert job.currency == "INR"
        assert job.source_provider == "adzuna"
        assert job.source_id == "1001"
        assert isinstance(job.posted_date, datetime)

    @patch("httpx.Client.get")
    def test_search_jobs_different_country_currency(self, mock_get, adzuna_provider):
        raw_response = {
            "results": [
                {
                    "id": "2001",
                    "title": "Django Engineer",
                    "company": {"display_name": "London Tech"},
                    "location": {"area": ["UK", "London"]},
                    "redirect_url": "https://www.adzuna.co.uk/land/ad/2001",
                }
            ]
        }
        mock_resp = MagicMock()
        mock_resp.is_success = True
        mock_resp.status_code = 200
        mock_resp.json.return_value = raw_response
        mock_get.return_value = mock_resp

        listings = adzuna_provider.search_jobs("Django", country="gb")
        assert len(listings) == 1
        assert listings[0].currency == "GBP"

    @patch("httpx.Client.get")
    def test_get_salary_data_histogram_calculation(self, mock_get, adzuna_provider):
        mock_resp = MagicMock()
        mock_resp.is_success = True
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            "histogram": {
                "600000": 2,
                "800000": 3,
                "1000000": 1,
            }
        }
        mock_get.return_value = mock_resp

        estimate = adzuna_provider.get_salary_data("Backend Engineer", location="Bangalore", country="in")
        assert estimate is not None
        # Weighted average: (600000*2 + 800000*3 + 1000000*1) / 6 = (1200000 + 2400000 + 1000000) / 6 = 4600000 / 6 = 766666.67
        assert estimate.average == pytest.approx(766666.67, 0.01)
        assert estimate.min == 600000.0
        assert estimate.max == 1000000.0
        assert estimate.currency == "INR"

    @patch("httpx.Client.get")
    def test_get_salary_data_empty_histogram(self, mock_get, adzuna_provider):
        mock_resp = MagicMock()
        mock_resp.is_success = True
        mock_resp.status_code = 200
        mock_resp.json.return_value = {"histogram": {}}
        mock_get.return_value = mock_resp

        estimate = adzuna_provider.get_salary_data("Obscure Role", country="in")
        assert estimate is None

    @patch("httpx.Client.get")
    def test_rate_limit_error(self, mock_get, adzuna_provider):
        mock_resp = MagicMock()
        mock_resp.is_success = False
        mock_resp.status_code = 429
        mock_resp.headers = {"Retry-After": "30"}
        mock_get.return_value = mock_resp

        with pytest.raises(ProviderRateLimitError) as exc_info:
            adzuna_provider.search_jobs("python")
        assert exc_info.value.retry_after == 30

    @patch("httpx.Client.get")
    def test_auth_error_on_401(self, mock_get, adzuna_provider):
        mock_resp = MagicMock()
        mock_resp.is_success = False
        mock_resp.status_code = 401
        mock_resp.text = "Unauthorized"
        mock_get.return_value = mock_resp

        with pytest.raises(ProviderAuthError):
            adzuna_provider.search_jobs("python")

    @patch("httpx.Client.get")
    def test_unavailable_error_on_500(self, mock_get, adzuna_provider):
        mock_resp = MagicMock()
        mock_resp.is_success = False
        mock_resp.status_code = 503
        mock_resp.text = "Service Unavailable"
        mock_get.return_value = mock_resp

        with pytest.raises(ProviderUnavailableError):
            adzuna_provider.search_jobs("python")

    @patch("httpx.Client.get", side_effect=httpx.ConnectTimeout("Connection timed out"))
    def test_timeout_raises_unavailable_error(self, mock_get, adzuna_provider):
        with pytest.raises(ProviderUnavailableError) as exc_info:
            adzuna_provider.search_jobs("python")
        assert "timed out" in str(exc_info.value)

    @patch("httpx.Client.get")
    def test_categories_and_health_check(self, mock_get, adzuna_provider):
        mock_resp = MagicMock()
        mock_resp.is_success = True
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            "results": [
                {"tag": "it-jobs", "label": "IT Jobs"},
                {"tag": "engineering-jobs", "label": "Engineering Jobs"},
            ]
        }
        mock_get.return_value = mock_resp

        categories = adzuna_provider.get_categories(country="in")
        assert len(categories) == 2
        assert categories[0]["tag"] == "it-jobs"

        # health_check calls get_categories internally
        assert adzuna_provider.health_check() is True


# ==========================================
# 3. JobDataService Tests (Facade & Multi-Provider Aggregation)
# ==========================================

class MockProvider(JobDataProvider):
    """Test helper mock provider."""

    def __init__(self, name: str, priority: int = 1, mock_listings=None, mock_salary=None, healthy=True):
        super().__init__(config={"enabled": True, "priority": priority})
        self._name = name
        self._mock_listings = mock_listings or []
        self._mock_salary = mock_salary
        self._healthy = healthy

    @property
    def provider_name(self) -> str:
        return self._name

    def search_jobs(self, keywords, location="", **kwargs):
        return self._mock_listings

    def get_salary_data(self, job_title, location="", country="in", **kwargs):
        return self._mock_salary

    def get_categories(self, country="in"):
        return [{"tag": f"{self._name}-tech", "label": "Tech"}]

    def health_check(self) -> bool:
        return self._healthy


class TestJobDataService:
    """Test facade coordination, deduplication, and failover across providers."""

    def test_multi_provider_aggregation_and_deduplication(self):
        # Listing 1 (Primary provider, priority 1)
        job1 = JobListing(
            title="Senior Django Developer",
            company="Alpha Tech",
            url="https://adzuna.com/1",
            source_provider="adzuna",
            source_id="101",
            location_city="Bangalore",
        )
        # Listing 2 (Duplicate from secondary provider, priority 2)
        job2_duplicate = JobListing(
            title="senior django developer",
            company="alpha tech",
            url="https://reed.com/202",
            source_provider="reed",
            source_id="202",
            location_city="bangalore",
        )
        # Listing 3 (Unique from secondary provider)
        job3_unique = JobListing(
            title="React Developer",
            company="Beta Corp",
            url="https://reed.com/303",
            source_provider="reed",
            source_id="303",
            location_city="Mumbai",
        )

        p1 = MockProvider(name="adzuna", priority=1, mock_listings=[job1])
        p2 = MockProvider(name="reed", priority=2, mock_listings=[job2_duplicate, job3_unique])

        service = JobDataService(providers=[p1, p2])
        results = service.search_jobs("developer")

        # 3 total returned by providers, but 1 was duplicate -> 2 final results
        assert len(results) == 2
        # First listing should be from the higher-priority provider (adzuna)
        assert results[0].source_provider == "adzuna"
        assert results[0].source_id == "101"
        # Second listing should be the unique listing from reed
        assert results[1].source_provider == "reed"
        assert results[1].title == "React Developer"

    def test_filter_by_specific_provider(self):
        p1 = MockProvider(name="adzuna", priority=1, mock_listings=[
            JobListing(title="A", company="C", url="u", source_provider="adzuna", source_id="1")
        ])
        p2 = MockProvider(name="reed", priority=2, mock_listings=[
            JobListing(title="B", company="C", url="u", source_provider="reed", source_id="2")
        ])

        service = JobDataService(providers=[p1, p2])
        adzuna_only = service.search_jobs("python", providers=["adzuna"])
        assert len(adzuna_only) == 1
        assert adzuna_only[0].source_provider == "adzuna"

    def test_graceful_degradation_when_one_provider_fails(self):
        failing_provider = MagicMock(spec=JobDataProvider)
        failing_provider.provider_name = "failing"
        failing_provider.priority = 1
        failing_provider.search_jobs.side_effect = ProviderUnavailableError("Down for maintenance", provider="failing")

        working_job = JobListing(
            title="Go Engineer", company="Fast Corp", url="https://ex.com/1",
            source_provider="working", source_id="1"
        )
        working_provider = MockProvider(name="working", priority=2, mock_listings=[working_job])

        service = JobDataService(providers=[failing_provider, working_provider])
        results = service.search_jobs("go")

        assert len(results) == 1
        assert results[0].source_provider == "working"

    def test_all_providers_failing_raises_exception(self):
        failing1 = MagicMock(spec=JobDataProvider)
        failing1.provider_name = "failing1"
        failing1.priority = 1
        failing1.search_jobs.side_effect = ProviderUnavailableError("Failing 1", provider="failing1")

        failing2 = MagicMock(spec=JobDataProvider)
        failing2.provider_name = "failing2"
        failing2.priority = 2
        failing2.search_jobs.side_effect = ProviderUnavailableError("Failing 2", provider="failing2")

        service = JobDataService(providers=[failing1, failing2])
        with pytest.raises(ProviderUnavailableError):
            service.search_jobs("python")

    def test_get_salary_data_priority_fallback(self):
        p1 = MockProvider(name="adzuna", priority=1, mock_salary=None)
        salary_estimate = SalaryEstimate(job_title="DevOps", location="India", average=1800000.0, source_provider="reed")
        p2 = MockProvider(name="reed", priority=2, mock_salary=salary_estimate)

        service = JobDataService(providers=[p1, p2])
        result = service.get_salary_data("DevOps", location="India")

        assert result is not None
        assert result.source_provider == "reed"
        assert result.average == 1800000.0

    def test_health_check_aggregation(self):
        p1 = MockProvider(name="adzuna", healthy=True)
        p2 = MockProvider(name="reed", healthy=False)

        service = JobDataService(providers=[p1, p2])
        status = service.health_check()

        assert status["healthy"] is True  # At least one provider is healthy
        assert status["all_healthy"] is False  # Not all are healthy
        assert status["providers"]["adzuna"] is True
        assert status["providers"]["reed"] is False

    def test_dynamic_provider_registration(self):
        service = JobDataService(providers=[])
        assert len(service.providers) == 0

        new_provider = MockProvider(name="custom_api", priority=5)
        service.register_provider(new_provider)

        assert len(service.providers) == 1
        assert service.get_provider("custom_api") is not None

    def test_get_job_service_singleton(self):
        s1 = get_job_service()
        s2 = get_job_service()
        assert s1 is s2
