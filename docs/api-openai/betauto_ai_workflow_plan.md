# Plan OpenAI pour l'analyse, les agents et l'orchestration BetAuto

Date de rédaction: 2026-05-01

## Objectif

Ce document propose une architecture cible pour exploiter OpenAI dans BetAuto avec trois contraintes simultanées:

- maximiser la qualité de l'analyse IA;
- garder un workflow traçable, testable et strict;
- réduire les coûts en évitant les appels inutiles, les prompts trop longs, les modèles surdimensionnés et les relectures globales.

Il s'appuie sur:

- la documentation locale fournie dans `docs/api-openai/`;
- le code BetAuto actuellement en place;
- les pages officielles OpenAI consultées le 2026-05-01, listées en fin de document.

## Synthèse exécutive

BetAuto a déjà une base saine: un orchestrateur strict par run, un contexte football normalisé, une analyse match par match, une sélection finale, des artefacts JSON, des retries/backoff et un suivi de coût par tokens.

Les lacunes principales sont ailleurs:

1. Les sorties IA sont encore obtenues par prompt JSON libre puis parsing/réparation défensive. Il faut passer à Structured Outputs natif via Responses.
2. Le workflow est un pipeline Python déterministe, pas encore une architecture d'agents spécialisés. C'est volontairement robuste, mais cela limite les capacités de délégation, de traces agentiques, d'outils et de guardrails.
3. Tous les matchs analysables passent par un appel LLM complet. Il manque une étape de pré-tri cheap pour éviter d'analyser à fond les matchs pauvres en données ou hors stratégie.
4. Le choix de modèles n'est pas assez différencié par tâche. Un seul `OPENAI_ANALYSIS_MODEL` peut pousser à surpayer des tâches simples ou à sous-qualifier des tâches critiques.
5. Les prompts sont locaux et monolithiques. Il manque une stratégie de versioning, d'evals, de stored prompts et de mesure qualité/coût.
6. L'orchestration ne tire pas encore parti des primitives Agents SDK: agents-as-tools, handoffs contrôlés, tracing, guardrails, résultats structurés, exécution éventuellement en background.
7. La donnée qualitative est encore placeholder. OpenAI peut aider via outils de recherche/file search/MCP, mais seulement après avoir posé des garde-fous stricts contre l'invention et la dérive.

La recommandation est progressive: ne pas remplacer tout le pipeline par un "gros agent". Garder l'orchestrateur BetAuto comme source d'autorité, puis introduire des agents spécialisés derrière des contrats stricts.

## Etat actuel de BetAuto

### Pipeline existant

Flux actuel observé:

```text
Strategy
-> AnalysisContextBuilder
-> AnalysisEngine match par match
-> Aggregation candidates
-> Filtering candidates
-> SelectionEngine
-> data/orchestrator_runs/<run_id>/
```

Fichiers clés:

- `betauto/orchestrator/runner.py`
- `betauto/analysis_context/builder.py`
- `betauto/analysis_engine/match_analyzer.py`
- `betauto/analysis_engine/batch_runner.py`
- `betauto/selection_engine/selector.py`
- `betauto/api_clients/openai_client.py`
- `prompts/match_analysis_prompt.txt`
- `prompts/combo_selection_prompt.txt`

### Points forts actuels

- Mode strict par `run_dir`, sans dépendance à `latest_*`.
- Artefacts de run lisibles: `analysis_context.json`, `match_analysis.json`, `aggregation_candidates.json`, `filtered_candidates.json`, `selection.json`, `run_summary.json`.
- Analyse isolée par match, ce qui limite la contamination entre rencontres.
- Résilience: un match en échec n'interrompt pas forcément le lot.
- Suivi coût/tokens par match dans `BatchRunStats`.
- Retry/backoff OpenAI dans `betauto/api_clients/openai_client.py`.
- Prompts métier stricts contre l'invention.
- Validation Pydantic après parsing.
- UI de suivi run/logs/outputs déjà en cours d'amélioration.

### Lacunes actuelles

#### Sorties structurées encore trop fragiles

Aujourd'hui, `match_analyzer.py` demande du JSON strict dans le prompt, puis tente d'extraire un objet JSON du texte. `selection_engine/selector.py` va plus loin avec réparation JSON. C'est utile défensivement, mais cela indique que le contrat de sortie n'est pas suffisamment porté par l'API.

Impact:

- coûts de retries JSON;
- code de parsing/réparation complexe;
- risque de sorties acceptées après normalisation trop permissive;
- difficulté à évaluer précisément la conformité du modèle.

#### Modèle unique ou quasi unique

Le code s'appuie surtout sur:

- `OPENAI_ANALYSIS_MODEL`;
- `SELECTION_ENGINE_MODEL` avec fallback sur `OPENAI_ANALYSIS_MODEL`.

Cela ne distingue pas assez:

- pré-tri cheap;
- analyse standard;
- analyse approfondie;
- arbitrage final;
- synthèse utilisateur;
- contrôle qualité.

#### Pas encore de routage intelligent

Tous les matchs présents dans le contexte peuvent être analysés de manière similaire. Il manque un routeur qui décide:

- skip sans LLM;
- analyse cheap;
- analyse standard;
- analyse approfondie;
- besoin de données qualitatives;
- besoin de revue ou de blocage.

#### Pas d'agents spécialisés formalisés

Le pipeline a des étapes, mais pas encore des agents nommés avec:

- responsabilité claire;
- modèle dédié;
- output contract dédié;
- outils autorisés;
- guardrails;
- traces agentiques.

#### Peu d'evals IA

Les validations Pydantic vérifient la forme, mais pas encore:

- fidélité aux données d'entrée;
- absence de marché non autorisé;
- qualité du raisonnement;
- stabilité d'un modèle à l'autre;
- coût moyen par pick utile;
- taux de "no bet" pertinent;
- calibration des confidences.

#### Contexte et coût

`compact_match_context_for_llm()` limite déjà certaines listes, mais il manque:

- token counting avant appel;
- budgets par run;
- budgets par match;
- budgets par ligue;
- choix de modèle selon taille du contexte;
- mesure de cache hit / cached input quand disponible;
- Batch API ou Flex/Batch pour traitements non urgents.

## Principes d'architecture cible

### 1. L'orchestrateur BetAuto reste souverain

L'IA ne doit pas devenir le propriétaire implicite du workflow. BetAuto doit continuer à décider:

- quelles ligues sont actives;
- quelles fixtures sont éligibles;
- quelles données sont disponibles;
- quelle stratégie est appliquée;
- quels artefacts sont valides;
- quand le run est terminé ou stoppé.

Les agents OpenAI doivent être des spécialistes sous contrat, pas une boîte noire qui pilote toute la chaîne.

### 2. Les agents sont introduits seulement quand le contrat change

La doc OpenAI recommande de commencer simple et de ne split que lorsque le besoin est réel: outils différents, politiques différentes, modèle différent, sortie différente, propriété différente du résultat.

Pour BetAuto, le bon découpage n'est donc pas "un agent par étape technique", mais "un agent par responsabilité métier distincte".

### 3. Agents-as-tools plutôt que handoffs pour le coeur du pipeline

Dans BetAuto, le manager doit rester responsable de la décision finale du workflow. Les agents spécialistes doivent produire des sorties bornées. Le pattern prioritaire est donc:

```text
BetAuto Orchestrator
-> Manager/Router
   -> Scout tool-agent
   -> Match Analyst tool-agent
   -> Risk & Market Validator tool-agent
   -> Ticket Selector tool-agent
   -> QA/Audit tool-agent
```

Les handoffs sont utiles pour une conversation utilisateur ou une investigation interactive, mais moins adaptés au pipeline batch où l'orchestrateur doit garder le contrôle.

### 4. Structured Outputs partout où un JSON est attendu

Tout objet métier attendu par le backend doit être produit via Structured Outputs:

- `MatchAnalysis`
- `AnalysisCandidate`
- `SelectionResult`
- `QualityReview`
- `RoutingDecision`
- `QualitativeSignalReport`

Le parsing libre et la réparation JSON doivent devenir des fallback legacy, pas le chemin nominal.

### 5. Le coût se pilote avant l'appel, pas seulement après

Le coût doit être piloté avec:

- estimation/token counting avant appel;
- routage modèle selon complexité;
- prompts compacts;
- output court;
- batch/flex pour les jobs non interactifs;
- cache-friendly inputs;
- refus d'analyser les matchs à faible valeur.

## Architecture cible proposée

### Vue d'ensemble

```text
Coverage + Strategy
-> Data Acquisition
-> Context Normalization
-> AI Routing / Budget Gate
-> Match Analysis Agents
-> Candidate Aggregation
-> Market + Risk Validation Agent
-> Ticket Selection Agent
-> QA / Audit Agent
-> Run Artifacts + UI
```

### Nouveau rôle: AI Workflow Manager

Créer un module dédié:

```text
betauto/ai_workflow/
  models.py
  openai_responses_client.py
  budget.py
  routing.py
  agents/
    match_scout.py
    match_analyst.py
    qualitative_researcher.py
    market_validator.py
    ticket_selector.py
    qa_auditor.py
  prompts/
  evals/
```

Ce module ne remplace pas immédiatement `analysis_engine`; il l'encapsule progressivement.

### Contrats de sortie cible

#### RoutingDecision

But: décider si un match mérite un appel IA coûteux.

Champs:

- `fixture_id`
- `route`: `skip`, `cheap_analysis`, `standard_analysis`, `deep_analysis`
- `reason`
- `data_quality_estimate`
- `missing_critical_data`
- `recommended_model_profile`
- `max_output_tokens`

Règle: ce routeur peut être entièrement déterministe au début. L'IA n'est pas nécessaire pour tous les cas.

#### MatchAnalysisV2

Evolution de `MatchAnalysis`:

- ajouter `evidence_map`;
- ajouter `missing_data`;
- ajouter `no_bet_reason`;
- distinguer `data_quality` et `prediction_confidence`;
- imposer `predicted_markets[].source_evidence_ids`;
- interdire tout marché non présent dans `allowed_markets`.

#### CandidateReview

But: valider les candidats avant sélection.

Champs:

- `candidate_id`
- `verdict`: `retain`, `downgrade`, `reject`
- `risk_flags`
- `confidence_adjustment`
- `reason`

#### SelectionResultV2

Evolution de `SelectionResult`:

- `selection_policy_applied`
- `portfolio_correlation_notes`
- `rejected_candidate_ids`
- `confidence_calibration`
- `budget_metadata`

#### RunQualityAudit

But: vérifier le run après coup.

Champs:

- `schema_valid`
- `strategy_compliant`
- `hallucination_risk`
- `unsupported_claims`
- `cost_outliers`
- `recommended_action`: `accept`, `review`, `reject`

## Agents proposés

### 1. Match Scout

Rôle: pré-trier les matchs et éviter les appels coûteux inutiles.

Implémentation initiale recommandée: déterministe, sans LLM.

Entrées:

- contexte compact fixture;
- stratégie;
- coverage;
- présence odds;
- qualité des données.

Sortie:

- `RoutingDecision`.

Règles:

- skip si données minimales absentes;
- cheap si match peu documenté mais exploitable;
- standard si données suffisantes;
- deep si fort enjeu, bonnes odds, compétition prioritaire ou signaux contradictoires.

Modèle:

- aucun modèle au début;
- optionnellement `gpt-5.4-nano` pour classer des cas ambigus si nécessaire.

### 2. Match Analyst

Rôle: produire l'analyse sportive structurée d'un match.

Pattern:

- agent spécialisé ou simple Responses call avec structured output;
- pas besoin de handoff;
- appelé par le manager comme capacité bornée.

Entrées:

- `compact_match_context`;
- stratégie;
- marchés autorisés;
- budget de sortie.

Sortie:

- `MatchAnalysisV2`.

Modèles recommandés:

- `gpt-5.4-mini` pour le standard;
- `gpt-5.4` ou `gpt-5.5` seulement pour deep analysis, finales, derbies à fort enjeu, ou arbitrage difficile;
- `gpt-5.4-nano` pour résumés/normalisations simples, pas pour décision principale.

Paramètres:

- `reasoning.effort`: `low` pour cheap, `medium` pour standard, `high` pour deep;
- output court et structuré;
- `store: false` par défaut si pas besoin de state serveur.

### 3. Qualitative Researcher

Rôle: enrichir certains matchs avec signaux qualitatifs.

Attention: ce n'est pas à activer partout. Il peut exploser le coût et introduire du bruit.

Sources possibles:

- web search OpenAI pour actualités récentes;
- file search si BetAuto stocke une base documentaire validée;
- MCP interne plus tard pour sources partenaires;
- Browser Use hors OpenAI si nécessaire pour sites non API.

Déclenchement:

- uniquement route `deep_analysis`;
- uniquement compétitions prioritaires;
- uniquement si la stratégie autorise les signaux qualitatifs;
- jamais pour remplacer une donnée API-Football absente.

Sortie:

- `QualitativeSignalReport` avec citations/sources, date, niveau de confiance et impact.

Garde-fous:

- toute affirmation doit être sourcée;
- signal non sourcé = ignoré;
- ne jamais inventer une blessure, suspension ou météo;
- distinguer information confirmée, rumeur, contexte faible.

### 4. Market & Risk Validator

Rôle: auditer les candidats générés avant la sélection finale.

Entrées:

- candidates agrégés;
- stratégie;
- dictionnaire de marchés;
- odds disponibles;
- qualité des données.

Sortie:

- retained/rejected/downgraded candidates;
- raisons explicites.

Modèle:

- `gpt-5.4-mini` ou même logique déterministe au début;
- escalade vers `gpt-5.4` si contradictions ou ticket potentiel fort.

Remarque:

Une partie importante doit rester déterministe:

- marché autorisé;
- seuil confiance;
- data_quality minimale;
- odds range;
- max picks;
- doublons / corrélation simple.

L'IA doit aider à expliquer ou arbitrer, pas remplacer les règles.

### 5. Ticket Selector

Rôle: construire le combiné final.

Pattern:

- agent-as-tool appelé par manager;
- structured output obligatoire;
- prompt court parce que l'entrée doit déjà être filtrée.

Modèle:

- `gpt-5.4-mini` en standard;
- `gpt-5.4` ou `gpt-5.5` pour mode "premium/deep" seulement;
- fallback déterministe si aucun pick ou si coût dépassé.

Amélioration majeure:

Avant d'appeler le modèle, générer toutes les combinaisons plausibles par code, puis demander au modèle de choisir/justifier parmi un nombre limité de combos. Cela réduit tokens, hallucinations et coût.

### 6. QA / Audit Agent

Rôle: vérifier le run final ou un échantillon.

Déclenchement:

- systématique sur runs premium;
- échantillonné sur runs standard;
- obligatoire si `estimated_cost_usd` élevé, parsing retry, data_quality basse ou picks contradictoires.

Sortie:

- `RunQualityAudit`.

Modèle:

- `gpt-5.4-mini` pour audit simple;
- `gpt-5.4` pour audit critique.

## Stratégie modèles et coût

Les modèles et prix changent; les valeurs ci-dessous sont basées sur la page officielle consultée le 2026-05-01.

### Modèles OpenAI pertinents

| Usage BetAuto | Modèle recommandé | Pourquoi |
| --- | --- | --- |
| Classification, routing, résumé très simple | `gpt-5.4-nano` | Coût minimal, bon pour tâches bornées. |
| Analyse match standard | `gpt-5.4-mini` | Bon compromis coût/qualité/latence. |
| Analyse profonde ou arbitrage difficile | `gpt-5.4` | Plus robuste quand le contexte est ambigu. |
| Audit premium, raisonnement complexe rare | `gpt-5.5` | A réserver aux cas à forte valeur. |
| Pro / très long / très critique | `gpt-5.5-pro` | A éviter en routine; coût et latence élevés. |

### Politique de routage coût/qualité

Proposition de profils:

```text
cheap:
  model: gpt-5.4-nano
  reasoning_effort: low
  max_output_tokens: très court
  usage: routing, résumé, labels

standard:
  model: gpt-5.4-mini
  reasoning_effort: low ou medium
  usage: analyse match normale, sélection standard

deep:
  model: gpt-5.4
  reasoning_effort: medium/high
  usage: matchs prioritaires, signaux contradictoires

premium_audit:
  model: gpt-5.5
  reasoning_effort: medium/high
  usage: audit final rare ou run à forte valeur
```

### Règles budget

Ajouter une configuration:

```json
{
  "ai_budget": {
    "max_run_cost_usd": 1.50,
    "max_match_cost_usd": 0.08,
    "default_profile": "standard",
    "deep_profile_max_matches": 3,
    "qa_sample_rate": 0.15,
    "stop_or_downgrade_on_budget_pressure": true
  }
}
```

Comportement attendu:

- si budget proche du plafond: downgrade `deep` vers `standard`;
- si budget dépassé: arrêter les nouveaux appels IA et produire un run partiel explicite;
- si match à faible data_quality: skip ou cheap, jamais deep;
- si aucun odds exploitable: analyse seulement si stratégie le permet.

### Batch, Flex et mode synchrone

Pour `/analysis` interactif:

- garder appels synchrones ou background orchestrateur interne;
- afficher progression live;
- utiliser pacing et budget.

Pour scans nocturnes / couverture large:

- envisager Batch API ou Flex processing;
- accepter une latence plus grande contre coût réduit;
- conserver les mêmes artefacts de run.

## Réduction de tokens

### Court terme

- Remplacer `indent=2` par JSON compact pour les prompts envoyés au modèle, tout en gardant les artefacts lisibles sur disque.
- Séparer `instructions` et `input` dans Responses au lieu d'un seul prompt monolithique.
- Limiter les listes selon utilité métier, pas juste taille arbitraire.
- Ne pas envoyer `odds` complètes si seuls certains marchés sont autorisés.
- Ne pas envoyer injuries/lineups vides.
- Ajouter un champ `evidence_id` côté contexte pour référencer des blocs courts.

### Moyen terme

- Utiliser l'API de token counting avant appel pour router ou refuser un prompt trop gros.
- Mesurer input/output/cached tokens par étape.
- Construire une représentation "analysis_context_minimal" spécifique LLM.
- Garder une version "full context" pour audit, pas pour chaque appel.

### Long terme

- Utiliser file search/vector store pour documentation stable, dictionnaires de marchés, règles BetAuto, plutôt que les réinjecter dans chaque prompt.
- Utiliser tool search quand de nombreux outils seront disponibles, afin de ne pas charger toutes les définitions d'outils dans chaque requête.
- Utiliser compaction seulement pour workflows conversationnels longs; le pipeline batch par match n'en a pas besoin dans sa forme actuelle.

## Outils OpenAI à exploiter ou éviter

### Responses API

Priorité haute.

BetAuto l'utilise déjà via `client.responses.create`, mais doit aller plus loin:

- `instructions` séparées;
- `input` structuré;
- Structured Outputs;
- éventuellement `store: false`;
- usage détaillé;
- token counting.

### Agents SDK

Priorité moyenne, à introduire progressivement.

Bon usage:

- tracer des spécialistes;
- agents-as-tools;
- structured outputs par agent;
- guardrails;
- runtime Python avec état local clair.

Mauvais usage:

- remplacer l'orchestrateur strict par un agent autonome qui décide tout;
- multiplier les agents sans contrat différent;
- laisser le modèle appeler des outils qui modifient des données sans approbation.

### Function calling

Priorité haute pour les outils internes.

Outils candidats:

- `get_fixture_context(fixture_id)`
- `get_market_dictionary()`
- `get_strategy_constraints(strategy_id)`
- `get_odds_summary(fixture_id, allowed_markets)`
- `record_candidate_review(candidate_id, verdict)`

Au début, ces fonctions peuvent rester côté application, pas forcément exposées au modèle si l'entrée est déjà préparée.

### File search

Priorité moyenne.

Utile pour:

- documentation API-Football;
- dictionnaire de marchés;
- stratégie et règles internes;
- historique d'analyses validées.

Attention:

- éviter d'y mettre des artefacts volatils de runs sans politique de rétention;
- ne pas faire dépendre l'analyse d'une recherche documentaire non déterministe pour les données sportives factuelles.

### Web search

Priorité faible à moyenne.

Utile seulement pour:

- qualitative researcher;
- news/injuries/contexte récent, si sources fiables;
- mode deep/premium.

Ne pas l'utiliser pour:

- remplacer API-Football;
- enrichir tous les matchs;
- produire des affirmations sans source.

### Tool search

Priorité future.

Utile quand BetAuto aura beaucoup d'outils ou MCPs. Aujourd'hui, le nombre d'outils cible reste limité. A envisager plus tard pour réduire tokens si l'agent voit de nombreux outils.

### Skills

Priorité moyenne pour codifier les pratiques.

Skills BetAuto potentielles:

- `betauto-football-analysis`
- `betauto-market-dictionary`
- `betauto-risk-policy`
- `betauto-openai-cost-control`
- `betauto-api-football-usage`

Important: les skills doivent être contrôlées par l'équipe, pas sélectionnées librement par un utilisateur final.

## Plan d'implémentation

### Phase 0 - Documentation et garde-fous

Objectif: rendre la stratégie IA explicite avant de coder.

Actions:

1. Ajouter ce document comme référence.
2. Ajouter un README dans `docs/api-openai/` pointant vers ce plan.
3. Ajouter une note dans `AGENTS.md`: avant de modifier OpenAI, consulter `docs/api-openai/`.
4. Inventorier les variables `.env` IA actuelles.
5. Définir les profils modèles dans un fichier de config.

Livrables:

- `docs/api-openai/betauto_ai_workflow_plan.md`
- `config/ai/model_profiles.json`
- documentation `.env`.

### Phase 1 - Responses + Structured Outputs sans changer le workflow

Objectif: améliorer fiabilité et coût sans refactor agentique.

Actions:

1. Créer `betauto/ai_workflow/openai_responses_client.py`.
2. Ajouter une méthode `create_structured_response_with_retry`.
3. Remplacer le parsing JSON libre de `match_analyzer.py` par `responses.parse` ou `text.format` avec schéma Pydantic/JSON schema.
4. Faire pareil pour `selection_engine/selector.py`.
5. Garder l'ancien parser comme fallback temporaire derrière feature flag.
6. Ajouter `store=false` configurable.
7. Passer `instructions` et `input` séparément.

Critère de succès:

- moins de retries JSON;
- moins de code de réparation;
- mêmes artefacts de sortie;
- build/tests existants inchangés.

### Phase 2 - Budgeting et routing déterministe

Objectif: réduire le nombre d'appels coûteux.

Actions:

1. Créer `betauto/ai_workflow/budget.py`.
2. Créer `betauto/ai_workflow/routing.py`.
3. Ajouter `RoutingDecision` par match dans `analysis_context` ou `match_analysis`.
4. Implémenter règles:
   - skip données insuffisantes;
   - cheap si contexte faible;
   - standard par défaut;
   - deep si priorité + qualité + potentiel.
5. Ajouter estimation de coût avant appel avec token counting quand disponible.
6. Ajouter `max_run_cost_usd`.
7. Exposer budget et décisions dans `run_summary.json`.

Critère de succès:

- baisse du coût moyen par run;
- logs compréhensibles: pourquoi un match a été skipped/downgraded;
- aucun effet sur la cohérence stricte des artefacts.

### Phase 3 - Profils modèles par tâche

Objectif: payer le bon modèle au bon endroit.

Actions:

1. Ajouter config:

```json
{
  "profiles": {
    "routing": {"model": "gpt-5.4-nano", "reasoning_effort": "low"},
    "match_standard": {"model": "gpt-5.4-mini", "reasoning_effort": "medium"},
    "match_deep": {"model": "gpt-5.4", "reasoning_effort": "medium"},
    "selection": {"model": "gpt-5.4-mini", "reasoning_effort": "medium"},
    "qa": {"model": "gpt-5.4-mini", "reasoning_effort": "low"}
  }
}
```

2. Remplacer `OPENAI_ANALYSIS_MODEL` unique par un resolver:
   - env override;
   - strategy override;
   - profile default.
3. Enregistrer le profil utilisé par match.
4. Ajouter statistiques coût par profil.

Critère de succès:

- coût par étape visible;
- possibilité de downgrade sans code change;
- pas de modèle implicite caché.

### Phase 4 - Agents SDK en mode borné

Objectif: introduire agents spécialisés sans perdre le contrôle BetAuto.

Actions:

1. Ajouter dépendance Python `openai-agents` dans l'environnement backend si validé.
2. Créer agents:
   - `MatchAnalystAgent`;
   - `TicketSelectorAgent`;
   - `QualityAuditAgent`.
3. Les exposer comme fonctions internes appelées par l'orchestrateur.
4. Activer tracing OpenAI en environnement dev/staging.
5. Comparer sortie agent vs sortie Responses directe.

Décision après expérimentation:

- si Agents SDK apporte meilleure traçabilité/maintenabilité: continuer;
- si overhead trop élevé: garder Responses direct pour batch et réserver Agents SDK aux workflows interactifs.

### Phase 5 - Qualitative Researcher contrôlé

Objectif: enrichir les meilleurs matchs sans polluer tout le pipeline.

Actions:

1. Définir `QualitativeSignalReport`.
2. Ajouter flag stratégie `allow_qualitative_research`.
3. Activer seulement sur route `deep_analysis`.
4. Utiliser web search ou MCP/source validée avec citations.
5. Injecter le rapport dans `MatchAnalysisV2`.
6. Afficher sources et niveau de confiance dans l'UI.

Critère de succès:

- signaux sourcés;
- coût limité;
- aucune invention;
- amélioration mesurable sur les picks retenus.

### Phase 6 - Evals et prompt lifecycle

Objectif: pouvoir changer de modèle ou prompt sans piloter à l'instinct.

Actions:

1. Construire un dataset d'évaluation:
   - 30 matchs standards;
   - 10 matchs pauvres en données;
   - 10 matchs riches;
   - 10 cas pièges.
2. Définir métriques:
   - schema_valid_rate;
   - strategy_compliance_rate;
   - hallucination_flags;
   - no_bet_quality;
   - average_cost_per_success;
   - selected_pick_precision proxy;
   - confidence calibration.
3. Ajouter un runner d'evals local.
4. Comparer modèles/profils.
5. Versionner prompts et schemas.
6. Option: migrer prompts stables vers stored prompts OpenAI.

Critère de succès:

- toute migration modèle a un rapport avant/après;
- les coûts sont comparés par qualité utile, pas seulement par token.

## Changements concrets recommandés dans le code

### `betauto/api_clients/openai_client.py`

Ajouter:

- support `instructions`;
- support `text.format` / structured outputs;
- support `reasoning`;
- support `store`;
- support `metadata`;
- extraction de `cached_input_tokens` si exposé;
- fonction de token counting.

Conserver:

- retry/backoff actuel;
- mapping d'erreurs;
- callback de logs.

### `betauto/analysis_engine/match_analyzer.py`

Remplacer progressivement:

- prompt monolithique -> instructions + input JSON;
- parsing regex -> Structured Outputs;
- fallback minimal -> fallback typé `MatchAnalysisResult(status=failed)`;
- modèle hard fallback `gpt-4.1-mini` -> resolver de profil.

Ajouter:

- `routing_decision`;
- `model_profile`;
- `budget_metadata`;
- `structured_output_version`.

### `betauto/selection_engine/selector.py`

Remplacer:

- JSON repair nominal -> Structured Outputs nominal;
- retry "fix ONLY JSON" -> retry API/structured only.

Ajouter:

- pré-calcul déterministe des combinaisons plausibles;
- entrée réduite pour le modèle;
- audit des picks exclus.

### `betauto/orchestrator/runner.py`

Ajouter étapes:

```text
ai_routing
match_analysis
candidate_validation
selection
qa_audit
```

Chaque étape doit écrire:

- statut;
- coût estimé/réel;
- modèle/profil;
- input token count si disponible;
- raison de skip/downgrade.

### Frontend `/analysis`

Ajouter dans Run Output Inspector:

- coût par étape/profil;
- route par match: skip/cheap/standard/deep;
- erreurs de garde-fou;
- audit final;
- sources qualitatives si présentes.

## Politique de sécurité et qualité

### Données sportives

- API-Football reste source factuelle principale.
- Les sources web ne remplacent jamais API-Football.
- Les signaux qualitatifs doivent être sourcés et datés.
- Les données absentes doivent rester absentes.

### Actions sensibles

- Aucune action financière réelle ne doit être déclenchée par un agent.
- Toute future intégration bookmaker doit être séparée de l'analyse.
- Les outils d'écriture doivent demander validation humaine.

### Hallucination

Contrôles obligatoires:

- marché dans dictionnaire;
- sélection dans dictionnaire;
- fixture_id connu;
- confidence 0..100;
- data_quality enum;
- evidence disponible;
- pas de blessure/news non sourcée.

## Métriques à suivre

### Coût

- coût total run;
- coût par match analysé;
- coût par pick retenu;
- coût par modèle/profil;
- input/output/cached tokens;
- retries et backoff.

### Qualité

- taux de JSON/schema valid;
- taux de candidates retenus;
- taux de picks rejetés par QA;
- taux de no-bet;
- taux de sorties avec données inventées détectées;
- score d'audit.

### Produit

- temps jusqu'au premier output;
- durée run complète;
- nombre de runs stoppés;
- lisibilité UI des outputs;
- taux de runs `completed_no_data`.

## Roadmap proposée

### Court terme: 1 à 2 semaines

1. Ajouter profils modèles config.
2. Ajouter Structured Outputs pour match analysis.
3. Ajouter Structured Outputs pour selection.
4. Ajouter routing déterministe et budget run.
5. Ajouter coût par étape dans artefacts.

### Moyen terme: 3 à 6 semaines

1. Introduire Match Analyst Agent en expérimentation.
2. Ajouter QA/Audit Agent.
3. Ajouter pré-calcul déterministe des combinaisons.
4. Ajouter eval dataset + runner.
5. Ajouter token counting.

### Long terme: 2 à 3 mois

1. Qualitative Researcher avec sources.
2. File search pour documentation stable.
3. Tool search/MCP si l'écosystème d'outils grandit.
4. Batch/Flex pour scans larges.
5. Stored prompts + workflow de promotion prompt/model.

## Décision recommandée

Ne pas basculer immédiatement vers un système multi-agent complet. La meilleure trajectoire est:

1. Stabiliser le contrat OpenAI avec Responses + Structured Outputs.
2. Réduire le coût via routing + budgets + profils modèles.
3. Introduire des agents seulement là où ils apportent un vrai bénéfice: audit, deep analysis, qualitative research.
4. Garder le pipeline strict et les artefacts actuels comme colonne vertébrale.

Ce chemin permet de tirer parti des capacités OpenAI modernes sans sacrifier la traçabilité qui fait déjà la solidité de BetAuto.

## Sources locales

- `docs/api-openai/01-text-generation.md`
- `docs/api-openai/02-migrate-to-responses.md`
- `docs/api-openai/03-using-tools.md`
- `docs/api-openai/04-agents-sdk.md`
- `docs/api-openai/05-quickstart.md`
- `docs/api-openai/06-agent-definitions.md`
- `docs/api-openai/07-models-and-providers.md`
- `docs/api-openai/08-orchestration-and-handoffs.md`
- `docs/api-openai/09-skills.md`
- `docs/api-openai/second_wave_exact.md`
- `docs/api-openai/third_wave.md`

## Sources officielles consultées

- OpenAI Models: https://developers.openai.com/api/docs/models
- OpenAI Pricing: https://developers.openai.com/api/docs/pricing
- Migrate to Responses API: https://developers.openai.com/api/docs/guides/migrate-to-responses
- Structured Outputs: https://developers.openai.com/api/docs/guides/structured-outputs
- Agents SDK Quickstart: https://developers.openai.com/api/docs/guides/agents/quickstart
- Agents Orchestration and handoffs: https://developers.openai.com/api/docs/guides/agents/orchestration
- Using tools: https://developers.openai.com/api/docs/guides/tools
