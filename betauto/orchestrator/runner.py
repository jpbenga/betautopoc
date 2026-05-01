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

ROOT_DIR = Path(__file__).resolve().parents[2]
COVERAGE_REGISTRY_PATH = ROOT_DIR / "config" / "coverage" / "football_leagues.json"


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _emit(log_callback: Callable[[str], None] | None, message: str) -> None:
    if log_callback:
        log_callback(message)


def _emit_league_fixture_summary(
    log_callback: Callable[[str], None] | None,
    context_trace: dict[str, Any],
    target_date: str,
) -> None:
    rows = context_trace.get("fixtures_fetched_by_league")
    if not isinstance(rows, list):
        return
    for row in rows:
        if not isinstance(row, dict):
            continue
        league_id = row.get("league_id")
        name = row.get("competition_name") or f"League {league_id}"
        country = row.get("country") or "Unknown country"
        fetched = int(row.get("fixtures_fetched", 0) or 0)
        in_context = int(row.get("fixtures_in_context", 0) or 0)
        skipped = int(row.get("matches_skipped_count", 0) or 0)
        seasons = row.get("seasons_from_fixtures")
        season_label = ", ".join(str(season) for season in seasons) if isinstance(seasons, list) and seasons else "fixture_date_only"
        _emit(
            log_callback,
            "[coverage] "
            f"{fetched} matchs trouvés pour {name} ({country}, league_id={league_id}) "
            f"sur {target_date}; "
            f"in_context={in_context}; skipped={skipped}; seasons={season_label}",
        )


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


def _active_coverage_leagues(path: Path = COVERAGE_REGISTRY_PATH) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    payload = json.loads(path.read_text(encoding="utf-8"))
    leagues = payload.get("leagues") if isinstance(payload, dict) else []
    if not isinstance(leagues, list):
        return []
    active: list[dict[str, Any]] = []
    for league in leagues:
        if not isinstance(league, dict):
            continue
        league_id = league.get("league_id")
        if league.get("enabled") is True and isinstance(league_id, int):
            active.append(league)
    return active


def _league_ids_for_context(resolved_strategy: Any) -> tuple[list[int], list[dict[str, Any]], str]:
    active_leagues = _active_coverage_leagues()
    if active_leagues:
        return [int(league["league_id"]) for league in active_leagues], active_leagues, "coverage_registry"

    strategy_ids = list(resolved_strategy.league_ids_allowed or [])
    metadata = [
        {"league_id": league_id, "competition_name": f"Strategy league {league_id}", "country": None}
        for league_id in strategy_ids
    ]
    return strategy_ids, metadata, "strategy_scope"


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
    run_metadata_callback: Callable[[dict[str, Any]], None] | None = None,
    stop_requested: Callable[[], bool] | None = None,
) -> dict[str, Any]:
    load_dotenv()
    log_runtime_mode()

    run_id = uuid.uuid4().hex[:12]
    run_dir = Path(output_dir) / run_id
    run_dir.mkdir(parents=True, exist_ok=True)
    if run_metadata_callback:
        run_metadata_callback({"run_id": run_id, "run_dir": str(run_dir)})

    resolved_strategy_file = _resolve_strategy_file(strategy_file)
    resolved_strategy = load_and_resolve_strategy(resolved_strategy_file)
    active_league_ids, active_league_metadata, league_source = _league_ids_for_context(resolved_strategy)

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
        "upstream_trace": {
            "league_source": league_source,
            "active_leagues_count": len(active_league_ids),
            "active_league_ids": active_league_ids,
        },
    }

    write_json(run_dir / "run_summary.json", summary)

    _emit(log_callback, "[orchestrator] Chargement stratégie")
    write_json(run_dir / "resolved_strategy.json", resolved_strategy.model_dump(mode="json"))
    summary["files"]["resolved_strategy"] = str(run_dir / "resolved_strategy.json")
    _emit(
        log_callback,
        "[orchestrator] "
        f"{len(active_league_ids)} ligues actives depuis {league_source}: {active_league_ids}",
    )

    if with_browser:
        _emit(log_callback, "Browser execution is not implemented in orchestrator API mode yet.")

    context_payload: dict[str, Any] = {}
    context_file = run_dir / "analysis_context.json"
    if skip_context:
        summary["steps"]["analysis_context"] = "skipped"
    else:
        _emit(log_callback, "[orchestrator] Construction contexte analyse")
        builder = AnalysisContextBuilder(
            league_id=(active_league_ids[0] if active_league_ids else None),
            league_ids=active_league_ids or None,
            league_metadata=active_league_metadata,
            bookmaker_id=resolved_strategy.bookmaker_id,
            bookmaker_name=resolved_strategy.bookmaker_name,
            log_callback=log_callback,
        )
        context_payload = builder.build(target_date=target_date)
        write_json(context_file, context_payload)
        context_trace = context_payload.get("pipeline_trace") if isinstance(context_payload.get("pipeline_trace"), dict) else {}
        summary["upstream_trace"].update(context_trace)
        fixtures_total = int(context_trace.get("fixtures_fetched_total", 0) or 0)
        context_count = int(context_trace.get("fixtures_in_context_count", 0) or 0)
        _emit(
            log_callback,
            "[orchestrator] "
            f"fixtures_fetched_total={fixtures_total} "
            f"fixtures_in_context_count={context_count} "
            f"matches_skipped_count={context_trace.get('matches_skipped_count', 0)}",
        )
        _emit_league_fixture_summary(log_callback, context_trace, target_date)
        _emit(log_callback, f"[orchestrator] {context_count} matchs trouvés pour {target_date}")
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

        def write_partial_analysis(results: list[dict[str, Any]], stats: dict[str, Any]) -> None:
            partial_payload = {
                "generated_at": _utc_now_iso(),
                "target_date": target_date,
                "context_file": str(context_file),
                "model": model,
                "status": "stopped" if stats.get("stopped") else "running",
                "partial": True,
                "stats": stats,
                "upstream_trace": {
                    **summary["upstream_trace"],
                    "matches_analyzed_count": stats.get("matches_analyzed_count", len(results)),
                    "matches_skipped_count": int(summary["upstream_trace"].get("matches_skipped_count", 0) or 0)
                    + int(stats.get("matches_skipped_count", 0) or 0),
                    "matches_skipped_reasons": (summary["upstream_trace"].get("matches_skipped_reasons", []) or [])
                    + (stats.get("matches_skipped_reasons", []) or []),
                    "max_matches": stats.get("max_matches"),
                    "matches_available_before_limit": stats.get("matches_available_before_limit"),
                },
                "results": results,
            }
            write_json(analysis_file, partial_payload)

        results, stats = run_analysis_batch_with_stats(
            context_file=str(context_file),
            llm=llm,
            max_matches=max_matches,
            sleep_between_matches=sleep_between_matches,
            log_callback=log_callback,
            stop_requested=stop_requested,
            partial_callback=write_partial_analysis,
        )
        context_skipped_count = int(summary["upstream_trace"].get("matches_skipped_count", 0) or 0)
        batch_skipped_count = int(stats.get("matches_skipped_count", 0) or 0)
        context_skipped_reasons = summary["upstream_trace"].get("matches_skipped_reasons", []) or []
        batch_skipped_reasons = stats.get("matches_skipped_reasons", []) or []
        summary["upstream_trace"].update(
            {
                "matches_analyzed_count": stats.get("matches_analyzed_count", stats.get("total_matches", 0)),
                "matches_skipped_count": context_skipped_count + batch_skipped_count,
                "matches_skipped_reasons": context_skipped_reasons + batch_skipped_reasons,
                "max_matches": stats.get("max_matches"),
                "matches_available_before_limit": stats.get("matches_available_before_limit"),
            }
        )
        _emit(
            log_callback,
            "[orchestrator] "
            f"matches_analyzed_count={summary['upstream_trace'].get('matches_analyzed_count', 0)} "
            f"matches_skipped_count={summary['upstream_trace'].get('matches_skipped_count', 0)}",
        )
        analysis_payload = {
            "generated_at": _utc_now_iso(),
            "target_date": target_date,
            "context_file": str(context_file),
            "model": model,
            "status": "stopped" if stats.get("stopped") else "completed",
            "partial": bool(stats.get("stopped")),
            "stats": stats,
            "upstream_trace": summary["upstream_trace"],
            "results": results,
        }
        write_json(analysis_file, analysis_payload)
        if stats.get("stopped"):
            stopped_after = int(stats.get("stopped_after_count", len(results)) or 0)
            total_matches = int(stats.get("total_matches", 0) or 0)
            message = f"Analysis interrupted after {stopped_after}/{total_matches} matches"
            _emit(log_callback, f"[analysis] {message}")
            summary["steps"]["match_analysis"] = "stopped"
            summary["steps"]["aggregation"] = "skipped"
            summary["steps"]["filtering"] = "skipped"
            summary["steps"]["selection"] = "skipped"
            summary["files"]["match_analysis"] = str(analysis_file)
            summary.update(
                _date_consistency_metadata(
                    target_date=target_date,
                    run_dir=run_dir,
                    context_payload=context_payload,
                    analysis_payload=analysis_payload,
                )
            )
            summary["date_consistency_status"] = "stopped"
            summary["finished_at"] = _utc_now_iso()
            summary["status"] = "stopped"
            summary["message"] = message
            write_json(run_dir / "run_summary.json", summary)
            return summary

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
