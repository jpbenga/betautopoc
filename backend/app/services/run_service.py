from __future__ import annotations

import asyncio
import json
import logging
import os
import re
from pathlib import Path
from typing import Any

from fastapi import HTTPException
from openai import OpenAI

from backend.app.api.schemas.run_schemas import PicksPayload, VerificationOutput
from backend.app.core.config import env_flag
from backend.app.core.paths import GENERATED_DIR, PROMPTS_DIR, RUNS_DIR
from backend.app.services.job_service import (
    JOBS,
    get_target_date,
    is_stop_requested,
    log,
    now_iso,
    set_error,
    set_step,
)
from backend.app.services.strategy_service import get_active_strategy_file
from betauto.market_dictionary.resolver import resolve_pick_market_aliases
from betauto.orchestrator import run_orchestrated_pipeline


class JobLogHandler(logging.Handler):
    def __init__(self, job_id: str) -> None:
        super().__init__(level=logging.INFO)
        self.job_id = job_id

    def emit(self, record: logging.LogRecord) -> None:
        if not record.name.startswith("betauto"):
            return
        if record.name.startswith("betauto.analysis_context.api_football_client") and record.levelno < logging.WARNING:
            return
        try:
            message = self.format(record)
            if not message:
                return
            level = "error" if record.levelno >= logging.ERROR else "warning" if record.levelno >= logging.WARNING else "info"
            log(self.job_id, message, level=level)
        except Exception:  # noqa: BLE001
            return


def get_cache_path(target_date: str) -> Path:
    return GENERATED_DIR / f"picks_{target_date}.json"


def get_run_dir(job_id: str) -> Path:
    path = RUNS_DIR / job_id
    path.mkdir(parents=True, exist_ok=True)
    return path


def save_json(path: Path, data: Any) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def load_master_prompt(target_date: str) -> str:
    prompt_path = PROMPTS_DIR / "master_prompt.txt"
    if not prompt_path.exists():
        raise RuntimeError("Fichier prompts/master_prompt.txt introuvable.")
    prompt = prompt_path.read_text(encoding="utf-8")
    return prompt.replace("{{TARGET_DATE}}", target_date)


def extract_json_from_text(text: str) -> dict[str, Any]:
    text = (text or "").strip()
    if not text:
        raise ValueError("Réponse vide.")
    if text.startswith("{") and text.endswith("}"):
        return json.loads(text)

    fenced = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, flags=re.DOTALL | re.IGNORECASE)
    if fenced:
        return json.loads(fenced.group(1))

    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        return json.loads(text[start : end + 1])

    raise ValueError("Aucun JSON valide trouvé dans la réponse.")


def load_cached_picks(target_date: str) -> dict[str, Any] | None:
    path = get_cache_path(target_date)
    if not path.exists():
        return None
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        payload = PicksPayload.model_validate(data)
    except Exception:
        return None
    if payload.target_date != target_date:
        return None
    return payload.model_dump()


def save_cached_picks(target_date: str, picks: dict[str, Any]) -> None:
    save_json(get_cache_path(target_date), picks)


def enrich_picks_with_market_dictionary(picks_payload: dict[str, Any]) -> dict[str, Any]:
    enriched_payload = dict(picks_payload)
    raw_picks = picks_payload.get("picks", [])
    enriched_payload["picks"] = [resolve_pick_market_aliases(p) if isinstance(p, dict) else p for p in raw_picks]
    return enriched_payload


def generate_picks_with_openai(job_id: str, target_date: str) -> dict[str, Any]:
    api_key = os.getenv("OPENAI_API_KEY")
    model = os.getenv("OPENAI_ANALYSIS_MODEL")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY manquant dans .env.")
    if not model:
        raise RuntimeError("OPENAI_ANALYSIS_MODEL manquant dans .env.")

    prompt = load_master_prompt(target_date)
    run_path = get_run_dir(job_id)
    (run_path / "prompt_used.txt").write_text(prompt, encoding="utf-8")

    client = OpenAI(api_key=api_key)
    response = client.responses.create(model=model, tools=[{"type": "web_search"}], input=prompt)
    raw = response.output_text or ""
    (run_path / "gpt_raw_output.txt").write_text(raw, encoding="utf-8")

    data = extract_json_from_text(raw)
    payload = PicksPayload.model_validate(data)
    if payload.target_date != target_date:
        raise RuntimeError(f"Date JSON incorrecte : reçu {payload.target_date}, attendu {target_date}.")
    return payload.model_dump()


def build_unibet_task(picks: dict[str, Any]) -> str:
    prompt_path = PROMPTS_DIR / "browser_use_unibet_prompt.txt"
    if not prompt_path.exists():
        raise RuntimeError("Fichier prompts/browser_use_unibet_prompt.txt introuvable.")
    prompt_template = prompt_path.read_text(encoding="utf-8")
    picks_json = json.dumps(picks, ensure_ascii=False, indent=2)
    return prompt_template.replace("{{PICKS_JSON}}", picks_json)


async def verify_unibet_with_browser_use(job_id: str, picks: dict[str, Any]) -> dict[str, Any]:
    from browser_use import Agent, ChatOpenAI

    api_key = os.getenv("OPENAI_API_KEY")
    model = os.getenv("OPENAI_BROWSER_MODEL")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY manquant dans .env.")
    if not model:
        raise RuntimeError("OPENAI_BROWSER_MODEL manquant dans .env.")

    llm = ChatOpenAI(model=model, api_key=api_key, temperature=0)
    agent = Agent(
        task=build_unibet_task(picks),
        llm=llm,
        output_model_schema=VerificationOutput,
        max_steps=int(os.getenv("BROWSER_USE_MAX_STEPS", "30")),
        use_vision=True,
    )

    timeout_seconds = int(os.getenv("BROWSER_USE_TIMEOUT_SECONDS", "90"))
    try:
        history = await asyncio.wait_for(agent.run(), timeout=timeout_seconds)
    except asyncio.TimeoutError:
        raise RuntimeError(f"Timeout Browser Use après {timeout_seconds} secondes.")

    structured = getattr(history, "structured_output", None)
    if structured is None:
        final = history.final_result() if hasattr(history, "final_result") else str(history)
        (get_run_dir(job_id) / "browser_raw_output.txt").write_text(str(final), encoding="utf-8")
        data = extract_json_from_text(str(final))
        payload = VerificationOutput.model_validate(data)
    else:
        payload = structured

    result = payload.model_dump()
    save_json(get_run_dir(job_id) / "unibet_verification.json", result)
    return result


async def run_legacy_pipeline(job_id: str, force_regenerate: bool, target_date: str | None = None) -> None:
    try:
        target = target_date or get_target_date()
        JOBS[job_id]["target_date"] = target
        log(job_id, f"Process lancé. Date cible : {target}")

        set_step(job_id, "cache", "running", "Vérification du cache JSON.")
        cached = None if force_regenerate else load_cached_picks(target)

        if cached:
            set_step(job_id, "cache", "done", "Cache valide trouvé. Appel GPT ignoré.")
            set_step(job_id, "analysis", "skipped", "Analyse GPT non relancée.")
            picks = cached
        else:
            set_step(job_id, "cache", "done", "Aucun cache valide trouvé.")
            set_step(job_id, "analysis", "running", "Analyse GPT avec recherche web en cours.")
            picks = await asyncio.to_thread(generate_picks_with_openai, job_id, target)
            save_cached_picks(target, picks)
            save_json(get_run_dir(job_id) / "picks.json", picks)
            set_step(job_id, "analysis", "done", "Analyse GPT terminée. JSON généré et sauvegardé.")

        picks = enrich_picks_with_market_dictionary(picks)
        JOBS[job_id]["picks"] = picks
        save_json(get_run_dir(job_id) / "picks.json", picks)

        if not picks.get("picks"):
            set_step(job_id, "unibet", "skipped", "Aucun pick généré. Vérification Unibet ignorée.")
            JOBS[job_id]["status"] = "completed"
            JOBS[job_id]["completed_at"] = now_iso()
            log(job_id, "Process terminé sans vérification Unibet.")
            return

        set_step(job_id, "unibet", "running", "Browser Use vérifie les rencontres et cotes sur Unibet.")
        verification = await verify_unibet_with_browser_use(job_id, picks)
        JOBS[job_id]["verification"] = verification
        set_step(job_id, "unibet", "done", "Vérification Unibet terminée.")
        JOBS[job_id]["status"] = "completed"
        JOBS[job_id]["completed_at"] = now_iso()
        log(job_id, "Process terminé.")
    except Exception as exc:
        set_error(job_id, str(exc))


async def run_orchestrated_pipeline_job(
    job_id: str,
    date: str,
    strategy_file: str | None = None,
    max_matches: int | None = None,
    sleep_between_matches: float | None = None,
    with_browser: bool = False,
) -> None:
    try:
        JOBS[job_id]["target_date"] = date
        set_step(job_id, "cache", "skipped", "Mode orchestré actif: cache legacy ignoré.")
        set_step(job_id, "analysis", "running", "Lancement de l'orchestrateur V1.")
        set_step(job_id, "unibet", "skipped", "Browser Use non branché en mode orchestré API.")

        def on_log(message: str) -> None:
            log(job_id, message)

        def on_run_metadata(metadata: dict[str, Any]) -> None:
            JOBS[job_id]["orchestrator_run_id"] = metadata.get("run_id")
            JOBS[job_id]["orchestrator_run_dir"] = metadata.get("run_dir")

        def should_stop() -> bool:
            return is_stop_requested(job_id)

        job_log_handler = JobLogHandler(job_id)
        job_log_handler.setFormatter(logging.Formatter("%(message)s"))
        betauto_logger = logging.getLogger("betauto")
        previous_level = betauto_logger.level
        betauto_logger.addHandler(job_log_handler)
        if betauto_logger.level > logging.INFO or betauto_logger.level == logging.NOTSET:
            betauto_logger.setLevel(logging.INFO)
        try:
            run_summary = await asyncio.to_thread(
                run_orchestrated_pipeline,
                target_date=date,
                strategy_file=strategy_file,
                max_matches=max_matches,
                sleep_between_matches=sleep_between_matches,
                with_browser=with_browser,
                log_callback=on_log,
                run_metadata_callback=on_run_metadata,
                stop_requested=should_stop,
            )
        finally:
            betauto_logger.removeHandler(job_log_handler)
            betauto_logger.setLevel(previous_level)
        run_status = str(run_summary.get("status") or "completed")

        selection_file = run_summary.get("files", {}).get("selection")
        selection_payload: dict[str, Any] | None = None
        if selection_file and Path(selection_file).exists():
            selection_payload = json.loads(Path(selection_file).read_text(encoding="utf-8"))
        elif isinstance(run_summary.get("selection"), dict):
            selection_payload = run_summary.get("selection")

        JOBS[job_id]["orchestrator_run_id"] = run_summary.get("run_id")
        JOBS[job_id]["orchestrator_run_dir"] = run_summary.get("run_dir")
        JOBS[job_id]["run_summary"] = run_summary
        JOBS[job_id]["selection_file"] = selection_file
        JOBS[job_id]["selection"] = selection_payload
        JOBS[job_id]["picks"] = (selection_payload or {}).get("picks")

        if run_status == "stopped":
            message = str(run_summary.get("message") or "Analysis stopped by user.")
            set_step(job_id, "analysis", "stopped", message)
            JOBS[job_id]["status"] = "stopped"
            log(job_id, "[analysis] run stopped cleanly", level="warning")
        elif run_status == "completed_no_data":
            message = str(run_summary.get("message") or f"No matches found for target date {date}")
            set_step(job_id, "analysis", "skipped", message)
            JOBS[job_id]["status"] = "completed_no_data"
            log(job_id, message)
        else:
            set_step(job_id, "analysis", "done", "Orchestrateur V1 terminé.")
            JOBS[job_id]["status"] = run_status
        JOBS[job_id]["completed_at"] = now_iso()
    except Exception as exc:
        set_error(job_id, str(exc))


def queue_job_run(job_id: str, data: dict[str, Any], background_tasks: Any, requested_date: str) -> None:
    force_regenerate = bool(data.get("force", False))
    strategy_file = data.get("strategy_file") or get_active_strategy_file()
    max_matches = data.get("max_matches")
    sleep_between_matches = data.get("sleep_between_matches")

    if env_flag("ORCHESTRATOR_ENABLED", True):
        with_browser = bool(data.get("with_browser", env_flag("ORCHESTRATOR_WITH_BROWSER", False)))
        background_tasks.add_task(
            run_orchestrated_pipeline_job,
            job_id,
            requested_date,
            strategy_file,
            max_matches,
            sleep_between_matches,
            with_browser,
        )
    else:
        if run_legacy_pipeline is None:
            raise HTTPException(status_code=503, detail="Legacy pipeline disabled or unavailable.")
        background_tasks.add_task(run_legacy_pipeline, job_id, force_regenerate, requested_date)


def clear_generated_cache() -> int:
    removed = 0
    for file in GENERATED_DIR.glob("picks_*.json"):
        file.unlink()
        removed += 1
    return removed
