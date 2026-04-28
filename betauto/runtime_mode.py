from __future__ import annotations

import logging
import os
from pathlib import Path

logger = logging.getLogger(__name__)

FORBIDDEN_LATEST_FILES = {
    "latest_analysis_context.json",
    "latest_match_analysis.json",
    "latest_selection.json",
}


def _env_flag(name: str, default: bool) -> bool:
    raw_value = os.getenv(name)
    if raw_value is None:
        return default
    return raw_value.strip().lower() not in {"0", "false", "no", "off"}


def strict_mode_enabled() -> bool:
    return _env_flag("BETAUTO_STRICT_MODE", True)


def legacy_mode_enabled() -> bool:
    return _env_flag("BETAUTO_ALLOW_LEGACY", False)


def log_runtime_mode() -> None:
    if legacy_mode_enabled():
        logger.warning("LEGACY MODE ENABLED - latest_* artifacts are allowed for explicit legacy execution.")
        return
    if strict_mode_enabled():
        logger.info("STRICT MODE ENABLED - latest_* artifacts are forbidden.")


def is_forbidden_latest_path(path: str | Path) -> bool:
    return Path(path).name in FORBIDDEN_LATEST_FILES


def ensure_latest_allowed(path: str | Path) -> None:
    if not is_forbidden_latest_path(path):
        return

    if legacy_mode_enabled():
        logger.warning("LEGACY MODE ENABLED - allowing latest_* artifact: %s", path)
        return

    message = f"FORBIDDEN latest_* usage blocked: {path}"
    logger.error(message)
    raise RuntimeError(message)


def require_legacy_mode(reason: str) -> None:
    if legacy_mode_enabled():
        logger.warning("LEGACY MODE ENABLED - %s", reason)
        return

    if strict_mode_enabled():
        message = (
            "STRICT MODE ENABLED - legacy script execution is blocked. "
            f"{reason}. Use scripts/run_orchestrated_pipeline.py so every run uses its own run_dir artifacts."
        )
        logger.error(message)
        raise RuntimeError(message)
