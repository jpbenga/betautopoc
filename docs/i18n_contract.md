# Contrat i18n BetAuto - Pass 0

Ce document fige le socle i18n sans migrer l'interface. Le Pass 0 cree les ressources, les conventions et la taxonomie canonique; il ne branche pas encore une librairie de traduction globale.

## Langues supportees

- `fr`: langue par defaut et langue de fallback.
- `en`: langue secondaire cible.

Toute nouvelle cle doit etre ajoutee dans les deux langues avant usage UI.

## Traduit vs non traduit

Traduit cote frontend:

- labels de navigation;
- libelles generiques d'actions, etats, erreurs et empty/loading states;
- labels metier derives de codes canoniques: `status`, `risk_level`, `confidence_tier`, `market_canonical_id`, `rejection_reasons`, `data_quality`, `capability.status`.

Non traduit par ce contrat:

- prompts LLM et textes envoyes au modele;
- IDs techniques, IDs de jobs, run IDs, fixture IDs, endpoints, chemins de fichiers;
- codes canoniques transportes par API;
- donnees fournisseur ou bookmaker quand elles representent un nom propre ou un libelle source;
- textes libres d'audit/logs existants tant qu'ils ne sont pas exposes comme labels UI stables.

## Convention backend code+params

Les APIs doivent progressivement exposer les messages UI sous forme structurée:

```json
{
  "code": "low_confidence",
  "params": {
    "min": 65,
    "actual": 58
  },
  "detail": "Legacy human-readable detail kept during migration"
}
```

Regles:

- `code` est stable, en `snake_case`, et ne doit pas etre traduit.
- `params` contient uniquement des primitives serialisables (`string`, `number`, `boolean`, `null`) ou des tableaux/objets simples.
- `detail` est optionnel et legacy; il peut rester utile pour logs, debug ou compatibilite, mais l'UI ne doit pas en dependre pour les nouveaux usages.
- Les erreurs HTTP communes utilisent `ApiError.error` comme message/code existant; Pass 1 pourra ajouter un champ dedie `code` partout ou la source est claire.

## Regles pour les labels UI

- L'UI affiche un label traduit quand la valeur vient d'une taxonomie connue.
- Si une cle manque, l'UI doit fallback vers `fr`, puis vers le code brut uniquement en dernier recours.
- Les labels metier ne doivent pas etre reconstruits par concaténation fragile. Preferer une cle explicite avec `params` pour les valeurs dynamiques.
- Les labels qui representent un statut, un risque, un marche ou une qualite de donnees doivent provenir des namespaces i18n ci-dessous.

## IDs canoniques non traduits

Les champs suivants restent des codes canoniques dans les contrats API et artefacts:

- `status`
- `risk_level`
- `combo_risk_level`
- `confidence_tier`
- `market_canonical_id`
- `selection_canonical_id`
- `rejection_reasons[]`
- `data_quality`
- `date_consistency_status`
- `capabilities[].status`

Ces valeurs peuvent etre affichees traduites, mais elles ne doivent jamais etre modifiees ou localisees dans les payloads.

## Namespaces frontend

Les ressources vivent dans `frontend/src/assets/i18n/{lang}/`.

- `common.json`: actions, labels generiques, empty/loading states, qualite de donnees.
- `nav.json`: navigation principale.
- `status.json`: statuts transverses et etats de capabilities.
- `risk.json`: niveaux de risque.
- `confidence.json`: tiers de confiance.
- `market.json`: labels des marches connus.
- `errors.json`: erreurs generiques et raisons de rejet.

## Convention de cles

- Langues: ISO court en minuscule (`fr`, `en`).
- Fichiers: namespace en `snake_case` si necessaire.
- Cles: `snake_case`.
- Pas de phrase entiere comme cle.
- Les codes backend sont reutilises tels quels quand ils existent deja (`low_confidence`, `match_winner`, `very_strong`).
- Les nouvelles cles de labels generiques doivent rester courtes et stables.

## Taxonomie canonique

### Status

Codes transverses acceptes:

- `active`
- `available`
- `blocked`
- `completed`
- `completed_no_data`
- `configured`
- `disabled`
- `done`
- `enabled`
- `error`
- `failed`
- `missing`
- `no_data`
- `partial`
- `pending`
- `planned`
- `running`
- `skipped`
- `success`
- `unavailable`
- `unknown`
- `watch`

Les aliases historiques comme `succeeded`, `safe`, `unsafe`, `read-only`, `guarded`, `armed`, `simulated`, `estimated`, `placeholder`, `requested`, `off`, `env` restent toleres en lecture tant que les ecrans ne sont pas migres. Ils ne doivent pas devenir de nouveaux codes canoniques sans mise a jour de ce document.

### Risk

- `low`
- `medium`
- `high`
- `unknown`

### Confidence tiers

Seuils existants:

- `elite`: score >= 90
- `very_strong`: score 80-89
- `strong`: score 70-79
- `medium`: score 60-69
- `weak`: score 50-59
- `very_weak`: score < 50
- `unknown`: score absent ou non interpretable

### Market labels

Marches canoniques connus pour le Pass 0:

- `match_winner`
- `home_away`
- `double_chance`
- `both_teams_to_score`
- `goals_over_under`
- `over_1_5_goals`
- `over_2_5_goals`
- `under_3_5_goals`
- `under_4_5_goals`
- `unknown_market`

Les labels fournisseur comme `Match Winner`, `Goals Over/Under` ou les aliases bookmaker restent des donnees source; l'UI doit privilegier `market_canonical_id` quand il est present.

### Rejection reasons

Raisons canoniques:

- `low_confidence`
- `missing_odds`
- `low_data_quality`
- `disallowed_market`
- `unknown_market`
- `strategy_disabled`
- `insufficient_candidates`

### Capability states

Etats canoniques de `capabilities[].status`:

- `available`
- `partial`
- `planned`

### Data quality

- `low`
- `medium`
- `high`
- `unknown`

## Pass 1 attendu

- Ajouter un service frontend minimal de chargement/fallback i18n si necessaire.
- Brancher d'abord les composants transverses (`StatusBadge`, navigation, erreurs API).
- Migrer les labels metier ecran par ecran, en gardant les codes API inchanges.
- Ajouter un controle CI qui verifie la parite des cles `fr`/`en`.
