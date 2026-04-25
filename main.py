from __future__ import annotations

import asyncio
import json
import os
import re
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Optional
from zoneinfo import ZoneInfo

from dotenv import load_dotenv
from fastapi import BackgroundTasks, FastAPI, HTTPException
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from openai import OpenAI
from pydantic import BaseModel, Field

from browser_use import Agent, ChatOpenAI
from betauto.market_dictionary.resolver import resolve_pick_market_aliases


# ============================================================
# INIT
# ============================================================

load_dotenv()

app = FastAPI(title="BetAuto Real POC")

BASE_DIR = Path(__file__).parent
STATIC_DIR = BASE_DIR / "static"
PROMPTS_DIR = BASE_DIR / "prompts"
GENERATED_DIR = BASE_DIR / "generated"
RUNS_DIR = BASE_DIR / "runs"

STATIC_DIR.mkdir(exist_ok=True)
PROMPTS_DIR.mkdir(exist_ok=True)
GENERATED_DIR.mkdir(exist_ok=True)
RUNS_DIR.mkdir(exist_ok=True)

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

TZ = ZoneInfo(os.getenv("APP_TIMEZONE", "Europe/Paris"))

JOBS: dict[str, dict[str, Any]] = {}


# ============================================================
# SCHEMAS
# ============================================================

class Pick(BaseModel):
    pick_id: str
    competition: str
    event: str
    home_team: Optional[str] = None
    away_team: Optional[str] = None
    kickoff_time_local: Optional[str] = None
    market: str
    pick: str
    market_canonical_id: Optional[str] = None
    selection_canonical_id: Optional[str] = None
    market_aliases: list[str] = Field(default_factory=list)
    selection_aliases: list[str] = Field(default_factory=list)
    dictionary_match_status: Optional[str] = None
    dictionary_notes: list[str] = Field(default_factory=list)
    expected_odds_min: float
    expected_odds_max: float
    confidence_score: int
    risk_level: Optional[str] = None
    analysis_summary: Optional[str] = None
    key_factors: list[str] = Field(default_factory=list)
    main_risks: list[str] = Field(default_factory=list)
    source_urls: list[str] = Field(default_factory=list)


class PicksPayload(BaseModel):
    generated_at: str
    target_date: str
    competitions_analyzed: list[str] = Field(default_factory=list)
    combo_target_odds_range: dict[str, float] = Field(default_factory=dict)
    max_matches: Optional[int] = None
    strategy_summary: Optional[str] = None
    picks: list[Pick]
    estimated_combo_odds: Optional[float] = None
    global_confidence_score: Optional[int] = None
    combo_risk_level: Optional[str] = None
    rejected_matches: list[dict[str, Any]] = Field(default_factory=list)
    notes: list[str] = Field(default_factory=list)


class VerifiedPick(BaseModel):
    pick_id: str
    competition: Optional[str] = None
    event: str
    market: str
    pick: str
    market_canonical_id: Optional[str] = None
    selection_canonical_id: Optional[str] = None
    matched_market_alias: Optional[str] = None
    matched_selection_alias: Optional[str] = None
    dictionary_match_status: Optional[str] = None

    found_on_unibet: bool
    added_to_betslip: bool = False
    unibet_event_label: Optional[str] = None
    unibet_market_label: Optional[str] = None
    unibet_pick_label: Optional[str] = None

    expected_odds_min: Optional[float] = None
    expected_odds_max: Optional[float] = None
    unibet_odds: Optional[float] = None

    odds_coherent: bool
    confidence: Optional[str] = None
    reason: str


class VerificationOutput(BaseModel):
    checked_at: str
    source: str = "unibet.fr"
    status: str
    picks_checked: list[VerifiedPick]
    unibet_combo_odds: Optional[float] = None
    combo_in_target_range: Optional[bool] = None
    browser_summary: Optional[str] = None
    navigation_steps: list[str] = Field(default_factory=list)
    errors: list[str] = Field(default_factory=list)
    notes: list[str] = Field(default_factory=list)


# ============================================================
# HELPERS
# ============================================================

def now_iso() -> str:
    return datetime.now(TZ).isoformat(timespec="seconds")


def get_target_date() -> str:
    return (datetime.now(TZ).date() + timedelta(days=1)).isoformat()


def get_cache_path(target_date: str) -> Path:
    return GENERATED_DIR / f"picks_{target_date}.json"


def get_run_dir(job_id: str) -> Path:
    path = RUNS_DIR / job_id
    path.mkdir(parents=True, exist_ok=True)
    return path


def log(job_id: str, message: str) -> None:
    JOBS[job_id]["logs"].append(
        {
            "at": now_iso(),
            "message": message,
        }
    )


def set_step(job_id: str, step: str, status: str, message: str) -> None:
    JOBS[job_id]["steps"][step]["status"] = status
    JOBS[job_id]["steps"][step]["message"] = message
    JOBS[job_id]["steps"][step]["updated_at"] = now_iso()
    log(job_id, f"[{step}] {message}")


def set_error(job_id: str, message: str) -> None:
    JOBS[job_id]["status"] = "error"
    JOBS[job_id]["error"] = message
    log(job_id, f"ERREUR — {message}")


def load_master_prompt(target_date: str) -> str:
    prompt_path = PROMPTS_DIR / "master_prompt.txt"

    if not prompt_path.exists():
        raise RuntimeError("Fichier prompts/master_prompt.txt introuvable.")

    prompt = prompt_path.read_text(encoding="utf-8")
    return prompt.replace("{{TARGET_DATE}}", target_date)


def extract_json_from_text(text: str) -> dict[str, Any]:
    text = (text or "").strip()

    if not text:
        raise ValueError("Réponse vide.")

    if text.startswith("{") and text.endswith("}"):
        return json.loads(text)

    fenced = re.search(
        r"```(?:json)?\s*(\{.*?\})\s*```",
        text,
        flags=re.DOTALL | re.IGNORECASE,
    )
    if fenced:
        return json.loads(fenced.group(1))

    start = text.find("{")
    end = text.rfind("}")

    if start != -1 and end != -1 and end > start:
        return json.loads(text[start:end + 1])

    raise ValueError("Aucun JSON valide trouvé dans la réponse.")


def save_json(path: Path, data: Any) -> None:
    path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def enrich_picks_with_market_dictionary(picks_payload: dict[str, Any]) -> dict[str, Any]:
    enriched_payload = dict(picks_payload)
    raw_picks = picks_payload.get("picks", [])
    enriched_picks: list[dict[str, Any]] = []

    for pick in raw_picks:
        if isinstance(pick, dict):
            enriched_picks.append(resolve_pick_market_aliases(pick))
        else:
            enriched_picks.append(pick)

    enriched_payload["picks"] = enriched_picks
    return enriched_payload


# ============================================================
# CACHE PICKS
# ============================================================

def load_cached_picks(target_date: str) -> Optional[dict[str, Any]]:
    path = get_cache_path(target_date)

    if not path.exists():
        return None

    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        payload = PicksPayload.model_validate(data)
    except Exception:
        return None

    if payload.target_date != target_date:
        return None

    return payload.model_dump()


def save_cached_picks(target_date: str, picks: dict[str, Any]) -> None:
    save_json(get_cache_path(target_date), picks)


# ============================================================
# OPENAI ANALYSIS
# ============================================================

def generate_picks_with_openai(job_id: str, target_date: str) -> dict[str, Any]:
    api_key = os.getenv("OPENAI_API_KEY")
    model = os.getenv("OPENAI_ANALYSIS_MODEL")

    if not api_key:
        raise RuntimeError("OPENAI_API_KEY manquant dans .env.")

    if not model:
        raise RuntimeError("OPENAI_ANALYSIS_MODEL manquant dans .env.")

    prompt = load_master_prompt(target_date)

    run_path = get_run_dir(job_id)
    (run_path / "prompt_used.txt").write_text(prompt, encoding="utf-8")

    client = OpenAI(api_key=api_key)

    response = client.responses.create(
        model=model,
        tools=[{"type": "web_search"}],
        input=prompt,
    )

    raw = response.output_text or ""
    (run_path / "gpt_raw_output.txt").write_text(raw, encoding="utf-8")

    data = extract_json_from_text(raw)
    payload = PicksPayload.model_validate(data)

    if payload.target_date != target_date:
        raise RuntimeError(
            f"Date JSON incorrecte : reçu {payload.target_date}, attendu {target_date}."
        )

    return payload.model_dump()


# ============================================================
# BROWSER USE — UNIBET
# ============================================================

def build_unibet_task(picks: dict[str, Any]) -> str:
    return f"""
Tu es un agent expert en automatisation de paris sportifs sur Unibet France.

OBJECTIF

1. Vérifier les cotes pour les picks fournis.
2. Cliquer sur chaque sélection pour l'ajouter au coupon (panier) de paris.

SITE

https://www.unibet.fr/

CONTRAINTES ABSOLUES

- Utiliser uniquement les pages publiques.
- Ne pas se connecter.
- Ne pas demander d’identifiants.
- Ne pas créer de compte.
- Ne pas cliquer sur "Placer le pari".
- Ne pas cliquer sur "Valider le panier".
- S'arrêter une fois que tous les picks sont dans le panier.

JSON DES PICKS À VÉRIFIER

{json.dumps(picks, ensure_ascii=False, indent=2)}

PROCÉDURE POUR CHAQUE PICK

Pour chaque pick, tu dois suivre cet ordre strict :

1. Accéder à https://www.unibet.fr/

2. Gérer les blocages :
   - refuser les cookies si une popup apparaît ;
   - fermer toute modal bloquante ;
   - cliquer sur "Poursuivre sur le nouveau site" si présent.

3. Trouver le match avec cette stratégie prioritaire :

   a. Recherche directe :
   - utiliser une barre de recherche si visible ;
   - sinon chercher une icône de recherche ou une loupe ;
   - rechercher avec :
     - le nom exact du match ;
     - ou le nom de l’équipe à domicile ;
     - ou le nom de l’équipe à l’extérieur.

   b. Si la recherche échoue :
   - aller dans Football ;
   - naviguer vers la compétition indiquée dans le pick ;
   - chercher le match manuellement.

   c. Si le match est introuvable :
   - found_on_unibet = false ;
   - unibet_odds = null ;
   - odds_coherent = false ;
   - confidence = "low" ;
   - reason = "Match introuvable sur Unibet" ;
   - passer au pick suivant.

4. Une fois le match trouvé :
   - vérifier que les équipes correspondent au JSON ;
   - remplir unibet_event_label avec le libellé exact trouvé sur Unibet.

5. Accéder au marché demandé :
   - utiliser d'abord market_canonical_id et market_aliases ;
   - considérer le marché trouvé si un des market_aliases est visible ;
   - trouver le marché demandé ;
   - ouvrir le détail du match si nécessaire ;
   - remplir unibet_market_label avec le libellé exact trouvé.

6. Trouver la sélection demandée :
   - utiliser d'abord selection_canonical_id et selection_aliases ;
   - considérer la sélection trouvée si un des selection_aliases est visible ;
   - ne pas interpréter librement si des aliases sont présents ;
   - utiliser market et pick texte uniquement en fallback ;
   - identifier le libellé exact de la sélection ;
   - remplir unibet_pick_label.

7. Lire la cote affichée :
   - extraire la cote affichée ;
   - stocker uniquement un nombre dans unibet_odds ;
   - ne jamais inventer de cote.

8. ACTION DE PARI (préparation ticket, sans validation) :
   - cliquer physiquement sur la case de cote correspondant à la sélection ;
   - vérifier un changement visuel (case sélectionnée) ;
   - vérifier que le compteur du panier augmente ou que la sélection apparaît dans le panier ;
   - added_to_betslip = true uniquement si la vérification panier est positive ;
   - added_to_betslip = false sinon.

9. Comparer avec expected_odds_min :
   - odds_coherent = true si unibet_odds >= expected_odds_min ;
   - odds_coherent = false si unibet_odds < expected_odds_min.

10. Compléter reason :
   - expliquer brièvement ce qui a été trouvé ou non trouvé ;
   - indiquer explicitement si l'ajout au panier a réussi.

11. Ajouter les grandes étapes dans navigation_steps :
   - ouverture du site ;
   - gestion cookies ;
   - modal fermée ;
   - recherche du match ;
   - match trouvé ou introuvable ;
   - marché trouvé ou introuvable ;
   - cote lue ;
   - clic sélection ;
   - contrôle panier.
   - tentatives aliases marché/sélection si nécessaire.

RÈGLE D'ARRÊT POUR ALIASES

- Si le match est trouvé mais que le marché ou la sélection restent introuvables après 2 tentatives basées sur les aliases :
  - found_on_unibet = true ;
  - added_to_betslip = false ;
  - unibet_odds = null ;
  - odds_coherent = false ;
  - reason doit expliquer clairement "marché introuvable malgré aliases" ou "sélection introuvable malgré aliases" ;
  - passer immédiatement au pick suivant.

RÈGLES GLOBALES

- found_on_unibet = false si le match est introuvable.
- added_to_betslip = false si le match, le marché, la sélection ou la vérification panier échoue.
- unibet_odds doit être un nombre ou null.
- odds_coherent = true uniquement si une cote réelle a été lue et qu’elle est >= expected_odds_min.
- odds_coherent = false dans tous les autres cas.
- confidence = "low" si tu n’es pas sûr de la correspondance.
- Ne jamais inventer un match.
- Ne jamais inventer une cote.
- Ne jamais deviner.

CALCUL GLOBAL

- Calculer unibet_combo_odds en multipliant uniquement les cotes :
  - trouvées sur Unibet ;
  - et cohérentes.

- Si aucun pick valide n’a une cote réelle :
  - unibet_combo_odds = null.

- combo_in_target_range :
  - true si unibet_combo_odds est entre 2.80 et 3.50 ;
  - false si unibet_combo_odds existe mais est hors de cette plage ;
  - null si unibet_combo_odds = null.

SORTIE

Retourne uniquement une sortie structurée conforme au schéma demandé.
"""


async def verify_unibet_with_browser_use(job_id: str, picks: dict[str, Any]) -> dict[str, Any]:
    api_key = os.getenv("OPENAI_API_KEY")
    model = os.getenv("OPENAI_BROWSER_MODEL")

    if not api_key:
        raise RuntimeError("OPENAI_API_KEY manquant dans .env.")

    if not model:
        raise RuntimeError("OPENAI_BROWSER_MODEL manquant dans .env.")

    llm = ChatOpenAI(
        model=model,
        api_key=api_key,
        temperature=0,
    )

    agent = Agent(
        task=build_unibet_task(picks),
        llm=llm,
        output_model_schema=VerificationOutput,
        max_steps=int(os.getenv("BROWSER_USE_MAX_STEPS", "30")),
        use_vision=True,
    )

    timeout_seconds = int(os.getenv("BROWSER_USE_TIMEOUT_SECONDS", "90"))

    try:
        history = await asyncio.wait_for(agent.run(), timeout=timeout_seconds)
    except asyncio.TimeoutError:
        raise RuntimeError(f"Timeout Browser Use après {timeout_seconds} secondes.")

    structured = getattr(history, "structured_output", None)

    if structured is None:
        final = history.final_result() if hasattr(history, "final_result") else str(history)
        (get_run_dir(job_id) / "browser_raw_output.txt").write_text(
            str(final),
            encoding="utf-8",
        )
        data = extract_json_from_text(str(final))
        payload = VerificationOutput.model_validate(data)
    else:
        payload = structured

    result = payload.model_dump()

    save_json(get_run_dir(job_id) / "unibet_verification.json", result)

    return result


# ============================================================
# PIPELINE
# ============================================================

async def run_pipeline(job_id: str, force_regenerate: bool) -> None:
    try:
        target = get_target_date()
        JOBS[job_id]["target_date"] = target

        log(job_id, f"Process lancé. Date cible : {target}")

        set_step(job_id, "cache", "running", "Vérification du cache JSON.")

        cached = None if force_regenerate else load_cached_picks(target)

        if cached:
            set_step(
                job_id,
                "cache",
                "done",
                "Cache valide trouvé. Appel GPT ignoré.",
            )
            set_step(
                job_id,
                "analysis",
                "skipped",
                "Analyse GPT non relancée.",
            )
            picks = cached
        else:
            set_step(
                job_id,
                "cache",
                "done",
                "Aucun cache valide trouvé.",
            )

            set_step(
                job_id,
                "analysis",
                "running",
                "Analyse GPT avec recherche web en cours.",
            )

            picks = await asyncio.to_thread(generate_picks_with_openai, job_id, target)

            save_cached_picks(target, picks)
            save_json(get_run_dir(job_id) / "picks.json", picks)

            set_step(
                job_id,
                "analysis",
                "done",
                "Analyse GPT terminée. JSON généré et sauvegardé.",
            )

        picks = enrich_picks_with_market_dictionary(picks)
        JOBS[job_id]["picks"] = picks
        save_json(get_run_dir(job_id) / "picks.json", picks)

        if not picks.get("picks"):
            set_step(
                job_id,
                "unibet",
                "skipped",
                "Aucun pick généré. Vérification Unibet ignorée.",
            )
            JOBS[job_id]["status"] = "done"
            log(job_id, "Process terminé sans vérification Unibet.")
            return

        set_step(
            job_id,
            "unibet",
            "running",
            "Browser Use vérifie les rencontres et cotes sur Unibet.",
        )

        verification = await verify_unibet_with_browser_use(job_id, picks)

        JOBS[job_id]["verification"] = verification

        set_step(
            job_id,
            "unibet",
            "done",
            "Vérification Unibet terminée.",
        )

        JOBS[job_id]["status"] = "done"
        JOBS[job_id]["completed_at"] = now_iso()
        log(job_id, "Process terminé.")

    except Exception as exc:
        set_error(job_id, str(exc))


# ============================================================
# API
# ============================================================

@app.get("/", response_class=HTMLResponse)
async def index():
    return FileResponse(STATIC_DIR / "index.html")


@app.post("/api/run")
async def run(data: dict, background_tasks: BackgroundTasks):
    job_id = uuid.uuid4().hex[:8]

    JOBS[job_id] = {
        "job_id": job_id,
        "status": "running",
        "error": None,
        "created_at": now_iso(),
        "completed_at": None,
        "target_date": None,
        "steps": {
            "cache": {
                "label": "Cache JSON",
                "status": "pending",
                "message": "En attente.",
                "updated_at": None,
            },
            "analysis": {
                "label": "Analyse GPT",
                "status": "pending",
                "message": "En attente.",
                "updated_at": None,
            },
            "unibet": {
                "label": "Vérification Unibet",
                "status": "pending",
                "message": "En attente.",
                "updated_at": None,
            },
        },
        "logs": [],
        "picks": None,
        "verification": None,
    }

    force_regenerate = bool(data.get("force", False))

    background_tasks.add_task(run_pipeline, job_id, force_regenerate)

    return {"job_id": job_id, "status": "running"}


@app.get("/api/job/{job_id}")
async def get_job(job_id: str):
    if job_id not in JOBS:
        raise HTTPException(status_code=404, detail="Job introuvable.")

    return JOBS[job_id]


@app.get("/api/job/{job_id}/file/{filename}")
async def get_file(job_id: str, filename: str):
    allowed = {
        "picks.json",
        "unibet_verification.json",
        "gpt_raw_output.txt",
        "browser_raw_output.txt",
        "prompt_used.txt",
    }

    if filename not in allowed:
        raise HTTPException(status_code=400, detail="Fichier non autorisé.")

    path = get_run_dir(job_id) / filename

    if not path.exists():
        raise HTTPException(status_code=404, detail="Fichier introuvable.")

    return FileResponse(path)


@app.post("/api/cache/clear")
async def clear_cache():
    removed = 0

    for file in GENERATED_DIR.glob("picks_*.json"):
        file.unlink()
        removed += 1

    return {"status": "ok", "removed": removed}
