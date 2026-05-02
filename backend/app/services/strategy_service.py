from __future__ import annotations

import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from openai import OpenAI

from backend.app.api.schemas.strategy import (
    StrategyActivateResponse,
    StrategyApplyResponse,
    StrategyCatalogItem,
    StrategyCatalogResponse,
    StrategyDetailResponse,
    StrategySaveResponse,
)
from backend.app.core.paths import REPO_ROOT
from backend.app.services.job_service import get_job
from betauto.analysis_engine.aggregator import aggregate_candidates_from_file
from betauto.analysis_engine.filters import filter_candidates_from_file
from betauto.selection_engine import SelectionConfig, select_combo
from betauto.strategy import StrategyDefinition, resolve_strategy, validate_strategy

STRATEGIES_DIR = REPO_ROOT / "config" / "strategies"
ADMIN_DATA_DIR = REPO_ROOT / "data" / "admin"
STATE_PATH = ADMIN_DATA_DIR / "strategy_state.json"
DEFAULT_STRATEGY_FILE = "config/strategies/default.json"
ORCHESTRATOR_RUNS_DIR = REPO_ROOT / "data" / "orchestrator_runs"
STRATEGY_APPLICATIONS_INDEX = "strategy_applications.json"


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _relative_to_repo(path: Path) -> str:
    return path.resolve().relative_to(REPO_ROOT.resolve()).as_posix()


def _read_json(path: Path) -> dict[str, Any]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise ValueError(f"{path} must contain a JSON object.")
    return payload


def _write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def _read_json_or_empty(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    try:
        return _read_json(path)
    except Exception:  # noqa: BLE001
        return {}


def _read_state() -> dict[str, Any]:
    if not STATE_PATH.exists():
        return {}
    try:
        return _read_json(STATE_PATH)
    except Exception:  # noqa: BLE001
        return {}


def _write_state(active_strategy_file: str) -> None:
    _write_json(
        STATE_PATH,
        {
            "active_strategy_file": active_strategy_file,
            "updated_at": _utc_now_iso(),
            "source": "admin_strategy_api",
        },
    )


def _safe_strategy_path(strategy_file: str | None) -> Path:
    candidate = strategy_file or DEFAULT_STRATEGY_FILE
    raw_path = Path(candidate)
    path = raw_path if raw_path.is_absolute() else REPO_ROOT / raw_path
    resolved = path.resolve()
    try:
        resolved.relative_to(STRATEGIES_DIR.resolve())
    except ValueError as exc:
        raise ValueError("strategy_file must point inside config/strategies.") from exc
    if resolved.suffix.lower() != ".json":
        raise ValueError("strategy_file must be a JSON file.")
    return resolved


def _strategy_file_exists(strategy_file: str | None) -> bool:
    try:
        return _safe_strategy_path(strategy_file).exists()
    except ValueError:
        return False


def get_active_strategy_file() -> str:
    state_file = _read_state().get("active_strategy_file")
    if isinstance(state_file, str) and state_file.strip() and _strategy_file_exists(state_file):
        return _relative_to_repo(_safe_strategy_path(state_file))

    env_file = os.getenv("BETAUTO_STRATEGY_FILE")
    if env_file and _strategy_file_exists(env_file):
        return _relative_to_repo(_safe_strategy_path(env_file))

    return DEFAULT_STRATEGY_FILE


def _strategy_detail_from_path(path: Path, *, active_strategy_file: str | None = None) -> StrategyDetailResponse:
    active_file = active_strategy_file or get_active_strategy_file()
    strategy_file = _relative_to_repo(path)
    errors: list[str] = []
    warnings: list[str] = []
    resolved_payload: dict[str, Any] | None = None
    payload: dict[str, Any] = {}
    strategy_id: str | None = None
    name: str | None = None
    description: str | None = None

    try:
        payload = _read_json(path)
        strategy = StrategyDefinition.model_validate(payload)
        warnings = validate_strategy(strategy)
        resolved_payload = resolve_strategy(strategy).model_dump(mode="json")
        strategy_id = strategy.strategy_id
        name = strategy.name
        description = strategy.description
    except Exception as exc:  # noqa: BLE001
        errors.append(str(exc))
        strategy_id = str(payload.get("strategy_id") or path.stem) if isinstance(payload, dict) else path.stem
        name = str(payload.get("name") or path.stem) if isinstance(payload, dict) else path.stem
        description = str(payload.get("description") or "") if isinstance(payload, dict) else None

    return StrategyDetailResponse(
        strategy_file=strategy_file,
        strategy_id=strategy_id,
        name=name,
        description=description,
        active=strategy_file == active_file,
        valid=not errors,
        errors=errors,
        warnings=warnings,
        payload=payload,
        resolved=resolved_payload,
        state_file=_relative_to_repo(STATE_PATH),
    )


def strategy_detail(strategy_file: str | None = None) -> StrategyDetailResponse:
    path = _safe_strategy_path(strategy_file or get_active_strategy_file())
    if not path.exists():
        raise FileNotFoundError(f"Strategy file introuvable: {_relative_to_repo(path)}")
    return _strategy_detail_from_path(path)


def strategy_catalog() -> StrategyCatalogResponse:
    active_strategy_file = get_active_strategy_file()
    strategies: list[StrategyCatalogItem] = []
    for path in sorted(STRATEGIES_DIR.glob("*.json")):
        detail = _strategy_detail_from_path(path, active_strategy_file=active_strategy_file)
        strategies.append(
            StrategyCatalogItem(
                strategy_file=detail.strategy_file,
                strategy_id=detail.strategy_id,
                name=detail.name,
                description=detail.description,
                enabled=bool(detail.payload.get("enabled")) if isinstance(detail.payload, dict) else None,
                active=detail.active,
                valid=detail.valid,
                updated_at=datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc)
                .replace(microsecond=0)
                .isoformat()
                .replace("+00:00", "Z"),
                error=" | ".join(detail.errors) if detail.errors else None,
            )
        )

    active_detail = strategy_detail(active_strategy_file)
    return StrategyCatalogResponse(
        active_strategy_file=active_strategy_file,
        state_file=_relative_to_repo(STATE_PATH),
        strategies=strategies,
        active_strategy=active_detail,
    )


def activate_strategy(strategy_file: str) -> StrategyActivateResponse:
    detail = strategy_detail(strategy_file)
    if not detail.valid:
        raise ValueError("Impossible d'activer une stratégie invalide: " + " | ".join(detail.errors))
    _write_state(detail.strategy_file)
    active_detail = strategy_detail(detail.strategy_file)
    return StrategyActivateResponse(
        active_strategy_file=active_detail.strategy_file,
        active_strategy=active_detail,
    )


def _assert_safe_payload_filename(strategy_file: str, payload: dict[str, Any]) -> Path:
    path = _safe_strategy_path(strategy_file)
    strategy_id = str(payload.get("strategy_id") or path.stem)
    if not re.fullmatch(r"[A-Za-z0-9_.-]+", strategy_id):
        raise ValueError("strategy_id may contain only letters, numbers, dots, underscores and hyphens.")
    if not path.exists() and path.stem != strategy_id:
        raise ValueError("strategy_file filename must match payload.strategy_id.")
    return path


def save_strategy(strategy_file: str, payload: dict[str, Any], *, activate: bool = False) -> StrategySaveResponse:
    path = _assert_safe_payload_filename(strategy_file, payload)
    strategy = StrategyDefinition.model_validate(payload)
    resolve_strategy(strategy)
    _write_json(path, payload)
    if activate:
        _write_state(_relative_to_repo(path))
    detail = strategy_detail(_relative_to_repo(path))
    return StrategySaveResponse(
        strategy_file=detail.strategy_file,
        active_strategy_file=get_active_strategy_file(),
        strategy=detail,
    )


def _safe_run_dir(run_id: str) -> Path:
    if Path(run_id).name != run_id:
        raise ValueError("run_id must be a single run directory name.")

    run_dir = (ORCHESTRATOR_RUNS_DIR / run_id).resolve()
    try:
        run_dir.relative_to(ORCHESTRATOR_RUNS_DIR.resolve())
    except ValueError as exc:
        raise ValueError("run_id must point inside data/orchestrator_runs.") from exc
    if run_dir.exists() and run_dir.is_dir():
        return run_dir

    job = get_job(run_id)
    if job:
        raw_run_dir = job.get("orchestrator_run_dir")
        if raw_run_dir:
            candidate = Path(str(raw_run_dir))
            if not candidate.is_absolute():
                candidate = REPO_ROOT / candidate
            candidate = candidate.resolve()
            try:
                candidate.relative_to(ORCHESTRATOR_RUNS_DIR.resolve())
            except ValueError as exc:
                raise ValueError("orchestrator_run_dir must point inside data/orchestrator_runs.") from exc
            if candidate.exists() and candidate.is_dir():
                return candidate

        orchestrator_run_id = job.get("orchestrator_run_id")
        if orchestrator_run_id:
            candidate = (ORCHESTRATOR_RUNS_DIR / str(orchestrator_run_id)).resolve()
            if candidate.exists() and candidate.is_dir():
                return candidate

    prefix_matches = [
        path.resolve()
        for path in ORCHESTRATOR_RUNS_DIR.glob(f"{run_id}*")
        if path.is_dir()
    ]
    if len(prefix_matches) == 1:
        return prefix_matches[0]

    raise FileNotFoundError(f"Run introuvable: {run_id}")


def _selection_config_from_strategy(resolved_strategy: Any) -> SelectionConfig:
    return SelectionConfig(
        combo_min_odds=resolved_strategy.combo_min_odds if resolved_strategy.combo_min_odds is not None else 2.8,
        combo_max_odds=resolved_strategy.combo_max_odds if resolved_strategy.combo_max_odds is not None else 3.5,
        min_picks=resolved_strategy.min_picks,
        max_picks=resolved_strategy.max_picks,
        allow_single=resolved_strategy.allow_single,
        allow_combo=resolved_strategy.allow_combo,
        preferred_ticket_type=resolved_strategy.preferred_ticket_type,
        min_pick_confidence=resolved_strategy.min_pick_confidence,
        min_global_match_confidence=resolved_strategy.min_global_match_confidence,
    )


def _application_id(strategy_id: str | None) -> str:
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    safe_strategy_id = re.sub(r"[^A-Za-z0-9_.-]+", "_", strategy_id or "strategy")
    return f"{timestamp}_{safe_strategy_id}"


def _relative_files(paths: dict[str, Path]) -> dict[str, str]:
    return {key: _relative_to_repo(path) for key, path in paths.items()}


def _append_application_index(run_dir: Path, summary: dict[str, Any]) -> None:
    index_file = run_dir / STRATEGY_APPLICATIONS_INDEX
    index_payload = _read_json_or_empty(index_file)
    applications = index_payload.get("applications") if isinstance(index_payload.get("applications"), list) else []
    applications = [item for item in applications if not (isinstance(item, dict) and item.get("application_id") == summary.get("application_id"))]
    applications.insert(0, summary)
    _write_json(
        index_file,
        {
            "status": "available",
            "generated_at": _utc_now_iso(),
            "run_id": run_dir.name,
            "applications": applications,
        },
    )


def apply_strategy_to_run(
    *,
    run_id: str,
    strategy_file: str | None = None,
    selection_mode: str = "filter_and_select",
) -> StrategyApplyResponse:
    if selection_mode not in {"filter_only", "filter_and_select"}:
        raise ValueError("selection_mode must be filter_only or filter_and_select.")

    run_dir = _safe_run_dir(run_id)
    resolved_run_id = run_dir.name
    detail = strategy_detail(strategy_file or get_active_strategy_file())
    if not detail.valid:
        raise ValueError("Stratégie invalide: " + " | ".join(detail.errors))
    strategy = StrategyDefinition.model_validate(detail.payload)
    resolved = resolve_strategy(strategy)

    application_id = _application_id(strategy.strategy_id)
    application_dir = run_dir / "strategy_applications" / application_id
    application_dir.mkdir(parents=True, exist_ok=True)

    match_analysis_file = run_dir / "match_analysis.json"
    source_aggregation_file = run_dir / "aggregation_candidates.json"
    aggregation_file = application_dir / "aggregation_candidates.json"
    filtered_file = application_dir / "filtered_candidates.json"
    resolved_strategy_file = application_dir / "resolved_strategy.json"
    selection_file = application_dir / "selection.json"
    summary_file = application_dir / "application_summary.json"

    if not match_analysis_file.exists() and not source_aggregation_file.exists():
        raise FileNotFoundError("Run sans match_analysis.json ni aggregation_candidates.json exploitable.")

    _write_json(resolved_strategy_file, resolved.model_dump(mode="json"))
    if source_aggregation_file.exists():
        source_payload = _read_json(source_aggregation_file)
        _write_json(aggregation_file, source_payload)
        aggregation_payload = source_payload
    else:
        aggregation_payload = aggregate_candidates_from_file(match_analysis_file, aggregation_file)

    filtered_payload = filter_candidates_from_file(aggregation_file, filtered_file, resolved)

    selection_payload: dict[str, Any] = {
        "status": "skipped",
        "picks": [],
        "estimated_combo_odds": None,
        "errors": [],
        "notes": ["Selection LLM skipped; strategy application stopped after filtering."],
    }
    if selection_mode == "filter_and_select":
        api_key = os.getenv("OPENAI_API_KEY")
        model = os.getenv("SELECTION_ENGINE_MODEL") or os.getenv("OPENAI_ANALYSIS_MODEL")
        if not api_key or not model:
            selection_payload = {
                "status": "skipped",
                "picks": [],
                "estimated_combo_odds": None,
                "errors": ["OPENAI_API_KEY or selection model missing; filtering completed without final selection."],
                "notes": ["Configure OpenAI to run final ticket selection."],
            }
        else:
            llm = OpenAI(api_key=api_key)
            llm.analysis_model = model
            selection_payload = select_combo(
                match_analyses=filtered_payload,
                config=_selection_config_from_strategy(resolved),
                llm=llm,
                input_file=_relative_to_repo(filtered_file),
            )
    _write_json(selection_file, selection_payload)

    run_summary = _read_json_or_empty(run_dir / "run_summary.json")
    picks = selection_payload.get("picks") if isinstance(selection_payload.get("picks"), list) else []
    variants = selection_payload.get("variants") if isinstance(selection_payload.get("variants"), list) else []
    selection_errors = selection_payload.get("errors") if isinstance(selection_payload.get("errors"), list) else []
    selection_notes = selection_payload.get("notes") if isinstance(selection_payload.get("notes"), list) else []
    selection_status = str(selection_payload.get("status") or "unknown")
    application_status = "completed"
    if selection_errors or selection_status == "failed":
        application_status = "completed_with_errors"
    elif selection_status == "skipped":
        application_status = "completed_filter_only"
    summary = {
        "status": application_status,
        "application_id": application_id,
        "run_id": resolved_run_id,
        "target_date": run_summary.get("target_date") or aggregation_payload.get("target_date"),
        "strategy_file": detail.strategy_file,
        "strategy_id": strategy.strategy_id,
        "selection_mode": selection_mode,
        "source_run_dir": _relative_to_repo(run_dir),
        "application_dir": _relative_to_repo(application_dir),
        "files": _relative_files(
            {
                "resolved_strategy": resolved_strategy_file,
                "aggregation_candidates": aggregation_file,
                "filtered_candidates": filtered_file,
                "selection": selection_file,
                "application_summary": summary_file,
                "strategy_applications_index": run_dir / STRATEGY_APPLICATIONS_INDEX,
            }
        ),
        "aggregation_candidate_count": int(aggregation_payload.get("candidate_count", 0) or 0),
        "filtered_candidate_count": int(filtered_payload.get("candidate_count", 0) or 0),
        "rejected_candidate_count": int(filtered_payload.get("rejected_count", 0) or 0),
        "picks_count": len(picks),
        "variants_count": len(variants),
        "selected_variant_id": selection_payload.get("selected_variant_id"),
        "estimated_combo_odds": selection_payload.get("estimated_combo_odds"),
        "selection_status": selection_status,
        "selection_reason": selection_payload.get("selection_reason"),
        "notes": selection_notes,
        "errors": selection_errors,
        "generated_at": _utc_now_iso(),
    }
    _write_json(summary_file, summary)
    _append_application_index(run_dir, summary)
    return StrategyApplyResponse.model_validate(summary)
