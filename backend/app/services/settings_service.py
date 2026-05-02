from __future__ import annotations

import os
from typing import Any

from backend.app.api.schemas.settings import (
    IntegrationStatus,
    NotificationSettings,
    RiskSettings,
    RuntimeSettings,
    SelectionSettings,
    SettingsIntegrationsResponse,
    SettingsLogEntry,
    SettingsLogsResponse,
    SettingsMetadata,
    SettingsResponse,
    SettingsValidationResult,
    StrategySettings,
)
from backend.app.core.config import CORS_ORIGINS, env_flag
from backend.app.services.strategy_service import get_active_strategy_file
from betauto.strategy import load_and_resolve_strategy

DEFAULT_STRATEGY_FILE = "config/strategies/default.json"
SAFE_VALIDATION_KEYS = {
    "strategy_file",
    "max_matches",
    "sleep_between_matches",
    "min_confidence",
    "allowed_markets",
    "require_odds_available",
    "combo_min_odds",
    "combo_max_odds",
    "max_picks",
    "min_pick_confidence",
    "min_global_match_confidence",
}


def _env_flag(name: str, default: bool) -> bool:
    return env_flag(name, default)


def _strategy_file() -> str:
    return get_active_strategy_file() or os.getenv("BETAUTO_STRATEGY_FILE") or DEFAULT_STRATEGY_FILE


def _optional_int_env(name: str) -> int | None:
    value = os.getenv(name)
    if value in (None, ""):
        return None
    try:
        return int(value)
    except ValueError:
        return None


def _optional_float_env(name: str) -> float | None:
    value = os.getenv(name)
    if value in (None, ""):
        return None
    try:
        return float(value)
    except ValueError:
        return None


def _resolved_strategy():
    return load_and_resolve_strategy(_strategy_file())


def integrations_response() -> SettingsIntegrationsResponse:
    return SettingsIntegrationsResponse(integrations=_integrations())


def settings_response() -> SettingsResponse:
    strategy = _resolved_strategy()
    return SettingsResponse(
        strategy=StrategySettings(
            strategy_file=_strategy_file(),
            strategy_id=strategy.strategy_id,
            enabled=strategy.enabled,
            max_matches=_optional_int_env("BETAUTO_MAX_MATCHES"),
            sleep_between_matches=_optional_float_env("BETAUTO_SLEEP_BETWEEN_MATCHES"),
            min_confidence=strategy.min_pick_confidence,
            allowed_markets=strategy.allowed_markets,
            require_odds_available=strategy.require_odds_available,
            data_provider=strategy.data_provider,
            season=strategy.season,
        ),
        runtime=RuntimeSettings(
            orchestrator_enabled=_env_flag("ORCHESTRATOR_ENABLED", True),
            with_browser=_env_flag("ORCHESTRATOR_WITH_BROWSER", False),
            strict_mode=_env_flag("BETAUTO_STRICT_MODE", True),
            allow_legacy=_env_flag("BETAUTO_ALLOW_LEGACY", False),
            cors_origins=CORS_ORIGINS,
        ),
        selection=SelectionSettings(
            combo_min_odds=strategy.combo_min_odds,
            combo_max_odds=strategy.combo_max_odds,
            max_picks=strategy.max_picks,
            min_pick_confidence=strategy.min_pick_confidence,
            min_global_match_confidence=strategy.min_global_match_confidence,
            min_combo_confidence=strategy.min_combo_confidence,
        ),
        risk=RiskSettings(
            max_pick_risk=strategy.max_pick_risk,
            max_combo_risk=strategy.max_combo_risk,
            bankroll_enabled=strategy.bankroll_policy.enabled,
            staking_method=strategy.bankroll_policy.staking_method,
            max_stake_percent_per_ticket=strategy.bankroll_policy.max_stake_percent_per_ticket,
            daily_loss_limit_percent=strategy.bankroll_policy.daily_loss_limit_percent,
            weekly_loss_limit_percent=strategy.bankroll_policy.weekly_loss_limit_percent,
        ),
        integrations=_integrations(),
        notifications=NotificationSettings(
            email_alerts=None,
            critical_alerts_only=None,
            slack_webhook_configured=bool(os.getenv("SLACK_WEBHOOK_URL")),
        ),
        metadata=SettingsMetadata(),
    )


def validate_settings(payload: dict[str, Any]) -> SettingsValidationResult:
    settings = payload.get("settings") if isinstance(payload.get("settings"), dict) else payload
    if not isinstance(settings, dict):
        return SettingsValidationResult(status="invalid", errors=["Payload must be an object or contain a settings object."])

    errors: list[str] = []
    warnings: list[str] = []
    normalized: dict[str, Any] = {}

    unknown = sorted(set(settings) - SAFE_VALIDATION_KEYS)
    for key in unknown:
        warnings.append(f"{key} is read-only or unsupported and will not be applied.")

    for key in SAFE_VALIDATION_KEYS.intersection(settings):
        value = settings[key]
        if key in {"max_matches", "min_confidence", "max_picks", "min_pick_confidence", "min_global_match_confidence"}:
            try:
                normalized[key] = int(value)
            except (TypeError, ValueError):
                errors.append(f"{key} must be an integer.")
        elif key in {"sleep_between_matches", "combo_min_odds", "combo_max_odds"}:
            try:
                normalized[key] = float(value)
            except (TypeError, ValueError):
                errors.append(f"{key} must be a number.")
        elif key == "allowed_markets":
            if isinstance(value, list) and all(isinstance(item, str) for item in value):
                normalized[key] = value
            else:
                errors.append("allowed_markets must be a list of strings.")
        elif key == "require_odds_available":
            normalized[key] = bool(value)
        else:
            normalized[key] = value

    if "combo_min_odds" in normalized and "combo_max_odds" in normalized:
        if normalized["combo_min_odds"] > normalized["combo_max_odds"]:
            errors.append("combo_min_odds must be <= combo_max_odds.")

    if "min_confidence" in normalized and not 0 <= normalized["min_confidence"] <= 100:
        errors.append("min_confidence must be between 0 and 100.")

    return SettingsValidationResult(
        status="invalid" if errors else "valid",
        errors=errors,
        warnings=warnings or ["Settings writes are disabled; validation does not persist changes."],
        normalized=normalized,
    )


def logs_response() -> SettingsLogsResponse:
    return SettingsLogsResponse(
        logs=[
            SettingsLogEntry(message="Settings API is read-only in this pass."),
            SettingsLogEntry(message="POST /api/settings/validate performs validation only."),
            SettingsLogEntry(level="warning", message="PUT /api/settings returns 501 until a persistence contract exists."),
        ]
    )


def _integrations() -> list[IntegrationStatus]:
    return [
        IntegrationStatus(
            name="openai",
            status="configured" if os.getenv("OPENAI_API_KEY") else "missing",
            detail="OPENAI_API_KEY is present." if os.getenv("OPENAI_API_KEY") else "OPENAI_API_KEY is not configured.",
            source="environment",
        ),
        IntegrationStatus(
            name="api_football",
            status="configured" if os.getenv("API_FOOTBALL_KEY") or os.getenv("API_FOOTBALL_API_KEY") else "missing",
            detail="API-Football key is present."
            if os.getenv("API_FOOTBALL_KEY") or os.getenv("API_FOOTBALL_API_KEY")
            else "API-Football key is not configured.",
            source="environment",
        ),
        IntegrationStatus(
            name="browser_use",
            status="disabled" if not _env_flag("ORCHESTRATOR_WITH_BROWSER", False) else "requested",
            detail="Browser Use is not implemented in orchestrator API mode.",
            source="ORCHESTRATOR_WITH_BROWSER",
        ),
        IntegrationStatus(
            name="strict_mode",
            status="enabled" if _env_flag("BETAUTO_STRICT_MODE", True) else "disabled",
            detail="Strict run artifacts mode is enabled."
            if _env_flag("BETAUTO_STRICT_MODE", True)
            else "Strict mode is disabled.",
            source="BETAUTO_STRICT_MODE",
        ),
        IntegrationStatus(
            name="legacy_mode",
            status="enabled" if _env_flag("BETAUTO_ALLOW_LEGACY", False) else "disabled",
            detail="Legacy latest_* access is explicitly allowed."
            if _env_flag("BETAUTO_ALLOW_LEGACY", False)
            else "Legacy latest_* access is blocked.",
            source="BETAUTO_ALLOW_LEGACY",
        ),
    ]
