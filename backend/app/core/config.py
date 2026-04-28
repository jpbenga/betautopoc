from __future__ import annotations

import os
from zoneinfo import ZoneInfo

from dotenv import load_dotenv

load_dotenv()

APP_TITLE = "BetAuto Real POC"
TZ = ZoneInfo(os.getenv("APP_TIMEZONE", "Europe/Paris"))
DEFAULT_CORS_ORIGINS = "http://localhost:4200,http://127.0.0.1:4200"
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("BETAUTO_CORS_ORIGINS", DEFAULT_CORS_ORIGINS).split(",")
    if origin.strip()
]


def env_flag(name: str, default: bool) -> bool:
    raw_value = os.getenv(name)
    if raw_value is None:
        return default
    return raw_value.strip().lower() not in {"0", "false", "no", "off"}
