from __future__ import annotations

import random


def compute_backoff_delay(
    attempt: int,
    *,
    initial_backoff: float,
    max_backoff: float,
    retry_after_seconds: float | None = None,
) -> float:
    """Compute delay using Retry-After or exponential backoff with jitter."""
    if retry_after_seconds is not None and retry_after_seconds >= 0:
        return min(float(retry_after_seconds), max_backoff)

    base = min(max_backoff, initial_backoff * (2 ** max(0, attempt - 1)))
    jitter = random.uniform(0, base * 0.2)
    return min(max_backoff, base + jitter)
