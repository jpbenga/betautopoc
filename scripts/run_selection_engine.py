from __future__ import annotations

import argparse
import json
import os
from pathlib import Path

from betauto.runtime_mode import ensure_latest_allowed, require_legacy_mode


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run Selection Engine from existing match analyses.")
    parser.add_argument(
        "--input-file",
        default="data/analysis_results/latest_match_analysis.json",
        help="Path to match analysis JSON file.",
    )
    parser.add_argument(
        "--output-dir",
        default=None,
        help="Directory where selection files will be exported (default: SELECTION_OUTPUT_DIR or data/selection_results).",
    )
    parser.add_argument(
        "--strategy-file",
        default=None,
        help=(
            "Path to business strategy JSON file (priority: CLI overrides > strategy > legacy env/defaults). "
            "If omitted, uses BETAUTO_STRATEGY_FILE or config/strategies/default.json."
        ),
    )
    parser.add_argument("--combo-min-odds", type=float, default=None)
    parser.add_argument("--combo-max-odds", type=float, default=None)
    parser.add_argument("--max-picks", type=int, default=None)
    parser.add_argument("--min-pick-confidence", type=int, default=None)
    parser.add_argument("--min-global-match-confidence", type=int, default=None)
    parser.add_argument(
        "--model",
        default=None,
        help="Override selection model (default: SELECTION_ENGINE_MODEL or OPENAI_ANALYSIS_MODEL).",
    )
    return parser.parse_args()


def _load_input_payload(path: Path) -> dict:
    if not path.exists():
        raise FileNotFoundError(f"Input file not found: {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> None:
    args = parse_args()
    require_legacy_mode("run_selection_engine.py calls the selection engine directly and reads/writes latest_* artifacts")
    ensure_latest_allowed(args.input_file)

    from dotenv import load_dotenv
    from openai import OpenAI
    from betauto.selection_engine import (
        export_selection_result,
        load_selection_config_from_env_and_cli,
        resolve_output_dir,
        resolve_selection_model,
        resolve_strategy_config,
        select_combo,
    )

    load_dotenv()

    strategy_config = resolve_strategy_config(args)
    config = load_selection_config_from_env_and_cli(args)
    output_dir = resolve_output_dir(args)

    input_payload = _load_input_payload(Path(args.input_file))
    model = resolve_selection_model(args)

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY manquant dans .env.")
    if not model:
        raise RuntimeError("SELECTION_ENGINE_MODEL ou OPENAI_ANALYSIS_MODEL manquant (ou --model).")

    client = OpenAI(api_key=api_key)
    client.analysis_model = model

    selection_result = select_combo(
        match_analyses=input_payload,
        config=config,
        llm=client,
        input_file=str(args.input_file),
    )

    dated_path, latest_path = export_selection_result(selection_result, output_dir=output_dir)

    print(f"Input file: {args.input_file}")
    print(f"Strategy: {strategy_config.strategy_id}")
    print(f"Combo target: {config.combo_min_odds:.2f} - {config.combo_max_odds:.2f}")
    print(f"Max picks: {config.max_picks}")
    print(f"Picks selected: {len(selection_result.get('picks', []))}")
    print(f"Estimated odds: {selection_result.get('estimated_combo_odds')}")
    print(f"In target range: {selection_result.get('combo_in_target_range')}")
    print(f"Output files: {dated_path} | {latest_path}")


if __name__ == "__main__":
    main()
