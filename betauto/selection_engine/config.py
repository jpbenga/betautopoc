from __future__ import annotations

import os
from argparse import Namespace

from .models import SelectionConfig

DEFAULT_COMBO_MIN_ODDS = 2.80
DEFAULT_COMBO_MAX_ODDS = 3.50
DEFAULT_MAX_PICKS = 5
DEFAULT_MIN_PICK_CONFIDENCE = 65
DEFAULT_MIN_GLOBAL_MATCH_CONFIDENCE = 65


def _pick_value(cli_value: object, env_name: str, default: object, cast: type) -> object:
    if cli_value is not None:
        return cast(cli_value)
    env_value = os.getenv(env_name)
    if env_value is not None and env_value != "":
        return cast(env_value)
    return default


def resolve_selection_model(args: Namespace) -> str | None:
    return args.model or os.getenv("SELECTION_ENGINE_MODEL") or os.getenv("OPENAI_ANALYSIS_MODEL")


def resolve_output_dir(args: Namespace) -> str:
    return args.output_dir or os.getenv("SELECTION_OUTPUT_DIR") or "data/selection_results"


def load_selection_config_from_env_and_cli(args: Namespace) -> SelectionConfig:
    config = SelectionConfig(
        combo_min_odds=_pick_value(args.combo_min_odds, "COMBO_MIN_ODDS", DEFAULT_COMBO_MIN_ODDS, float),
        combo_max_odds=_pick_value(args.combo_max_odds, "COMBO_MAX_ODDS", DEFAULT_COMBO_MAX_ODDS, float),
        max_picks=_pick_value(args.max_picks, "MAX_PICKS", DEFAULT_MAX_PICKS, int),
        min_pick_confidence=_pick_value(
            args.min_pick_confidence,
            "MIN_PICK_CONFIDENCE",
            DEFAULT_MIN_PICK_CONFIDENCE,
            int,
        ),
        min_global_match_confidence=_pick_value(
            args.min_global_match_confidence,
            "MIN_GLOBAL_MATCH_CONFIDENCE",
            DEFAULT_MIN_GLOBAL_MATCH_CONFIDENCE,
            int,
        ),
    )

    if config.combo_max_odds <= config.combo_min_odds:
        raise ValueError("combo_max_odds doit être strictement supérieur à combo_min_odds.")

    return config
