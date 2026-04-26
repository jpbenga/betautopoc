from __future__ import annotations

import json
import logging
import os
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from betauto.api_clients.openai_client import create_response_with_retry

from .models import SelectionConfig, SelectionResult

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parents[2]
PROMPT_PATH = BASE_DIR / "prompts" / "combo_selection_prompt.txt"


def _load_prompt() -> str:
    if not PROMPT_PATH.exists():
        raise FileNotFoundError(f"Prompt introuvable: {PROMPT_PATH}")
    return PROMPT_PATH.read_text(encoding="utf-8")


def _extract_json_from_text(text: str) -> dict[str, Any]:
    payload = (text or "").strip()
    if not payload:
        raise ValueError("Réponse LLM vide.")

    if payload.startswith("{") and payload.endswith("}"):
        return json.loads(payload)

    fenced = re.search(r"```(?:json)?\\s*(\{.*?\})\\s*```", payload, flags=re.DOTALL | re.IGNORECASE)
    if fenced:
        return json.loads(fenced.group(1))

    start = payload.find("{")
    end = payload.rfind("}")
    if start != -1 and end != -1 and end > start:
        return json.loads(payload[start : end + 1])

    raise ValueError("Aucun objet JSON détecté dans la réponse LLM.")


def _fallback_result(config: SelectionConfig, error: str) -> dict[str, Any]:
    return SelectionResult(
        generated_at=datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z"),
        status="failed",
        selection_config=config.model_dump(),
        input_file="",
        picks=[],
        estimated_combo_odds=None,
        combo_in_target_range=False,
        global_confidence_score=None,
        combo_risk_level=None,
        rejected_candidates=[],
        notes=["Aucune sélection exploitable générée."],
        errors=[error],
    ).model_dump()


def select_combo(match_analyses: dict, config: SelectionConfig, llm) -> dict:
    try:
        prompt_template = _load_prompt()
        analyses_json = json.dumps(match_analyses, ensure_ascii=False, indent=2)
        config_json = json.dumps(config.model_dump(), ensure_ascii=False, indent=2)
        prompt = (
            prompt_template.replace("{{SELECTION_CONFIG_JSON}}", config_json)
            .replace("{{MATCH_ANALYSES_JSON}}", analyses_json)
            .strip()
        )

        model_name = getattr(llm, "analysis_model", None) or os.getenv("SELECTION_ENGINE_MODEL") or os.getenv(
            "OPENAI_ANALYSIS_MODEL"
        )
        if not model_name:
            raise RuntimeError("Modèle OpenAI manquant (SELECTION_ENGINE_MODEL/OPENAI_ANALYSIS_MODEL ou --model).")

        response, _ = create_response_with_retry(
            llm,
            model=model_name,
            input=prompt,
            operation_name="openai.responses.create selection_engine",
            timeout=float(os.getenv("OPENAI_TIMEOUT_SECONDS", "120")),
        )

        parsed = _extract_json_from_text(response.output_text or "")
        parsed.setdefault("generated_at", datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z"))
        parsed.setdefault("selection_config", config.model_dump())
        validated = SelectionResult.model_validate(parsed)
        return validated.model_dump()
    except Exception as exc:  # noqa: BLE001
        logger.exception("Selection engine failed")
        return _fallback_result(config, str(exc))
