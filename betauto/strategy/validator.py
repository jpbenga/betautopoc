from __future__ import annotations

from .models import RiskLevel, StrategyDefinition

RISK_ORDER: dict[RiskLevel, int] = {"low": 1, "medium": 2, "high": 3}


def _collect_issues(strategy: StrategyDefinition) -> tuple[list[str], list[str]]:
    warnings: list[str] = []
    errors: list[str] = []

    if not strategy.enabled:
        warnings.append("La stratégie est désactivée (enabled=false).")

    if not strategy.scope.sports:
        errors.append("Au moins un sport doit être défini dans scope.sports.")

    enabled_leagues = [league for league in strategy.scope.leagues if league.enabled]
    if not enabled_leagues:
        errors.append("Au moins une ligue active (enabled=true) est requise dans scope.leagues.")

    if strategy.ticket_policy.allow_combo:
        if strategy.ticket_policy.min_picks < 2:
            errors.append("ticket_policy.min_picks doit être >= 2 quand allow_combo=true.")
        if strategy.ticket_policy.max_picks < strategy.ticket_policy.min_picks:
            errors.append("ticket_policy.max_picks doit être >= ticket_policy.min_picks.")

    target_odds = strategy.ticket_policy.target_odds
    if target_odds.enabled:
        if target_odds.min is None or target_odds.max is None:
            errors.append("ticket_policy.target_odds.min et max sont requis quand target_odds.enabled=true.")
        else:
            if target_odds.max <= target_odds.min:
                errors.append("ticket_policy.target_odds.max doit être > min.")
            if target_odds.min <= 1:
                errors.append("ticket_policy.target_odds.min doit être > 1.")

    if strategy.market_policy.mode == "allowlist" and not strategy.market_policy.allowed_markets:
        errors.append("market_policy.allowed_markets ne peut pas être vide en mode allowlist.")

    if RISK_ORDER[strategy.risk_policy.max_combo_risk] < RISK_ORDER[strategy.risk_policy.max_pick_risk]:
        warnings.append(
            "max_combo_risk est plus strict que max_pick_risk; vérifier la cohérence de la politique de risque."
        )

    return warnings, errors


def validate_strategy(strategy: StrategyDefinition) -> list[str]:
    warnings, _ = _collect_issues(strategy)
    return warnings


def raise_if_strategy_invalid(strategy: StrategyDefinition) -> None:
    _, errors = _collect_issues(strategy)
    if errors:
        raise ValueError("Stratégie invalide: " + " | ".join(errors))
