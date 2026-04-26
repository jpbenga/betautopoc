from __future__ import annotations

import argparse
import os
from pathlib import Path

from dotenv import load_dotenv

from betauto.analysis_context import AnalysisContextBuilder, export_analysis_context


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build structured analysis context from API-Football data.")
    parser.add_argument("--date", dest="target_date", help="Target date (YYYY-MM-DD).")
    parser.add_argument("--league-id", type=int, default=None, help="League id (default from env or 39).")
    parser.add_argument("--season", type=int, default=None, help="Season (default from env or 2025).")
    parser.add_argument("--bookmaker-id", type=int, default=None, help="Bookmaker id (default from env or 16).")
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
    args = parse_args()

    output_dir = Path(
        args.output_dir
        or os.getenv("ANALYSIS_CONTEXT_OUTPUT_DIR", "data/analysis_context")
    )
    target_date = args.target_date or os.getenv("ANALYSIS_CONTEXT_DATE")

    builder = AnalysisContextBuilder(
        league_id=args.league_id,
        season=args.season,
        bookmaker_id=args.bookmaker_id,
    )
    payload = builder.build(target_date=target_date)
    exported = export_analysis_context(payload, output_dir=output_dir)

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
