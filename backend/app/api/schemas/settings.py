from __future__ import annotations

from typing import Any

from pydantic import Field

from backend.app.api.schemas.common import ContractBaseModel


class SettingsValue(ContractBaseModel):
    key: str
    value: Any = None
    source: str
    read_only: bool = True
    description: str | None = None


class StrategySettings(ContractBaseModel):
    strategy_file: str
    strategy_id: str | None = None
    enabled: bool | None = None
    max_matches: int | None = None
    sleep_between_matches: float | None = None
    min_confidence: int | None = None
    allowed_markets: list[str] = Field(default_factory=list)
    require_odds_available: bool | None = None
    data_provider: str | None = None
    season: int | None = None
    read_only: bool = True


class RuntimeSettings(ContractBaseModel):
    orchestrator_enabled: bool
    with_browser: bool
    strict_mode: bool
    allow_legacy: bool
    cors_origins: list[str] = Field(default_factory=list)
    read_only: bool = True


class SelectionSettings(ContractBaseModel):
    combo_min_odds: float | None = None
    combo_max_odds: float | None = None
    max_picks: int | None = None
    min_pick_confidence: int | None = None
    min_global_match_confidence: int | None = None
    min_combo_confidence: int | None = None
    read_only: bool = True


class RiskSettings(ContractBaseModel):
    max_pick_risk: str | None = None
    max_combo_risk: str | None = None
    bankroll_enabled: bool | None = None
    staking_method: str | None = None
    max_stake_percent_per_ticket: float | None = None
    daily_loss_limit_percent: float | None = None
    weekly_loss_limit_percent: float | None = None
    read_only: bool = True


class IntegrationStatus(ContractBaseModel):
    name: str
    status: str
    detail: str
    source: str
    read_only: bool = True


class NotificationSettings(ContractBaseModel):
    status: str = "placeholder"
    email_alerts: bool | None = None
    critical_alerts_only: bool | None = None
    slack_webhook_configured: bool | None = None
    read_only: bool = True


class SettingsMetadata(ContractBaseModel):
    status: str = "available"
    mode: str = "read_only"
    writable: bool = False
    message: str = "Settings are exposed read-only. PUT /api/settings is not enabled yet."


class SettingsResponse(ContractBaseModel):
    status: str = "available"
    strategy: StrategySettings
    runtime: RuntimeSettings
    selection: SelectionSettings
    risk: RiskSettings
    integrations: list[IntegrationStatus] = Field(default_factory=list)
    notifications: NotificationSettings
    metadata: SettingsMetadata


class SettingsIntegrationsResponse(ContractBaseModel):
    status: str = "available"
    integrations: list[IntegrationStatus] = Field(default_factory=list)


class SettingsValidationRequest(ContractBaseModel):
    settings: dict[str, Any] = Field(default_factory=dict)


class SettingsValidationResult(ContractBaseModel):
    status: str = "valid"
    errors: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    normalized: dict[str, Any] = Field(default_factory=dict)
    writable: bool = False
    message: str = "Validation only. Applying settings is disabled in this pass."


class SettingsUpdateRequest(ContractBaseModel):
    settings: dict[str, Any] = Field(default_factory=dict)


class SettingsLogEntry(ContractBaseModel):
    at: str | None = None
    level: str = "info"
    message: str
    source: str = "settings_service"


class SettingsLogsResponse(ContractBaseModel):
    status: str = "placeholder"
    logs: list[SettingsLogEntry] = Field(default_factory=list)
