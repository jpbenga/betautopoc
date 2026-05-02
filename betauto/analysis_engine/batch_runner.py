from __future__ import annotations

import json
import logging
import os
import time
from copy import deepcopy
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any, Callable

from betauto.analysis_context.qualitative_researcher import collect_qualitative_context, should_collect_qualitative_context

from .match_analyzer import analyze_match

logger = logging.getLogger(__name__)


@dataclass(slots=True)
class BatchRunStats:
    total_matches: int = 0
    matches_available_before_limit: int = 0
    matches_analyzed_count: int = 0
    matches_skipped_count: int = 0
    matches_skipped_reasons: list[dict[str, Any]] = field(default_factory=list)
    max_matches: int | None = None
    current_index: int = 0
    current_fixture_id: int | str | None = None
    current_match_label: str | None = None
    stopped: bool = False
    stopped_after_count: int = 0
    success_count: int = 0
    failed_count: int = 0
    elapsed_seconds: float = 0.0
    total_input_tokens: int = 0
    total_output_tokens: int = 0
    total_tokens: int = 0
    estimated_cost_usd: float = 0.0
    qualitative_research_count: int = 0
    qualitative_research_failed_count: int = 0
    qualitative_signals_count: int = 0
    qualitative_sources_count: int = 0
    per_match_status: list[dict[str, Any]] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


def _estimate_cost_usd(input_tokens: int, output_tokens: int) -> float:
    input_per_1m = float(os.getenv("OPENAI_INPUT_COST_PER_1M", "0"))
    output_per_1m = float(os.getenv("OPENAI_OUTPUT_COST_PER_1M", "0"))
    return ((input_tokens / 1_000_000) * input_per_1m) + ((output_tokens / 1_000_000) * output_per_1m)


def _match_label(match: dict[str, Any]) -> str:
    home = (match.get("home_team") or {}).get("name") or "Home"
    away = (match.get("away_team") or {}).get("name") or "Away"
    return f"{home} vs {away}"


def run_analysis_batch_with_stats(
    context_file: str,
    llm,
    *,
    matches: list[dict[str, Any]] | None = None,
    strategy_cfg: Any | None = None,
    max_matches: int | None = None,
    sleep_between_matches: float | None = None,
    continue_on_error: bool = True,
    log_callback: Callable[[str], None] | None = None,
    stop_requested: Callable[[], bool] | None = None,
    partial_callback: Callable[[list[dict[str, Any]], dict[str, Any]], None] | None = None,
) -> tuple[list[dict], dict[str, Any]]:
    context_path = Path(context_file)
    if matches is None:
        payload = json.loads(context_path.read_text(encoding="utf-8"))
        matches = payload.get("matches", [])
    matches_available_before_limit = len(matches)

    env_max_matches = os.getenv("OPENAI_BATCH_MAX_MATCHES")
    if max_matches is None and env_max_matches:
        max_matches = int(env_max_matches)
    if max_matches and max_matches > 0:
        matches = matches[:max_matches]

    if sleep_between_matches is None:
        sleep_between_matches = float(os.getenv("OPENAI_SLEEP_BETWEEN_MATCHES_SECONDS", "5"))

    start = time.perf_counter()
    results: list[dict[str, Any]] = []
    stats = BatchRunStats(
        total_matches=len(matches),
        matches_available_before_limit=matches_available_before_limit,
        matches_analyzed_count=0,
        matches_skipped_count=max(0, matches_available_before_limit - len(matches)),
        matches_skipped_reasons=[
            {
                "reason": "max_matches_limit",
                "max_matches": max_matches,
                "matches_available_before_limit": matches_available_before_limit,
            }
        ]
        if max_matches and max_matches > 0 and matches_available_before_limit > len(matches)
        else [],
        max_matches=max_matches,
    )

    for index, match in enumerate(matches, start=1):
        fixture_id = match.get("fixture_id")
        competition = str(match.get("competition") or "Unknown competition")
        label = _match_label(match)
        stats.current_index = index
        stats.current_fixture_id = fixture_id
        stats.current_match_label = label
        if stop_requested and stop_requested():
            remaining = len(matches) - len(results)
            stats.stopped = True
            stats.stopped_after_count = len(results)
            stats.matches_skipped_count += remaining
            stats.matches_skipped_reasons.append(
                {
                    "reason": "stop_requested",
                    "remaining_matches": remaining,
                    "stopped_after_count": len(results),
                }
            )
            if log_callback:
                log_callback(f"[analysis] stop requested — interruption avant nouveau match après {len(results)}/{len(matches)} analyses")
            if partial_callback:
                partial_callback(results, stats.to_dict())
            break
        logger.info("[analysis_batch] [%s/%s] analyzing fixture_id=%s", index, len(matches), fixture_id)
        if log_callback:
            log_callback(f"[analysis] {index}/{len(matches)} — {competition} — {label} — analyse en cours")
        if partial_callback:
            partial_callback(results, stats.to_dict())
        match_start = time.perf_counter()

        match_for_analysis = deepcopy(match)
        qualitative_context = match_for_analysis.get("qualitative_context")
        if should_collect_qualitative_context(match_for_analysis, strategy_cfg):
            if log_callback:
                log_callback(f"[qualitative] {index}/{len(matches)} — {label} — recherche média en cours")
            qualitative_context = collect_qualitative_context(match_for_analysis, llm, strategy_cfg=strategy_cfg)
            match_for_analysis["qualitative_context"] = qualitative_context
            stats.qualitative_research_count += 1
            if isinstance(qualitative_context, dict):
                if qualitative_context.get("collection_status") == "failed":
                    stats.qualitative_research_failed_count += 1
                stats.qualitative_sources_count += len(qualitative_context.get("consulted_sources") or [])
                stats.qualitative_signals_count += len(qualitative_context.get("signals") or [])
                if log_callback:
                    log_callback(
                        "[qualitative] "
                        f"{label} — status={qualitative_context.get('collection_status')} "
                        f"sources={len(qualitative_context.get('consulted_sources') or [])} "
                        f"signals={len(qualitative_context.get('signals') or [])}"
                    )

        analysis_result = analyze_match(match_for_analysis, llm, strategy_cfg=strategy_cfg, log_callback=log_callback)
        results.append(analysis_result)
        stats.matches_analyzed_count = len(results)

        status = analysis_result.get("status", "failed")
        usage = analysis_result.get("llm_usage") or analysis_result.get("token_usage") or {}
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
            if log_callback:
                log_callback(f"[analysis] {index}/{len(matches)} — {label} — analyse terminée")
        else:
            stats.failed_count += 1
            if log_callback:
                log_callback(f"[analysis] {index}/{len(matches)} — erreur sur fixture_id={fixture_id} — match ignoré")
            if not continue_on_error:
                logger.error("[analysis_batch] stopping on error fixture_id=%s", fixture_id)

        match_elapsed = round(time.perf_counter() - match_start, 3)
        retry_count = int(analysis_result.get("retry_count", 0) or 0)
        prompt_size_chars = int(analysis_result.get("prompt_size_chars", 0) or 0)
        if retry_count > 0 and log_callback:
            log_callback(f"[analysis] fixture_id={fixture_id} a nécessité {retry_count} retry/backoff OpenAI")

        stats.per_match_status.append(
            {
                "fixture_id": fixture_id,
                "status": status,
                "input_tokens": input_tokens,
                "output_tokens": output_tokens,
                "total_tokens": total_tokens,
                "estimated_cost_usd": round(estimated_cost, 8),
                "duration_seconds": match_elapsed,
                "retry_count": retry_count,
                "prompt_size_chars": prompt_size_chars,
                "qualitative_collection_status": (qualitative_context or {}).get("collection_status")
                if isinstance(qualitative_context, dict)
                else None,
                "qualitative_sources_count": len((qualitative_context or {}).get("consulted_sources") or [])
                if isinstance(qualitative_context, dict)
                else 0,
                "qualitative_signals_count": len((qualitative_context or {}).get("signals") or [])
                if isinstance(qualitative_context, dict)
                else 0,
            }
        )
        logger.info(
            "[analysis_batch] fixture_id=%s status=%s duration=%.3fs cost=%.8f retries=%s",
            fixture_id,
            status,
            match_elapsed,
            round(estimated_cost, 8),
            retry_count,
        )

        if status != "success" and not continue_on_error:
            break

        stats.current_index = index
        stats.current_fixture_id = fixture_id
        stats.current_match_label = label
        if partial_callback:
            partial_callback(results, stats.to_dict())
        if log_callback:
            log_callback(f"[analysis] {len(results)}/{len(matches)} analyses terminées")

        if index < len(matches) and sleep_between_matches > 0:
            logger.info("[analysis_batch] sleeping %.2fs before next match", sleep_between_matches)
            if log_callback:
                log_callback(f"[analysis] pause pacing {sleep_between_matches:.1f}s avant le prochain match")
            time.sleep(sleep_between_matches)

    stats.matches_analyzed_count = len(results)
    stats.elapsed_seconds = round(time.perf_counter() - start, 3)
    stats.estimated_cost_usd = round(stats.estimated_cost_usd, 8)
    return results, stats.to_dict()


def run_analysis_batch(context_file: str, llm) -> list[dict]:
    results, _ = run_analysis_batch_with_stats(context_file=context_file, llm=llm)
    return results
