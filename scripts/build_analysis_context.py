from __future__ import annotations

import argparse
import os
from pathlib import Path

from dotenv import load_dotenv

from betauto.runtime_mode import require_legacy_mode


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build structured analysis context from API-Football data.")
    parser.add_argument("--date", dest="target_date", help="Target date (YYYY-MM-DD).")
    parser.add_argument("--league-id", type=int, default=None, help="League id (default from env or 39).")
    parser.add_argument("--season", type=int, default=None, help="Season (default from env or 2025).")
    parser.add_argument("--bookmaker-id", type=int, default=None, help="Bookmaker id (default from env or 16).")
    parser.add_argument("--strategy-file", default=None, help="Strategy file path (default from BETAUTO_STRATEGY_FILE).")
    parser.add_argument("--all-leagues", action="store_true", help="Build context for all enabled leagues from strategy.")
    parser.add_argument("--output-dir", default=None, help="Output directory (default env or data/analysis_context).")
    return parser.parse_args()


def summarize(payload: dict) -> dict[str, int]:
    matches = payload.get("matches", [])
    ready = sum(1 for match in matches if match.get("analysis_readiness", {}).get("status") == "ready")
    partial = sum(1 for match in matches if match.get("analysis_readiness", {}).get("status") == "partial")
    insufficient = sum(1 for match in matches if match.get("analysis_readiness", {}).get("status") == "insufficient")
    return {
        "matches": len(matches),
        "ready": ready,
        "partial": partial,
        "insufficient": insufficient,
        "api_calls": len(payload.get("api_calls", [])),
    }


def main() -> None:
    load_dotenv()
    require_legacy_mode("build_analysis_context.py calls AnalysisContextBuilder directly and writes latest_analysis_context.json")
    from betauto.analysis_context import AnalysisContextBuilder, export_analysis_context
    from betauto.strategy import load_and_resolve_strategy

    args = parse_args()

    output_dir = Path(
        args.output_dir
        or os.getenv("ANALYSIS_CONTEXT_OUTPUT_DIR", "data/analysis_context")
    )
    target_date = args.target_date or os.getenv("ANALYSIS_CONTEXT_DATE")
    resolved_strategy = load_and_resolve_strategy(args.strategy_file)

    league_ids_from_strategy = resolved_strategy.league_ids_allowed
    default_league_id = league_ids_from_strategy[0] if league_ids_from_strategy else None
    season = args.season if args.season is not None else resolved_strategy.season
    bookmaker_id = args.bookmaker_id if args.bookmaker_id is not None else resolved_strategy.bookmaker_id
    bookmaker_name = resolved_strategy.bookmaker_name

    if args.league_id is not None:
        league_ids = [args.league_id]
    elif args.all_leagues and league_ids_from_strategy:
        league_ids = league_ids_from_strategy
    elif default_league_id is not None:
        league_ids = [default_league_id]
    else:
        league_ids = [None]

    for league_id in league_ids:
        builder = AnalysisContextBuilder(
            league_id=league_id,
            season=season,
            bookmaker_id=bookmaker_id,
            bookmaker_name=bookmaker_name,
            use_qualitative_context=resolved_strategy.use_qualitative_context,
        )
        payload = builder.build(target_date=target_date)

        current_output_dir = output_dir / f"league_{league_id}" if args.all_leagues and len(league_ids) > 1 else output_dir
        exported = export_analysis_context(payload, output_dir=current_output_dir)

        stats = summarize(payload)
        print(f"Target date: {payload.get('target_date')}")
        league = payload.get("league", {})
        print(f"League: {league.get('name')} ({league.get('id')}), season {league.get('season')}")
        print(f"Matches: {stats['matches']}")
        print(f"Ready: {stats['ready']}")
        print(f"Partial: {stats['partial']}")
        print(f"Insufficient: {stats['insufficient']}")
        print(f"API calls: {stats['api_calls']}")
        print(f"Generated files: {exported['dated']} | {exported['latest']}")


if __name__ == "__main__":
    main()
