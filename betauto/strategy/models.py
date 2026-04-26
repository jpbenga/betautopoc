from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, model_validator


RiskLevel = Literal["low", "medium", "high"]
DataQuality = Literal["low", "medium", "high"]
TicketType = Literal["single", "combo", "mixed"]
MarketMode = Literal["allowlist", "blocklist", "all"]
StakingMethod = Literal["flat", "percentage", "kelly_fractional", "manual"]


class LeagueScope(BaseModel):
    id: int
    name: str
    country: str | None = None
    enabled: bool = True


class StrategyScope(BaseModel):
    sports: list[str] = Field(default_factory=list)
    leagues: list[LeagueScope] = Field(default_factory=list)
    allow_multi_sport: bool = False
    allow_multi_league: bool = True


class TargetOddsPolicy(BaseModel):
    enabled: bool = True
    min: float | None = None
    max: float | None = None


class TicketPolicy(BaseModel):
    allow_single: bool = True
    allow_combo: bool = True
    preferred_ticket_type: TicketType = "combo"
    min_picks: int = Field(default=2, ge=1)
    max_picks: int = Field(default=5, ge=1)
    target_odds: TargetOddsPolicy = Field(default_factory=TargetOddsPolicy)


class MarketPolicy(BaseModel):
    mode: MarketMode = "allowlist"
    allowed_markets: list[str] = Field(default_factory=list)
    excluded_markets: list[str] = Field(default_factory=list)
    allow_exotic_markets: bool = False


class ConfidencePolicy(BaseModel):
    min_match_analysis_confidence: int = Field(default=65, ge=0, le=100)
    min_pick_confidence: int = Field(default=65, ge=0, le=100)
    min_combo_confidence: int | None = Field(default=65, ge=0, le=100)


class RiskPolicy(BaseModel):
    risk_appetite: RiskLevel = "medium"
    max_pick_risk: RiskLevel = "medium"
    max_combo_risk: RiskLevel = "medium"


class AnalysisPolicy(BaseModel):
    one_prompt_per_match: bool = True
    use_api_football: bool = True
    use_qualitative_context: bool = True
    require_odds_available: bool = True
    avoid_insufficient_data: bool = True
    min_data_quality: DataQuality = "medium"


class ExecutionPolicy(BaseModel):
    platform: str = "unibet"
    prepare_betslip: bool = True
    requires_human_validation: bool = True
    allow_real_bet_submission: bool = False


class BankrollPolicy(BaseModel):
    enabled: bool = False
    staking_method: StakingMethod = "manual"
    max_stake_percent_per_ticket: float | None = Field(default=None, ge=0, le=100)
    daily_loss_limit_percent: float | None = Field(default=None, ge=0, le=100)
    weekly_loss_limit_percent: float | None = Field(default=None, ge=0, le=100)


class StrategyDefinition(BaseModel):
    strategy_id: str
    name: str
    description: str | None = None
    enabled: bool = True
    scope: StrategyScope
    ticket_policy: TicketPolicy
    market_policy: MarketPolicy
    confidence_policy: ConfidencePolicy
    risk_policy: RiskPolicy
    analysis_policy: AnalysisPolicy
    execution_policy: ExecutionPolicy
    bankroll_policy: BankrollPolicy = Field(default_factory=BankrollPolicy)

    @model_validator(mode="after")
    def _validate_ticket_policy_consistency(self) -> "StrategyDefinition":
        if self.ticket_policy.max_picks < self.ticket_policy.min_picks:
            msg = "ticket_policy.max_picks doit être >= ticket_policy.min_picks"
            raise ValueError(msg)
        return self


class ResolvedStrategyConfig(BaseModel):
    strategy_id: str
    enabled: bool
    sports_allowed: list[str] = Field(default_factory=list)
    league_ids_allowed: list[int] = Field(default_factory=list)
    allow_multi_sport: bool
    allow_multi_league: bool
    allow_single: bool
    allow_combo: bool
    preferred_ticket_type: TicketType
    combo_min_odds: float | None = None
    combo_max_odds: float | None = None
    min_picks: int
    max_picks: int
    min_pick_confidence: int
    min_global_match_confidence: int
    min_combo_confidence: int | None = None
    market_mode: MarketMode
    allowed_markets: list[str] = Field(default_factory=list)
    excluded_markets: list[str] = Field(default_factory=list)
    max_pick_risk: RiskLevel
    max_combo_risk: RiskLevel
    use_api_football: bool
    use_qualitative_context: bool
    require_odds_available: bool
    avoid_insufficient_data: bool
    min_data_quality: DataQuality
    execution_platform: str
    prepare_betslip: bool
    requires_human_validation: bool
    allow_real_bet_submission: bool
    bankroll_policy: BankrollPolicy
