from __future__ import annotations

import argparse
import json
import os
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

from betauto.analysis_engine import run_analysis_batch_with_stats


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
    return parser.parse_args()


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

    results, stats = run_analysis_batch_with_stats(
        context_file=args.context_file,
        llm=client,
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
