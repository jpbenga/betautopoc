from __future__ import annotations

import argparse
import json

from dotenv import load_dotenv

from betauto.orchestrator import run_orchestrated_pipeline


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run BetAuto orchestrator pipeline (V1).")
    parser.add_argument("--date", dest="target_date", required=True, help="Target date (YYYY-MM-DD).")
    parser.add_argument("--strategy-file", default=None)
    parser.add_argument("--output-dir", default="data/orchestrator_runs")
    parser.add_argument("--max-matches", type=int, default=None)
    parser.add_argument("--sleep-between-matches", type=float, default=None)
    parser.add_argument("--with-browser", action=argparse.BooleanOptionalAction, default=False)
    return parser.parse_args()


def main() -> None:
    load_dotenv()
    args = parse_args()

    summary = run_orchestrated_pipeline(
        target_date=args.target_date,
        strategy_file=args.strategy_file,
        output_dir=args.output_dir,
        max_matches=args.max_matches,
        sleep_between_matches=args.sleep_between_matches,
        with_browser=args.with_browser,
    )
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
