# Analysis Context Builder

## Rôle de la brique
La brique `analysis_context` prépare un contexte structuré et compact pour l'agent analyste IA. Elle centralise les données quantitatives d'API-Football, les normalise, et exporte un JSON exploitable par un LLM.

Avant toute modification d'appel API-Football, consulter la documentation locale officielle mise en forme dans `docs/api-football/`, en particulier `docs/api-football/usage-rules.md` et `docs/api-football/endpoint-reference.md`.

## Quantitatif vs qualitatif
- **Quantitatif (API-Football)**: fixtures, standings, statistiques équipe, forme récente, blessures, lineups, head-to-head, odds, events.
- **Qualitatif (placeholder pour l'instant)**: news, déclarations coachs, rumeurs, météo, fatigue, calendrier, motivation.

## Pourquoi API-Football ne remplace pas l'analyse IA
API-Football fournit les faits mesurables. L'analyse IA doit ensuite interpréter ces faits dans un contexte plus large (psychologique, médiatique, météo, enchaînement des matchs, etc.). Cette brique n'est donc qu'une couche de préparation de données.

## Générer un contexte

En mode strict par défaut, cette brique ne doit pas être lancée directement. Utiliser plutôt:

```bash
PYTHONPATH=. python scripts/run_orchestrated_pipeline.py --date 2026-04-26
```

Le script historique ci-dessous est réservé au mode legacy explicite:

```bash
BETAUTO_ALLOW_LEGACY=true PYTHONPATH=. python scripts/build_analysis_context.py --strategy-file config/strategies/default.json --date 2026-04-26
```

1. Définir les variables d'environnement techniques:
   - `API_FOOTBALL_KEY` (obligatoire)
   - `API_FOOTBALL_BASE_URL` (défaut: `https://v3.football.api-sports.io`)
   - `BETAUTO_STRATEGY_FILE` (défaut: `config/strategies/default.json`)
   - `ANALYSIS_CONTEXT_DATE` (optionnel)
   - `ANALYSIS_CONTEXT_OUTPUT_DIR` (défaut: `data/analysis_context`)
   - Variables legacy de fallback (si la stratégie ne fournit pas la donnée): `API_FOOTBALL_LEAGUE_ID`, `API_FOOTBALL_SEASON`, `API_FOOTBALL_BOOKMAKER_ID`, `API_FOOTBALL_BOOKMAKER_NAME`
2. Lancer:

Priorité de résolution: **CLI > Strategy > env fallback**.

Comportement multi-ligues:
- par défaut, le script prend la première ligue active de la stratégie;
- `--all-leagues` traite toutes les ligues actives et exporte dans des sous-dossiers `league_<id>/`.

## Sorties
- `analysis_context_YYYYMMDD_HHMMSS.json`
- `latest_analysis_context.json` uniquement si `BETAUTO_ALLOW_LEGACY=true`

Les appels API sont conservés dans le champ `api_calls` pour audit.

## Mode strict

`latest_analysis_context.json` est interdit par défaut. Toute tentative de lecture ou écriture est bloquée sauf si `BETAUTO_ALLOW_LEGACY=true`.

## Extension future: presse / météo / rumeurs
Le module `qualitative.py` contient déjà la structure cible. Il suffira d'ajouter des connecteurs de sources (sans casser le format du contexte) et d'alimenter `qualitative_context` dans `builder.py`.
