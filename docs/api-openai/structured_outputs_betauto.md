# Structured Outputs pour BetAuto

Date: 2026-05-01

Ce document synthétise les points de la documentation OpenAI Structured Outputs qui ont un impact direct sur BetAuto.

## Ce que dit la documentation OpenAI

Les points utiles pour BetAuto sont les suivants:

1. Il faut privilégier Structured Outputs plutôt que JSON mode quand on attend un objet métier strict.
2. Avec la Responses API, la voie recommandée est `client.responses.parse(...)`.
3. Le SDK Python sait parser directement vers un modèle Pydantic.
4. Les refus du modèle ne suivent pas forcément le schéma attendu; ils doivent être gérés explicitement via `refusal`.
5. Les schémas doivent être compatibles avec le moteur Structured Outputs d'OpenAI, pas seulement valides au sens JSON Schema ou Pydantic.

## Conséquences pour BetAuto

Avant cette correction, BetAuto faisait ceci:

- `responses.create(...)`
- récupération de `output_text`
- `json.loads(...)`
- fallback regex / réparation JSON

Cette approche restait fragile:

- erreurs de format JSON;
- schémas trop permissifs;
- retries et normalisations inutiles;
- absence de gestion explicite des refus.

La bonne approche pour BetAuto est:

1. utiliser `responses.parse(...)`;
2. fournir un modèle Pydantic strict;
3. lire l'objet `parsed` retourné par le SDK;
4. détecter explicitement les items `refusal`;
5. garder un fallback legacy temporaire pendant la migration.

## Trois corrections à appliquer

### 1. Utiliser `responses.parse`

Au lieu d'envoyer un `text.format` JSON Schema construit à la main puis de parser le texte, il faut utiliser le helper natif du SDK:

- `client.responses.parse(...)`
- `text_format=MyPydanticModel`

Cela évite une partie de la divergence entre schéma JSON et types Python.

### 2. Fermer les schémas

Les modèles destinés à Structured Outputs doivent être stricts:

- `extra="forbid"` sur les modèles Pydantic;
- pas d'objets ouverts de type `dict[str, Any]` quand ce n'est pas nécessaire;
- privilégier des sous-modèles explicites.

Exemple de cause racine rencontrée dans BetAuto:

- OpenAI a rejeté le schéma `match_analysis` avec:
  - `additionalProperties is required to be supplied and to be false`

Cela montre qu'un schéma Pydantic acceptable pour l'application n'est pas automatiquement acceptable pour Structured Outputs.

### 3. Gérer les refus explicitement

Avec Structured Outputs, un refus peut apparaître comme un item `refusal` dans la réponse.

BetAuto doit donc:

- inspecter `response.output`;
- détecter `item.type == "refusal"`;
- remonter cette information comme une erreur fonctionnelle claire;
- éviter de traiter un refus comme un objet JSON mal formé.

## Règles de modélisation recommandées pour BetAuto

Pour les sorties structurées:

- `MatchAnalysis` doit être un objet fermé.
- `SelectionResult` doit être un objet fermé.
- `SelectionConfig` doit être typé explicitement, pas porté par `dict[str, Any]`.
- `evidence_summary` doit être un sous-objet borné.
- `rejected_candidates` doit être une liste de sous-objets bornés.

## Stratégie de migration retenue

Migration progressive recommandée:

1. brancher `responses.parse`;
2. fermer les modèles Pydantic;
3. gérer les refus;
4. conserver un fallback legacy derrière feature flag;
5. observer les runs réels;
6. supprimer ensuite le fallback quand les sorties structurées sont stables.

## Variables utiles

- `OPENAI_USE_STRUCTURED_OUTPUTS`
- `OPENAI_STRUCTURED_FALLBACK_TO_LEGACY`
- `OPENAI_RESPONSES_STORE`

## Résumé

Pour BetAuto, Structured Outputs n'est pas juste une amélioration de prompt. C'est un changement de contrat API:

- l'API doit valider la forme;
- les modèles doivent être fermés;
- le code doit consommer `parsed` et `refusal`;
- le fallback legacy doit rester temporaire.
