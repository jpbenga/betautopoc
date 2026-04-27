from __future__ import annotations

import argparse
import json
import os
from datetime import datetime
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from openai import OpenAI

from betauto.analysis_engine import run_analysis_batch_with_stats
from betauto.strategy import ResolvedStrategyConfig, load_and_resolve_strategy


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run match-by-match LLM analysis from analysis context.")
    parser.add_argument(
        "--context-file",
        default="data/analysis_context/latest_analysis_context.json",
        help="Path to analysis context JSON file.",
    )
    parser.add_argument(
        "--output-dir",
        default="data/analysis_results",
        help="Directory where analysis files will be exported.",
    )
    parser.add_argument(
        "--model",
        default=None,
        help="Override model name (default from OPENAI_ANALYSIS_MODEL).",
    )
    parser.add_argument(
        "--max-matches",
        type=int,
        default=None,
        help="Limit number of matches to analyze.",
    )
    parser.add_argument(
        "--sleep-between-matches",
        type=float,
        default=None,
        help="Seconds to wait between two match analyses.",
    )
    parser.add_argument(
        "--continue-on-error",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Continue batch even if one match fails (default: true).",
    )
    parser.add_argument(
        "--strategy-file",
        default=None,
        help="Path to strategy definition JSON file. If omitted, current behavior is unchanged.",
    )
    return parser.parse_args()


def _extract_league_id(match: dict[str, Any]) -> int | None:
    fixture = match.get("fixture") or {}
    fixture_league_id = fixture.get("league_id")
    if isinstance(fixture_league_id, int):
        return fixture_league_id
    if isinstance(match.get("league_id"), int):
        return int(match["league_id"])
    league = match.get("league")
    if isinstance(league, dict) and isinstance(league.get("id"), int):
        return int(league["id"])
    return None


def _filter_matches_with_strategy(
    matches: list[dict[str, Any]],
    strategy_cfg: ResolvedStrategyConfig | None,
) -> list[dict[str, Any]]:
    if strategy_cfg is None or not strategy_cfg.league_ids_allowed:
        return matches
    allowed = set(strategy_cfg.league_ids_allowed)
    filtered: list[dict[str, Any]] = []
    for match in matches:
        league_id = _extract_league_id(match)
        if league_id is None or league_id in allowed:
            filtered.append(match)
    return filtered


def main() -> None:
    load_dotenv()
    args = parse_args()

    api_key = os.getenv("OPENAI_API_KEY")
    model = args.model or os.getenv("OPENAI_ANALYSIS_MODEL")

    if not api_key:
        raise RuntimeError("OPENAI_API_KEY manquant dans .env.")
    if not model:
        raise RuntimeError("OPENAI_ANALYSIS_MODEL manquant dans .env (ou --model).")

    client = OpenAI(api_key=api_key)
    client.analysis_model = model

    strategy_cfg: ResolvedStrategyConfig | None = None
    if args.strategy_file:
        strategy_cfg = load_and_resolve_strategy(args.strategy_file)

    context_payload = json.loads(Path(args.context_file).read_text(encoding="utf-8"))
    context_matches: list[dict[str, Any]] = context_payload.get("matches", [])
    total_matches_before_filter = len(context_matches)
    filtered_matches = _filter_matches_with_strategy(context_matches, strategy_cfg)

    print(f"Matches total: {total_matches_before_filter}")
    print(f"Matches after strategy filter: {len(filtered_matches)}")
    print(f"Strategy: {(strategy_cfg.strategy_id if strategy_cfg else 'none')}")

    results, stats = run_analysis_batch_with_stats(
        context_file=args.context_file,
        llm=client,
        matches=filtered_matches,
        strategy_cfg=strategy_cfg,
        max_matches=args.max_matches,
        sleep_between_matches=args.sleep_between_matches,
        continue_on_error=args.continue_on_error,
    )

    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    ts = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    dated_path = output_dir / f"match_analysis_{ts}.json"
    latest_path = output_dir / "latest_match_analysis.json"

    data = {
        "generated_at": datetime.utcnow().isoformat(timespec="seconds") + "Z",
        "context_file": args.context_file,
        "model": model,
        "stats": stats,
        "results": results,
    }

    payload = json.dumps(data, ensure_ascii=False, indent=2)
    dated_path.write_text(payload, encoding="utf-8")
    latest_path.write_text(payload, encoding="utf-8")

    print(f"Matches: {stats['total_matches']}")
    print(f"Analyses réussies: {stats['success_count']}")
    print(f"Analyses en échec: {stats['failed_count']}")
    print(f"Temps total (s): {stats['elapsed_seconds']}")
    print(f"Coût estimé (USD): {stats['estimated_cost_usd']}")
    print(f"Generated files: {dated_path} | {latest_path}")


if __name__ == "__main__":
    main()
