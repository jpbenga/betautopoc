from __future__ import annotations

import json
import logging
import os
import time
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any

from .match_analyzer import analyze_match

logger = logging.getLogger(__name__)


@dataclass(slots=True)
class BatchRunStats:
    total_matches: int = 0
    success_count: int = 0
    failed_count: int = 0
    elapsed_seconds: float = 0.0
    total_input_tokens: int = 0
    total_output_tokens: int = 0
    total_tokens: int = 0
    estimated_cost_usd: float = 0.0
    per_match_status: list[dict[str, Any]] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


def _estimate_cost_usd(input_tokens: int, output_tokens: int) -> float:
    input_per_1m = float(os.getenv("OPENAI_INPUT_COST_PER_1M", "0"))
    output_per_1m = float(os.getenv("OPENAI_OUTPUT_COST_PER_1M", "0"))
    return ((input_tokens / 1_000_000) * input_per_1m) + ((output_tokens / 1_000_000) * output_per_1m)


def run_analysis_batch_with_stats(context_file: str, llm) -> tuple[list[dict], dict[str, Any]]:
    context_path = Path(context_file)
    payload = json.loads(context_path.read_text(encoding="utf-8"))
    matches: list[dict[str, Any]] = payload.get("matches", [])

    start = time.perf_counter()
    results: list[dict[str, Any]] = []
    stats = BatchRunStats(total_matches=len(matches))

    for match in matches:
        fixture_id = match.get("fixture_id")
        analysis_result = analyze_match(match, llm)
        results.append(analysis_result)

        status = analysis_result.get("status", "failed")
        usage = analysis_result.get("llm_usage", {}) or {}
        input_tokens = int(usage.get("input_tokens", 0) or 0)
        output_tokens = int(usage.get("output_tokens", 0) or 0)
        total_tokens = int(usage.get("total_tokens", 0) or 0)
        estimated_cost = _estimate_cost_usd(input_tokens, output_tokens)

        analysis_result["estimated_cost_usd"] = round(estimated_cost, 8)

        stats.total_input_tokens += input_tokens
        stats.total_output_tokens += output_tokens
        stats.total_tokens += total_tokens
        stats.estimated_cost_usd += estimated_cost

        if status == "success":
            stats.success_count += 1
        else:
            stats.failed_count += 1

        stats.per_match_status.append(
            {
                "fixture_id": fixture_id,
                "status": status,
                "input_tokens": input_tokens,
                "output_tokens": output_tokens,
                "total_tokens": total_tokens,
                "estimated_cost_usd": round(estimated_cost, 8),
            }
        )
        logger.info("fixture_id=%s status=%s", fixture_id, status)

    stats.elapsed_seconds = round(time.perf_counter() - start, 3)
    stats.estimated_cost_usd = round(stats.estimated_cost_usd, 8)
    return results, stats.to_dict()


def run_analysis_batch(context_file: str, llm) -> list[dict]:
    results, _ = run_analysis_batch_with_stats(context_file=context_file, llm=llm)
    return results
