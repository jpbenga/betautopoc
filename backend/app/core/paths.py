from __future__ import annotations

from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
STATIC_DIR = REPO_ROOT / "static"
PROMPTS_DIR = REPO_ROOT / "prompts"
GENERATED_DIR = REPO_ROOT / "generated"
RUNS_DIR = REPO_ROOT / "runs"

for directory in (STATIC_DIR, PROMPTS_DIR, GENERATED_DIR, RUNS_DIR):
    directory.mkdir(parents=True, exist_ok=True)
