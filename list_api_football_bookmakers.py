import json
import os
from pathlib import Path

import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("API_FOOTBALL_KEY")
BASE_URL = os.getenv("API_FOOTBALL_BASE_URL", "https://v3.football.api-sports.io")

if not API_KEY:
    raise RuntimeError("API_FOOTBALL_KEY manquant dans .env")

response = requests.get(
    f"{BASE_URL}/odds/bookmakers",
    headers={"x-apisports-key": API_KEY},
    timeout=30,
)

response.raise_for_status()
payload = response.json()

bookmakers = payload.get("response", [])

output = {
    "count": len(bookmakers),
    "bookmakers": sorted(bookmakers, key=lambda x: str(x.get("name", "")).lower()),
    "raw": payload,
}

Path("api_football_bookmakers.json").write_text(
    json.dumps(output, ensure_ascii=False, indent=2),
    encoding="utf-8",
)

print(f"{len(bookmakers)} bookmakers trouvés")
print("Fichier généré : api_football_bookmakers.json")

for bookmaker in output["bookmakers"]:
    print(f'{bookmaker.get("id")} — {bookmaker.get("name")}')