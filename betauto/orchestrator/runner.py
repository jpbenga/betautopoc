from __future__ import annotations

import json
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable

from dotenv import load_dotenv
from openai import OpenAI

from betauto.analysis_context import AnalysisContextBuilder
from betauto.analysis_context.exporter import write_json
from betauto.analysis_engine import (
    aggregate_candidates_from_file,
    filter_candidates_from_file,
    run_analysis_batch_with_stats,
)
from betauto.runtime_mode import log_runtime_mode
from betauto.selection_engine import SelectionConfig, select_combo
from betauto.strategy import load_and_resolve_strategy


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _emit(log_callback: Callable[[str], None] | None, message: str) -> None:
    if log_callback:
        log_callback(message)


def _resolve_strategy_file(strategy_file: str | None) -> str:
    return strategy_file or os.getenv("BETAUTO_STRATEGY_FILE") or "config/strategies/default.json"


def _selection_config_from_strategy(resolved_strategy: Any) -> SelectionConfig:
    return SelectionConfig(
        combo_min_odds=resolved_strategy.combo_min_odds if resolved_strategy.combo_min_odds is not None else 2.8,
        combo_max_odds=resolved_strategy.combo_max_odds if resolved_strategy.combo_max_odds is not None else 3.5,
        max_picks=resolved_strategy.max_picks,
        min_pick_confidence=resolved_strategy.min_pick_confidence,
        min_global_match_confidence=resolved_strategy.min_global_match_confidence,
    )


def _date_consistency_metadata(
    *,
    target_date: str,
    run_dir: Path,
    context_payload: dict[str, Any] | None = None,
    analysis_payload: dict[str, Any] | None = None,
    selection_payload: dict[str, Any] | None = None,
) -> dict[str, Any]:
    context_file = run_dir / "analysis_context.json"
    analysis_file = run_dir / "match_analysis.json"
    aggregation_file = run_dir / "aggregation_candidates.json"
    filtered_candidates_file = run_dir / "filtered_candidates.json"
    selection_file = run_dir / "selection.json"
    effective_context_date = (context_payload or {}).get("target_date")
    match_analysis_target_date = (analysis_payload or {}).get("target_date")
    selection_input_file = (selection_payload or {}).get("input_file")

    status = "unknown"
    if effective_context_date == target_date:
        status = "ok"
    if effective_context_date and effective_context_date != target_date:
        status = "mismatch"
    if match_analysis_target_date and match_analysis_target_date != target_date:
        status = "mismatch"
    expected_selection_input = filtered_candidates_file if filtered_candidates_file.exists() else analysis_file
    if selection_input_file and Path(selection_input_file) != expected_selection_input:
        status = "mismatch"

    return {
        "effective_context_date": effective_context_date,
        "match_analysis_target_date": match_analysis_target_date,
        "analysis_context_file": str(context_file) if context_file.exists() else None,
        "match_analysis_file": str(analysis_file) if analysis_file.exists() else None,
        "aggregation_candidates_file": str(aggregation_file) if aggregation_file.exists() else None,
        "filtered_candidates_file": str(filtered_candidates_file) if filtered_candidates_file.exists() else None,
        "selection_file": str(selection_file) if selection_file.exists() else None,
        "selection_input_file": selection_input_file,
        "data_source_mode": "run_artifacts",
        "date_consistency_status": status,
    }


def _validate_run_artifact(path: Path, run_dir: Path, label: str) -> None:
    if not path.exists():
        raise RuntimeError(f"{label} missing in current run artifacts: {path}")
    if path.parent.resolve() != run_dir.resolve():
        raise RuntimeError(f"{label} must come from current run_dir, got: {path}")


def _assert_date_consistency(summary: dict[str, Any]) -> None:
    if summary.get("date_consistency_status") != "ok":
        raise RuntimeError(
            "Date consistency failed: "
            f"target_date={summary.get('target_date')} "
            f"effective_context_date={summary.get('effective_context_date')} "
            f"match_analysis_target_date={summary.get('match_analysis_target_date')} "
            f"filtered_candidates_file={summary.get('filtered_candidates_file')} "
            f"selection_input_file={summary.get('selection_input_file')}"
        )


def run_orchestrated_pipeline(
    target_date: str,
    strategy_file: str | None = None,
    output_dir: str = "data/orchestrator_runs",
    max_matches: int | None = None,
    sleep_between_matches: float | None = None,
    skip_context: bool = False,
    skip_analysis: bool = False,
    skip_selection: bool = False,
    with_browser: bool = False,
    log_callback: Callable[[str], None] | None = None,
) -> dict[str, Any]:
    load_dotenv()
    log_runtime_mode()

    run_id = uuid.uuid4().hex[:12]
    run_dir = Path(output_dir) / run_id
    run_dir.mkdir(parents=True, exist_ok=True)

    resolved_strategy_file = _resolve_strategy_file(strategy_file)
    resolved_strategy = load_and_resolve_strategy(resolved_strategy_file)

    summary: dict[str, Any] = {
        "run_id": run_id,
        "target_date": target_date,
        "run_dir": str(run_dir),
        "strategy_file": resolved_strategy_file,
        "started_at": _utc_now_iso(),
        "with_browser": with_browser,
        "data_source_mode": "run_artifacts",
        "date_consistency_status": "unknown",
        "steps": {},
        "files": {},
    }

    write_json(run_dir / "run_summary.json", summary)

    _emit(log_callback, "[orchestrator] Chargement stratégie")
    write_json(run_dir / "resolved_strategy.json", resolved_strategy.model_dump(mode="json"))
    summary["files"]["resolved_strategy"] = str(run_dir / "resolved_strategy.json")

    if with_browser:
        _emit(log_callback, "Browser execution is not implemented in orchestrator API mode yet.")

    context_payload: dict[str, Any] = {}
    context_file = run_dir / "analysis_context.json"
    if skip_context:
        summary["steps"]["analysis_context"] = "skipped"
    else:
        _emit(log_callback, "[orchestrator] Construction contexte analyse")
        builder = AnalysisContextBuilder(
            league_id=(resolved_strategy.league_ids_allowed[0] if resolved_strategy.league_ids_allowed else None),
            season=resolved_strategy.season,
            bookmaker_id=resolved_strategy.bookmaker_id,
            bookmaker_name=resolved_strategy.bookmaker_name,
        )
        context_payload = builder.build(target_date=target_date)
        write_json(context_file, context_payload)
        if context_payload.get("target_date") != target_date:
            summary.update(
                _date_consistency_metadata(target_date=target_date, run_dir=run_dir, context_payload=context_payload)
            )
            summary["status"] = "failed"
            summary["error"] = "Analysis context target_date mismatch."
            write_json(run_dir / "run_summary.json", summary)
            _assert_date_consistency(summary)

        matches = context_payload.get("matches") or []
        if not matches:
            message = f"No matches found for target date {target_date}"
            _emit(log_callback, f"[orchestrator] {message}")
            summary["steps"]["analysis_context"] = "completed_no_data"
            summary["steps"]["match_analysis"] = "skipped"
            summary["steps"]["aggregation"] = "skipped"
            summary["steps"]["filtering"] = "skipped"
            summary["steps"]["selection"] = "skipped"
            summary["files"]["analysis_context"] = str(context_file)
            summary.update(
                _date_consistency_metadata(target_date=target_date, run_dir=run_dir, context_payload=context_payload)
            )
            summary["date_consistency_status"] = "no_data"
            summary["finished_at"] = _utc_now_iso()
            summary["selection"] = {"status": "completed_no_data", "picks": [], "notes": [message], "errors": []}
            summary["status"] = "completed_no_data"
            summary["message"] = message
            write_json(run_dir / "run_summary.json", summary)
            return summary

        summary["steps"]["analysis_context"] = "completed"
        summary["files"]["analysis_context"] = str(context_file)

    analysis_file = run_dir / "match_analysis.json"
    aggregation_file = run_dir / "aggregation_candidates.json"
    filtered_candidates_file = run_dir / "filtered_candidates.json"
    analysis_payload: dict[str, Any] = {}
    if skip_analysis:
        summary["steps"]["match_analysis"] = "skipped"
    else:
        _emit(log_callback, "[orchestrator] Analyse match par match")
        api_key = os.getenv("OPENAI_API_KEY")
        model = os.getenv("OPENAI_ANALYSIS_MODEL")
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY manquant dans .env.")
        if not model:
            raise RuntimeError("OPENAI_ANALYSIS_MODEL manquant dans .env.")

        if not context_file.exists():
            raise RuntimeError("Analysis context manquant pour l'étape d'analyse.")
        _validate_run_artifact(context_file, run_dir, "analysis_context")

        llm = OpenAI(api_key=api_key)
        llm.analysis_model = model

        results, stats = run_analysis_batch_with_stats(
            context_file=str(context_file),
            llm=llm,
            max_matches=max_matches,
            sleep_between_matches=sleep_between_matches,
        )
        analysis_payload = {
            "generated_at": _utc_now_iso(),
            "target_date": target_date,
            "context_file": str(context_file),
            "model": model,
            "stats": stats,
            "results": results,
        }
        write_json(analysis_file, analysis_payload)
        summary["steps"]["match_analysis"] = "completed"
        summary["files"]["match_analysis"] = str(analysis_file)

    filtered_candidates_payload: dict[str, Any] = {}
    if skip_analysis:
        summary["steps"]["aggregation"] = "skipped"
        summary["steps"]["filtering"] = "skipped"
    else:
        _emit(log_callback, "[orchestrator] Agrégation candidats")
        _validate_run_artifact(analysis_file, run_dir, "match_analysis")
        aggregation_payload = aggregate_candidates_from_file(analysis_file, aggregation_file)
        summary["steps"]["aggregation"] = "completed"
        summary["files"]["aggregation_candidates"] = str(aggregation_file)
        _emit(
            log_callback,
            f"[orchestrator] {aggregation_payload.get('candidate_count', 0)} candidats agrégés",
        )

        _emit(log_callback, "[orchestrator] Filtrage candidats")
        _validate_run_artifact(aggregation_file, run_dir, "aggregation_candidates")
        filtered_candidates_payload = filter_candidates_from_file(
            aggregation_file,
            filtered_candidates_file,
            resolved_strategy,
        )
        summary["steps"]["filtering"] = "completed"
        summary["files"]["filtered_candidates"] = str(filtered_candidates_file)
        _emit(
            log_callback,
            "[orchestrator] "
            f"{filtered_candidates_payload.get('candidate_count', 0)} candidats retenus, "
            f"{filtered_candidates_payload.get('rejected_count', 0)} rejetés",
        )

    selection_payload: dict[str, Any] = {}
    selection_file = run_dir / "selection.json"
    if skip_selection:
        summary["steps"]["selection"] = "skipped"
    else:
        _emit(log_callback, "[orchestrator] Sélection ticket")
        api_key = os.getenv("OPENAI_API_KEY")
        model = os.getenv("SELECTION_ENGINE_MODEL") or os.getenv("OPENAI_ANALYSIS_MODEL")
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY manquant dans .env.")
        if not model:
            raise RuntimeError("SELECTION_ENGINE_MODEL ou OPENAI_ANALYSIS_MODEL manquant dans .env.")

        llm = OpenAI(api_key=api_key)
        llm.analysis_model = model

        selection_config = _selection_config_from_strategy(resolved_strategy)
        _validate_run_artifact(filtered_candidates_file, run_dir, "filtered_candidates")
        selection_payload = select_combo(
            match_analyses=filtered_candidates_payload,
            config=selection_config,
            llm=llm,
            input_file=str(filtered_candidates_file),
        )
        if selection_payload.get("input_file") != str(filtered_candidates_file):
            raise RuntimeError(
                "Selection input_file must point to current run filtered_candidates artifact, "
                f"got: {selection_payload.get('input_file')}"
            )
        write_json(selection_file, selection_payload)
        summary["steps"]["selection"] = "completed"
        summary["files"]["selection"] = str(selection_file)

    summary.update(
        _date_consistency_metadata(
            target_date=target_date,
            run_dir=run_dir,
            context_payload=context_payload,
            analysis_payload=analysis_payload,
            selection_payload=selection_payload,
        )
    )
    _assert_date_consistency(summary)
    summary["finished_at"] = _utc_now_iso()
    summary["selection"] = selection_payload
    summary["status"] = "completed"
    write_json(run_dir / "run_summary.json", summary)

    _emit(log_callback, "[orchestrator] Run terminé")
    return summary
