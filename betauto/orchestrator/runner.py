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
from betauto.analysis_engine import run_analysis_batch_with_stats
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
        summary["steps"]["analysis_context"] = "completed"
        summary["files"]["analysis_context"] = str(context_file)

    analysis_file = run_dir / "match_analysis.json"
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
            "context_file": str(context_file),
            "model": model,
            "stats": stats,
            "results": results,
        }
        write_json(analysis_file, analysis_payload)
        summary["steps"]["match_analysis"] = "completed"
        summary["files"]["match_analysis"] = str(analysis_file)

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
        selection_payload = select_combo(
            match_analyses=analysis_payload,
            config=selection_config,
            llm=llm,
            input_file=str(analysis_file),
        )
        write_json(selection_file, selection_payload)
        summary["steps"]["selection"] = "completed"
        summary["files"]["selection"] = str(selection_file)

    summary["finished_at"] = _utc_now_iso()
    summary["selection"] = selection_payload
    summary["status"] = "completed"
    write_json(run_dir / "run_summary.json", summary)

    _emit(log_callback, "[orchestrator] Run terminé")
    return summary
