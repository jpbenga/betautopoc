# Analysis Context Builder

## Rôle de la brique
La brique `analysis_context` prépare un contexte structuré et compact pour l'agent analyste IA. Elle centralise les données quantitatives d'API-Football, les normalise, et exporte un JSON exploitable par un LLM.

## Quantitatif vs qualitatif
- **Quantitatif (API-Football)**: fixtures, standings, statistiques équipe, forme récente, blessures, lineups, head-to-head, odds, events.
- **Qualitatif (placeholder pour l'instant)**: news, déclarations coachs, rumeurs, météo, fatigue, calendrier, motivation.

## Pourquoi API-Football ne remplace pas l'analyse IA
API-Football fournit les faits mesurables. L'analyse IA doit ensuite interpréter ces faits dans un contexte plus large (psychologique, médiatique, météo, enchaînement des matchs, etc.). Cette brique n'est donc qu'une couche de préparation de données.

## Générer un contexte
1. Définir les variables d'environnement:
   - `API_FOOTBALL_KEY` (obligatoire)
   - `API_FOOTBALL_BASE_URL` (défaut: `https://v3.football.api-sports.io`)
   - `API_FOOTBALL_LEAGUE_ID` (défaut: `39`)
   - `API_FOOTBALL_SEASON` (défaut: `2025`)
   - `API_FOOTBALL_BOOKMAKER_ID` (défaut: `16`)
   - `API_FOOTBALL_BOOKMAKER_NAME` (défaut: `Unibet`)
   - `ANALYSIS_CONTEXT_DATE` (optionnel)
   - `ANALYSIS_CONTEXT_OUTPUT_DIR` (défaut: `data/analysis_context`)
2. Lancer:

```bash
python scripts/build_analysis_context.py --date 2026-04-26
```

## Sorties
- `analysis_context_YYYYMMDD_HHMMSS.json`
- `latest_analysis_context.json`

Les appels API sont conservés dans le champ `api_calls` pour audit.

## Injection future dans le master prompt
Plus tard, le `latest_analysis_context.json` pourra être injecté en entrée du prompt maître pour alimenter la phase d'analyse IA sans changer la logique d'appel API.

## Extension future: presse / météo / rumeurs
Le module `qualitative.py` contient déjà la structure cible. Il suffira d'ajouter des connecteurs de sources (sans casser le format du contexte) et d'alimenter `qualitative_context` dans `builder.py`.
