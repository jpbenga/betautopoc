from __future__ import annotations

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from betauto.market_dictionary import (
    build_market_dictionary_payload,
    export_market_dictionary,
    load_raw_data,
)


def main() -> int:
    base_dir = Path.cwd()
    output_dir = base_dir / "data" / "market_dictionary"

    loaded = load_raw_data(base_dir)
    payload = build_market_dictionary_payload(loaded)
    outputs = export_market_dictionary(output_dir, payload)

    stats = payload["stats"]
    print("Market Dictionary build completed.")
    print(f"- Fichier d'exploration utilisé : {stats['exploration_file']}")
    print(f"- Nombre de bookmakers chargés : {stats['bookmakers_count']}")
    print(f"- Nombre de marchés API-Football chargés : {stats['api_football_bets_count']}")
    print(f"- Nombre de marchés fixture chargés : {stats['fixture_markets_count']}")
    print(f"- Nombre de marchés mappés : {stats['mapped_markets_count']}")
    print(f"- Nombre de marchés non mappés : {stats['unmapped_markets_count']}")
    print("- Fichiers générés :")
    print(f"  * {outputs['inventory']}")
    print(f"  * {outputs['dictionary']}")
    print(f"  * {outputs['unmapped']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
