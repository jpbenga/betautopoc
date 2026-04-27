from __future__ import annotations

import argparse

from betauto.orchestrator import OrchestratorOptions, run_orchestrated_pipeline


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run BetAuto V1 orchestrated pipeline (strategy -> context -> analysis -> selection).")
    parser.add_argument(
        "--strategy-file",
        default=None,
        help="Strategy file path (default: BETAUTO_STRATEGY_FILE or config/strategies/default.json).",
    )
    parser.add_argument("--date", dest="target_date", required=True, help="Target date (YYYY-MM-DD).")
    parser.add_argument("--output-dir", default="data/orchestrator_runs", help="Root output directory for orchestrator runs.")
    parser.add_argument("--max-matches", type=int, default=None, help="Max matches analyzed by analysis engine.")
    parser.add_argument(
        "--sleep-between-matches",
        type=float,
        default=None,
        help="Seconds sleep between two match analyses.",
    )
    parser.add_argument(
        "--skip-context",
        action="store_true",
        help="Reuse data/analysis_context/latest_analysis_context.json instead of rebuilding context.",
    )
    parser.add_argument(
        "--skip-analysis",
        action="store_true",
        help="Reuse data/analysis_results/latest_match_analysis.json instead of rerunning analysis engine.",
    )
    parser.add_argument("--skip-selection", action="store_true", help="Skip selection engine step.")
    parser.add_argument(
        "--with-browser",
        action="store_true",
        help="Reserved flag. Browser execution is not implemented in orchestrator v1.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    options = OrchestratorOptions(
        strategy_file=args.strategy_file,
        target_date=args.target_date,
        output_dir=args.output_dir,
        max_matches=args.max_matches,
        sleep_between_matches=args.sleep_between_matches,
        skip_context=args.skip_context,
        skip_analysis=args.skip_analysis,
        skip_selection=args.skip_selection,
        with_browser=args.with_browser,
    )
    run_orchestrated_pipeline(options)


if __name__ == "__main__":
    main()
