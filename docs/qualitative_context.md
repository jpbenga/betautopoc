# Qualitative Context

## But

`qualitative_context` est la couche de contexte non-API-Football destinee a enrichir l'analyse d'un match avec des signaux documentaires ou editoriaux.

Cette couche ne doit jamais remplacer les donnees factuelles du pipeline quantitatif. Elle sert a porter:

- les medias de reference prioritaires de la competition;
- les sources effectivement consultees;
- les signaux qualitatifs extraits;
- les dimensions encore manquantes;
- le statut de collecte qualitative.

## Principe de workflow

Pour un match de Ligue 1 ou de J1 League, le prompt ne doit pas contenir d'annuaire geant de medias. La logique correcte est:

1. BetAuto identifie la competition via `league_id`.
2. BetAuto associe les medias prioritaires de cette competition dans `qualitative_context.preferred_media`.
3. Une future brique de collecte qualitative tente d'abord de chercher du contexte dans ces sources prioritaires.
4. Si des signaux fiables sont trouves, ils sont normalises dans `qualitative_context.consulted_sources` et `qualitative_context.signals`.
5. Le prompt consomme uniquement ce qui existe deja dans `qualitative_context`.

## Structure recommandee

### `preferred_media`

Liste des medias de reference a privilegier pour la competition.

Champs:

- `source_id`: identifiant documentaire interne, ex. `MED-033`
- `media_name`
- `media_type`: ex. `press`
- `priority_rank`
- `language`
- `scope`: typiquement `league`
- `reliability`: ex. `preferred_reference`

### `consulted_sources`

Liste des sources effectivement consultees pour le match.

Champs:

- `source_id`
- `media_name`
- `url`
- `published_at`
- `language`
- `scope`
- `reliability`

### `signals`

Liste des signaux qualitatifs normalises.

Champs:

- `signal_id`
- `category`
- `summary`
- `impact`: `positive`, `negative`, `neutral`, `mixed`
- `confidence`: `high`, `medium`, `low`, `unknown`
- `team_scope`: `home`, `away`, `both`, `match`
- `source_ids`
- `evidence`

### `collection_status`

Valeurs recommandees:

- `not_collected`
- `manual_only`
- `partial`
- `completed`
- `failed`

### `missing_dimensions`

Liste des angles qualitatifs encore absents, par exemple:

- `team_news`
- `coach_quotes`
- `travel_fatigue`
- `weather`
- `schedule_pressure`
- `motivation_context`

## Regles d'usage

- Si `collection_status = not_collected`, le prompt doit traiter le qualitatif comme absent.
- Si des `signals` existent sans `source_ids`, ils doivent etre consideres comme faibles ou incomplets.
- Les medias de `preferred_media` servent d'ordre de priorite, pas de preuve a eux seuls.
- Aucun signal qualitatif ne doit etre invente par le modele si la collecte amont n'a rien fourni.

## Etat actuel

Dans l'etat actuel du projet:

- `preferred_media` peut etre pre-rempli a partir de la ligue;
- `consulted_sources` et `signals` sont encore vides par defaut;
- le pipeline quantitatif reste la seule source active pour l'analyse match par match.
