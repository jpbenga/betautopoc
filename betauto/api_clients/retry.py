from __future__ import annotations

import logging
import time
from collections.abc import Callable
from typing import Any, TypeVar

from .errors import ExternalApiError
from .rate_limit import compute_backoff_delay

T = TypeVar("T")


def retry_with_backoff(
    operation: Callable[[], T],
    *,
    should_retry: Callable[[Exception], bool],
    max_retries: int,
    initial_backoff: float,
    max_backoff: float,
    logger: logging.Logger,
    operation_name: str,
) -> T:
    """Run operation with initial attempt + retries."""
    total_attempts = max_retries + 1
    last_error: Exception | None = None

    for attempt in range(1, total_attempts + 1):
        try:
            if attempt > 1:
                logger.info("[%s] retry attempt %s/%s", operation_name, attempt - 1, max_retries)
            return operation()
        except Exception as exc:  # noqa: BLE001
            last_error = exc
            retryable = should_retry(exc)
            is_last_attempt = attempt >= total_attempts

            retry_after: float | None = None
            if isinstance(exc, ExternalApiError):
                retry_after = exc.retry_after_seconds
                exc.attempt = attempt

            logger.warning(
                "[%s] attempt=%s/%s failed retryable=%s error=%s",
                operation_name,
                attempt,
                total_attempts,
                retryable,
                exc,
            )

            if not retryable or is_last_attempt:
                logger.error("[%s] final failure after %s attempts", operation_name, attempt)
                raise

            sleep_seconds = compute_backoff_delay(
                attempt,
                initial_backoff=initial_backoff,
                max_backoff=max_backoff,
                retry_after_seconds=retry_after,
            )
            logger.info("[%s] waiting %.2fs before retry", operation_name, sleep_seconds)
            time.sleep(sleep_seconds)

    assert last_error is not None
    raise last_error
