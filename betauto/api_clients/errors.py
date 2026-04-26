from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass
class ExternalApiError(Exception):
    provider: str
    operation: str
    message: str
    status_code: int | None = None
    retry_after_seconds: float | None = None
    attempt: int | None = None
    raw_error: Any | None = None

    def __str__(self) -> str:
        status = f" status={self.status_code}" if self.status_code is not None else ""
        retry_after = (
            f" retry_after={self.retry_after_seconds}s" if self.retry_after_seconds is not None else ""
        )
        attempt = f" attempt={self.attempt}" if self.attempt is not None else ""
        return f"[{self.provider}] {self.operation}:{status}{retry_after}{attempt} {self.message}".strip()


class ExternalApiRateLimitError(ExternalApiError):
    pass


class ExternalApiTimeoutError(ExternalApiError):
    pass


class ExternalApiServerError(ExternalApiError):
    pass


class ExternalApiClientError(ExternalApiError):
    pass


class ExternalApiPermanentError(ExternalApiError):
    pass
