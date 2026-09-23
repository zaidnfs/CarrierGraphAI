"""
Exceptions for job data providers.
"""


class JobProviderError(Exception):
    """Base exception for all job provider errors."""

    def __init__(self, message: str, provider: str | None = None, status_code: int | None = None):
        super().__init__(message)
        self.message = message
        self.provider = provider
        self.status_code = status_code

    def __str__(self) -> str:
        prefix = f"[{self.provider}] " if self.provider else ""
        if self.status_code:
            return f"{prefix}{self.message} (HTTP {self.status_code})"
        return f"{prefix}{self.message}"


class ProviderAuthError(JobProviderError):
    """Raised when authentication credentials are missing or rejected by the provider."""


class ProviderRateLimitError(JobProviderError):
    """Raised when request rate limits are exceeded."""

    def __init__(
        self,
        message: str = "Rate limit exceeded",
        provider: str | None = None,
        retry_after: int | None = None,
        status_code: int = 429,
    ):
        super().__init__(message, provider=provider, status_code=status_code)
        self.retry_after = retry_after


class ProviderUnavailableError(JobProviderError):
    """Raised when the provider service is unreachable, timed out, or returned a 5xx error."""


class ProviderResponseError(JobProviderError):
    """Raised when provider returns an unparseable or unexpected response payload."""
