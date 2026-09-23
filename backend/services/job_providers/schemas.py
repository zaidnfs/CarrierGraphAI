"""
Data schemas and normalized entities for the job data provider system.
"""

from dataclasses import asdict, dataclass, field
from datetime import datetime
from typing import Any


@dataclass
class JobListing:
    """
    Normalized representation of a job posting across any data provider.
    """

    title: str
    company: str
    url: str
    source_provider: str
    source_id: str
    description: str = ""
    location_city: str = ""
    location_country: str = ""
    salary_min: float | None = None
    salary_max: float | None = None
    currency: str = "INR"
    posted_date: datetime | str | None = None
    category: str = ""
    raw_data: dict[str, Any] = field(default_factory=dict)

    @property
    def dedup_key(self) -> tuple[str, str, str]:
        """
        Normalized tuple used to detect duplicate listings across different providers.
        """
        norm_title = " ".join(self.title.lower().split())
        norm_company = " ".join(self.company.lower().split())
        norm_city = " ".join(self.location_city.lower().split())
        return (norm_title, norm_company, norm_city)

    def to_dict(self) -> dict[str, Any]:
        """Convert the listing to a serializable dictionary."""
        data = asdict(self)
        if isinstance(self.posted_date, datetime):
            data["posted_date"] = self.posted_date.isoformat()
        return data


@dataclass
class SalaryEstimate:
    """
    Normalized representation of market salary statistics for a role/location.
    """

    job_title: str
    location: str
    average: float | None = None
    min: float | None = None
    max: float | None = None
    currency: str = "INR"
    source_provider: str = ""
    raw_data: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        """Convert the salary estimate to a serializable dictionary."""
        return asdict(self)


@dataclass
class ProviderConfig:
    """
    Configuration options for a job data provider.
    """

    name: str
    enabled: bool = True
    priority: int = 1
    rate_limit_per_minute: int = 25
    credentials: dict[str, Any] = field(default_factory=dict)
