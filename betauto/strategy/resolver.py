from __future__ import annotations

from .loader import load_strategy
from .models import ResolvedStrategyConfig, StrategyDefinition
from .validator import raise_if_strategy_invalid


def resolve_strategy(strategy: StrategyDefinition) -> ResolvedStrategyConfig:
    raise_if_strategy_invalid(strategy)

    enabled_leagues = [league for league in strategy.scope.leagues if league.enabled]
    target_odds = strategy.ticket_policy.target_odds
    data_policy = strategy.data_policy

    return ResolvedStrategyConfig(
        strategy_id=strategy.strategy_id,
        enabled=strategy.enabled,
        sports_allowed=strategy.scope.sports,
        league_ids_allowed=[league.id for league in enabled_leagues],
        allow_multi_sport=strategy.scope.allow_multi_sport,
        allow_multi_league=strategy.scope.allow_multi_league,
        allow_single=strategy.ticket_policy.allow_single,
        allow_combo=strategy.ticket_policy.allow_combo,
        preferred_ticket_type=strategy.ticket_policy.preferred_ticket_type,
        combo_min_odds=target_odds.min if target_odds.enabled else None,
        combo_max_odds=target_odds.max if target_odds.enabled else None,
        min_picks=strategy.ticket_policy.min_picks,
        max_picks=strategy.ticket_policy.max_picks,
        min_pick_confidence=strategy.confidence_policy.min_pick_confidence,
        min_global_match_confidence=strategy.confidence_policy.min_match_analysis_confidence,
        min_combo_confidence=strategy.confidence_policy.min_combo_confidence,
        market_mode=strategy.market_policy.mode,
        allowed_markets=strategy.market_policy.allowed_markets,
        excluded_markets=strategy.market_policy.excluded_markets,
        max_pick_risk=strategy.risk_policy.max_pick_risk,
        max_combo_risk=strategy.risk_policy.max_combo_risk,
        use_api_football=strategy.analysis_policy.use_api_football,
        use_qualitative_context=strategy.analysis_policy.use_qualitative_context,
        require_odds_available=strategy.analysis_policy.require_odds_available,
        avoid_insufficient_data=strategy.analysis_policy.avoid_insufficient_data,
        min_data_quality=strategy.analysis_policy.min_data_quality,
        data_provider=data_policy.provider,
        season=data_policy.season,
        bookmaker_id=data_policy.odds_source.bookmaker_id,
        bookmaker_name=data_policy.odds_source.bookmaker_name,
        use_cache=data_policy.refresh_policy.use_cache,
        force_refresh=data_policy.refresh_policy.force_refresh,
        execution_platform=strategy.execution_policy.platform,
        prepare_betslip=strategy.execution_policy.prepare_betslip,
        requires_human_validation=strategy.execution_policy.requires_human_validation,
        allow_real_bet_submission=strategy.execution_policy.allow_real_bet_submission,
        bankroll_policy=strategy.bankroll_policy,
    )


def load_and_resolve_strategy(path: str | None = None) -> ResolvedStrategyConfig:
    strategy = load_strategy(path)
    return resolve_strategy(strategy)
