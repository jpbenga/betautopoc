from __future__ import annotations

import logging
import os
import re
from collections.abc import Callable
from typing import Any

from .errors import (
    ExternalApiClientError,
    ExternalApiError,
    ExternalApiPermanentError,
    ExternalApiRateLimitError,
    ExternalApiServerError,
    ExternalApiTimeoutError,
)
from .retry import retry_with_backoff

logger = logging.getLogger(__name__)
_RETRY_AFTER_RE = re.compile(r"try again in\s*([0-9]+(?:\.[0-9]+)?)s", flags=re.IGNORECASE)


def _extract_retry_after_seconds(error: Exception) -> float | None:
    response = getattr(error, "response", None)
    if response is not None:
        headers = getattr(response, "headers", {}) or {}
        retry_after = headers.get("retry-after") or headers.get("Retry-After")
        if retry_after:
            try:
                return float(retry_after)
            except (TypeError, ValueError):
                pass

    match = _RETRY_AFTER_RE.search(str(error))
    if match:
        return float(match.group(1))
    return None


def _map_openai_error(operation_name: str, error: Exception) -> ExternalApiError:
    status_code = getattr(error, "status_code", None)
    retry_after = _extract_retry_after_seconds(error)
    type_name = error.__class__.__name__.lower()

    if "ratelimit" in type_name or status_code == 429:
        return ExternalApiRateLimitError(
            provider="openai",
            operation=operation_name,
            status_code=429,
            message="Rate limit reached.",
            retry_after_seconds=retry_after,
            raw_error=error,
        )

    if "timeout" in type_name:
        return ExternalApiTimeoutError(
            provider="openai",
            operation=operation_name,
            status_code=status_code,
            message="Request timed out.",
            retry_after_seconds=retry_after,
            raw_error=error,
        )

    if "connection" in type_name:
        return ExternalApiServerError(
            provider="openai",
            operation=operation_name,
            status_code=status_code,
            message="Connection error.",
            retry_after_seconds=retry_after,
            raw_error=error,
        )

    if status_code in {500, 502, 503, 504}:
        return ExternalApiServerError(
            provider="openai",
            operation=operation_name,
            status_code=status_code,
            message="Transient OpenAI server error.",
            retry_after_seconds=retry_after,
            raw_error=error,
        )

    if status_code in {400, 401, 403, 404, 422}:
        return ExternalApiPermanentError(
            provider="openai",
            operation=operation_name,
            status_code=status_code,
            message="Permanent request error.",
            raw_error=error,
        )

    return ExternalApiClientError(
        provider="openai",
        operation=operation_name,
        status_code=status_code,
        message=str(error),
        retry_after_seconds=retry_after,
        raw_error=error,
    )


def should_retry_openai_error(error: Exception) -> bool:
    if isinstance(error, (ExternalApiRateLimitError, ExternalApiTimeoutError, ExternalApiServerError)):
        return True
    if isinstance(error, ExternalApiError):
        return False

    mapped = _map_openai_error("openai.responses.create", error)
    return isinstance(mapped, (ExternalApiRateLimitError, ExternalApiTimeoutError, ExternalApiServerError))


def create_response_with_retry(
    client: Any,
    *,
    model: str,
    input: str,
    operation_name: str = "openai.responses.create",
    **kwargs: Any,
) -> tuple[Any, int]:
    max_retries = int(os.getenv("OPENAI_MAX_RETRIES", "5"))
    initial_backoff = float(os.getenv("OPENAI_INITIAL_BACKOFF_SECONDS", "2"))
    max_backoff = float(os.getenv("OPENAI_MAX_BACKOFF_SECONDS", "60"))

    retries_used = 0

    def _operation() -> Any:
        nonlocal retries_used
        try:
            return client.responses.create(model=model, input=input, **kwargs)
        except Exception as exc:  # noqa: BLE001
            mapped = _map_openai_error(operation_name, exc)
            if isinstance(mapped, (ExternalApiRateLimitError, ExternalApiTimeoutError, ExternalApiServerError)):
                retries_used += 1
            raise mapped from exc

    response = retry_with_backoff(
        _operation,
        should_retry=should_retry_openai_error,
        max_retries=max_retries,
        initial_backoff=initial_backoff,
        max_backoff=max_backoff,
        logger=logger,
        operation_name=operation_name,
    )
    return response, retries_used
