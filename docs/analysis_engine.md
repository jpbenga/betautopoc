# Analysis Engine v1

## Rôle du module
La brique `analysis_engine` réalise une analyse LLM **match par match** à partir d'un contexte d'analyse. En mode strict, elle est appelée par l'orchestrateur avec le fichier `analysis_context.json` du `run_dir` courant.

Pipeline cible:

`analysis_context -> analysis_engine -> JSON d'analyses individuelles`

## Pourquoi 1 match = 1 prompt
- Isolation analytique: chaque rencontre est évaluée sans pollution par les autres matchs.
- Meilleure traçabilité: statut `success/failed`, tokens, coût estimé par fixture.
- Résilience: un échec sur un match n'interrompt pas la batch complète.

## Composants
- `betauto/analysis_engine/models.py`
  - Schéma `MatchAnalysis`.
  - Enveloppe `MatchAnalysisResult` (status, usage, coût).
- `betauto/analysis_engine/match_analyzer.py`
  - Charge `prompts/match_analysis_prompt.txt`.
  - Injecte le JSON d'un match.
  - Exécute **un appel LLM par match**.
  - Parse/valide la sortie JSON.
  - Applique un fallback minimal en cas d'erreur.
- `betauto/analysis_engine/batch_runner.py`
  - Itère sur les matchs du contexte.
  - Appelle `analyze_match` pour chaque fixture.
  - Agrège résultats + statistiques globales.
- `scripts/run_match_analysis_batch.py`
  - Point d'entrée CLI.
  - Charge l'OpenAI client (comme le pipeline principal).
  - Exporte les résultats dans `data/analysis_results/`.

## Exécution

En mode strict par défaut, lancer l'orchestrateur complet:

```bash
PYTHONPATH=. python scripts/run_orchestrated_pipeline.py --date 2026-04-26
```

Le script historique est réservé au mode legacy explicite:

```bash
BETAUTO_ALLOW_LEGACY=true PYTHONPATH=. python scripts/run_match_analysis_batch.py \
  --context-file data/analysis_context/latest_analysis_context.json \
  --output-dir data/analysis_results
```

Pré-requis:
- `OPENAI_API_KEY`
- `OPENAI_ANALYSIS_MODEL`

Optionnel pour estimation de coût:
- `OPENAI_INPUT_COST_PER_1M`
- `OPENAI_OUTPUT_COST_PER_1M`

## Sorties
- `data/analysis_results/match_analysis_YYYYMMDD_HHMMSS.json`
- `data/analysis_results/latest_match_analysis.json` uniquement si `BETAUTO_ALLOW_LEGACY=true`

Structure de sortie (niveau racine):
- `generated_at`: timestamp UTC.
- `context_file`: fichier source utilisé.
- `model`: modèle LLM utilisé.
- `stats`:
  - `total_matches`, `success_count`, `failed_count`
  - `elapsed_seconds`
  - `total_input_tokens`, `total_output_tokens`, `total_tokens`
  - `estimated_cost_usd`
  - `per_match_status` (status et coût par fixture)
- `results`: liste de `MatchAnalysisResult`.

Chaque `results[i].analysis` contient:
- `fixture_id`, `event`, `competition`, `kickoff`
- `analysis_summary`, `key_factors`, `risks`
- `predicted_markets[]` (`market_canonical_id`, `selection_canonical_id`, `confidence`, `reason`)
- `global_confidence`, `data_quality`

## Notes
- Aucun usage de Browser Use dans cette brique.
- Aucun combiné n'est construit à ce stade.
- Le module est indépendant de `main.py`.
