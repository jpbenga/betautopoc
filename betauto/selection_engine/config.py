from __future__ import annotations

import os
from argparse import Namespace

from betauto.strategy import ResolvedStrategyConfig, load_and_resolve_strategy

from .models import SelectionConfig

DEFAULT_COMBO_MIN_ODDS = 2.80
DEFAULT_COMBO_MAX_ODDS = 3.50
DEFAULT_MAX_PICKS = 5
DEFAULT_MIN_PICK_CONFIDENCE = 65
DEFAULT_MIN_GLOBAL_MATCH_CONFIDENCE = 65


def _pick_env_value(env_name: str, cast: type) -> object | None:
    env_value = os.getenv(env_name)
    if env_value is None or env_value == "":
        return None
    return cast(env_value)


def _resolve_business_value(
    *,
    cli_value: object,
    strategy_value: object,
    env_name: str,
    default: object,
    cast: type,
) -> object:
    if cli_value is not None:
        return cast(cli_value)
    if strategy_value is not None:
        return cast(strategy_value)

    env_value = _pick_env_value(env_name, cast)
    if env_value is not None:
        return env_value

    return default


def resolve_selection_model(args: Namespace) -> str | None:
    return args.model or os.getenv("SELECTION_ENGINE_MODEL") or os.getenv("OPENAI_ANALYSIS_MODEL")


def resolve_output_dir(args: Namespace) -> str:
    return args.output_dir or os.getenv("SELECTION_OUTPUT_DIR") or "data/selection_results"


def resolve_strategy_config(args: Namespace) -> ResolvedStrategyConfig:
    return load_and_resolve_strategy(getattr(args, "strategy_file", None))


def load_selection_config_from_env_and_cli(args: Namespace) -> SelectionConfig:
    resolved_strategy = resolve_strategy_config(args)

    config = SelectionConfig(
        combo_min_odds=_resolve_business_value(
            cli_value=args.combo_min_odds,
            strategy_value=resolved_strategy.combo_min_odds,
            env_name="COMBO_MIN_ODDS",
            default=DEFAULT_COMBO_MIN_ODDS,
            cast=float,
        ),
        combo_max_odds=_resolve_business_value(
            cli_value=args.combo_max_odds,
            strategy_value=resolved_strategy.combo_max_odds,
            env_name="COMBO_MAX_ODDS",
            default=DEFAULT_COMBO_MAX_ODDS,
            cast=float,
        ),
        max_picks=_resolve_business_value(
            cli_value=args.max_picks,
            strategy_value=resolved_strategy.max_picks,
            env_name="MAX_PICKS",
            default=DEFAULT_MAX_PICKS,
            cast=int,
        ),
        min_pick_confidence=_resolve_business_value(
            cli_value=args.min_pick_confidence,
            strategy_value=resolved_strategy.min_pick_confidence,
            env_name="MIN_PICK_CONFIDENCE",
            default=DEFAULT_MIN_PICK_CONFIDENCE,
            cast=int,
        ),
        min_global_match_confidence=_resolve_business_value(
            cli_value=args.min_global_match_confidence,
            strategy_value=resolved_strategy.min_global_match_confidence,
            env_name="MIN_GLOBAL_MATCH_CONFIDENCE",
            default=DEFAULT_MIN_GLOBAL_MATCH_CONFIDENCE,
            cast=int,
        ),
    )

    if config.combo_max_odds <= config.combo_min_odds:
        raise ValueError("combo_max_odds doit être strictement supérieur à combo_min_odds.")

    return config
