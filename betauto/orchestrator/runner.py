from __future__ import annotations

import os
import time
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any
from uuid import uuid4


from .exporter import export_run_payload
from .models import OrchestratorRunSummary, StepResult, utc_now_iso


@dataclass(slots=True)
class OrchestratorOptions:
    strategy_file: str | None
    target_date: str
    output_dir: str = "data/orchestrator_runs"
    max_matches: int | None = None
    sleep_between_matches: float | None = None
    skip_context: bool = False
    skip_analysis: bool = False
    skip_selection: bool = False
    with_browser: bool = False


class _SelectionArgsAdapter:
    def __init__(self, strategy_file: str | None) -> None:
        self.strategy_file = strategy_file
        self.combo_min_odds = None
        self.combo_max_odds = None
        self.max_picks = None
        self.min_pick_confidence = None
        self.min_global_match_confidence = None


def _make_run_id(target_date: str) -> str:
    stamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    return f"{stamp}_{target_date}_{uuid4().hex[:8]}"


def _build_analysis_context(strategy_cfg, target_date: str) -> dict[str, Any]:
    from betauto.analysis_context import AnalysisContextBuilder

    league_ids = strategy_cfg.league_ids_allowed or [None]

    aggregated: dict[str, Any] = {
        "generated_at": utc_now_iso(),
        "target_date": target_date,
        "source": {"api_football": True, "qualitative_sources": strategy_cfg.use_qualitative_context},
        "strategy": {
            "strategy_id": strategy_cfg.strategy_id,
            "season": strategy_cfg.season,
            "bookmaker_id": strategy_cfg.bookmaker_id,
            "bookmaker_name": strategy_cfg.bookmaker_name,
            "league_ids": league_ids,
        },
        "league": {
            "id": "multi" if len(league_ids) > 1 else league_ids[0],
            "name": "multi-league" if len(league_ids) > 1 else "single-league",
            "season": strategy_cfg.season,
        },
        "leagues": [],
        "matches": [],
        "api_calls": [],
    }

    for league_id in league_ids:
        builder = AnalysisContextBuilder(
            league_id=league_id,
            season=strategy_cfg.season,
            bookmaker_id=strategy_cfg.bookmaker_id,
            bookmaker_name=strategy_cfg.bookmaker_name,
        )
        payload = builder.build(target_date=target_date)

        aggregated["leagues"].append(payload.get("league", {}))
        aggregated["matches"].extend(payload.get("matches", []))
        aggregated["api_calls"].extend(payload.get("api_calls", []))

    return aggregated


def _load_json(path: Path) -> dict[str, Any]:
    import json

    return json.loads(path.read_text(encoding="utf-8"))


def run_orchestrated_pipeline(options: OrchestratorOptions) -> tuple[dict[str, Any], Path]:
    from betauto.strategy import load_and_resolve_strategy, load_strategy_as_dict

    started_at = utc_now_iso()
    run_id = _make_run_id(options.target_date)
    run_dir = Path(options.output_dir) / run_id
    run_dir.mkdir(parents=True, exist_ok=True)

    print(f"[orchestrator] run_id={run_id}")

    steps: list[StepResult] = []
    errors: list[str] = []
    warnings: list[str] = []

    if options.with_browser:
        warnings.append("Browser execution is not implemented in orchestrator v1.")
        print("[orchestrator] warning: Browser execution is not implemented in orchestrator v1.")

    strategy_cfg = None
    analysis_context_payload: dict[str, Any] | None = None
    analysis_payload: dict[str, Any] | None = None
    selection_payload: dict[str, Any] | None = None

    print("[orchestrator] loading strategy...")
    step_start = time.perf_counter()
    try:
        strategy_cfg = load_and_resolve_strategy(options.strategy_file)
        strategy_payload = load_strategy_as_dict(options.strategy_file)
        strategy_path = export_run_payload(run_dir, "strategy.json", strategy_payload)
        duration = round(time.perf_counter() - step_start, 3)
        steps.append(StepResult("strategy", "completed", duration, str(strategy_path)))
        print(f"[orchestrator] strategy status=completed duration={duration}s output={strategy_path}")
    except Exception as exc:  # noqa: BLE001
        duration = round(time.perf_counter() - step_start, 3)
        err = f"strategy step failed: {exc}"
        errors.append(err)
        steps.append(StepResult("strategy", "failed", duration, None))
        print(f"[orchestrator] strategy status=failed duration={duration}s output=None")

    if strategy_cfg is not None:
        print("[orchestrator] building analysis context...")
        step_start = time.perf_counter()
        try:
            if options.skip_context:
                source_path = Path("data/analysis_context/latest_analysis_context.json")
                analysis_context_payload = _load_json(source_path)
                context_path = export_run_payload(run_dir, "analysis_context.json", analysis_context_payload)
                warnings.append(f"Context step skipped: reused {source_path}.")
            else:
                analysis_context_payload = _build_analysis_context(strategy_cfg, options.target_date)
                context_path = export_run_payload(run_dir, "analysis_context.json", analysis_context_payload)
            duration = round(time.perf_counter() - step_start, 3)
            steps.append(StepResult("analysis_context", "completed", duration, str(context_path)))
            print(f"[orchestrator] analysis_context status=completed duration={duration}s output={context_path}")
        except Exception as exc:  # noqa: BLE001
            duration = round(time.perf_counter() - step_start, 3)
            err = f"analysis_context step failed: {exc}"
            errors.append(err)
            steps.append(StepResult("analysis_context", "failed", duration, None))
            print(f"[orchestrator] analysis_context status=failed duration={duration}s output=None")

    if strategy_cfg is not None and analysis_context_payload is not None:
        print("[orchestrator] analyzing matches...")
        step_start = time.perf_counter()
        try:
            if options.skip_analysis:
                source_path = Path("data/analysis_results/latest_match_analysis.json")
                analysis_payload = _load_json(source_path)
                analysis_path = export_run_payload(run_dir, "match_analysis.json", analysis_payload)
                warnings.append(f"Analysis step skipped: reused {source_path}.")
            else:
                api_key = os.getenv("OPENAI_API_KEY")
                model = os.getenv("OPENAI_ANALYSIS_MODEL")
                if not api_key:
                    raise RuntimeError("OPENAI_API_KEY manquant dans .env.")
                if not model:
                    raise RuntimeError("OPENAI_ANALYSIS_MODEL manquant dans .env.")

                run_context_path = run_dir / "analysis_context.json"
                from betauto.analysis_engine import run_analysis_batch_with_stats
                from openai import OpenAI

                client = OpenAI(api_key=api_key)
                client.analysis_model = model
                results, stats = run_analysis_batch_with_stats(
                    context_file=str(run_context_path),
                    llm=client,
                    max_matches=options.max_matches,
                    sleep_between_matches=options.sleep_between_matches,
                    continue_on_error=True,
                )
                analysis_payload = {
                    "generated_at": utc_now_iso(),
                    "context_file": str(run_context_path),
                    "model": model,
                    "stats": stats,
                    "results": results,
                }
                analysis_path = export_run_payload(run_dir, "match_analysis.json", analysis_payload)

            duration = round(time.perf_counter() - step_start, 3)
            steps.append(StepResult("analysis", "completed", duration, str(analysis_path)))
            print(f"[orchestrator] analysis status=completed duration={duration}s output={analysis_path}")
        except Exception as exc:  # noqa: BLE001
            duration = round(time.perf_counter() - step_start, 3)
            err = f"analysis step failed: {exc}"
            errors.append(err)
            steps.append(StepResult("analysis", "failed", duration, None))
            print(f"[orchestrator] analysis status=failed duration={duration}s output=None")

    if strategy_cfg is not None and not options.skip_selection:
        print("[orchestrator] selecting combo...")
        step_start = time.perf_counter()
        try:
            if analysis_payload is None:
                raise RuntimeError("Selection requires match analysis payload.")

            api_key = os.getenv("OPENAI_API_KEY")
            from betauto.selection_engine import (
                load_selection_config_from_env_and_cli,
                resolve_selection_model,
                select_combo,
            )
            model = resolve_selection_model(type("Args", (), {"model": None})())
            if not api_key:
                raise RuntimeError("OPENAI_API_KEY manquant dans .env.")
            if not model:
                raise RuntimeError("SELECTION_ENGINE_MODEL ou OPENAI_ANALYSIS_MODEL manquant.")

            from openai import OpenAI

            client = OpenAI(api_key=api_key)
            client.analysis_model = model

            adapter = _SelectionArgsAdapter(options.strategy_file)
            selection_config = load_selection_config_from_env_and_cli(adapter)
            selection_payload = select_combo(
                match_analyses=analysis_payload,
                config=selection_config,
                llm=client,
                input_file=str(run_dir / "match_analysis.json"),
            )
            selection_path = export_run_payload(run_dir, "selection.json", selection_payload)
            duration = round(time.perf_counter() - step_start, 3)
            steps.append(StepResult("selection", "completed", duration, str(selection_path)))
            print(f"[orchestrator] selection status=completed duration={duration}s output={selection_path}")
        except Exception as exc:  # noqa: BLE001
            duration = round(time.perf_counter() - step_start, 3)
            err = f"selection step failed: {exc}"
            errors.append(err)
            steps.append(StepResult("selection", "failed", duration, None))
            print(f"[orchestrator] selection status=failed duration={duration}s output=None")
    elif strategy_cfg is not None and options.skip_selection:
        steps.append(StepResult("selection", "skipped", 0.0, None))
        warnings.append("Selection step skipped (--skip-selection).")

    finished_at = utc_now_iso()
    if errors and any(step.status == "completed" for step in steps):
        status = "partial"
    elif errors:
        status = "failed"
    else:
        status = "completed"

    summary = OrchestratorRunSummary(
        run_id=run_id,
        started_at=started_at,
        finished_at=finished_at,
        status=status,
        target_date=options.target_date,
        strategy_id=strategy_cfg.strategy_id if strategy_cfg else "unknown",
        steps=steps,
        errors=errors,
        warnings=warnings,
    )

    summary_path = export_run_payload(run_dir, "run_summary.json", summary.to_dict())
    print(f"[orchestrator] run_summary status={status} duration=n/a output={summary_path}")
    print("[orchestrator] completed")

    return summary.to_dict(), run_dir
