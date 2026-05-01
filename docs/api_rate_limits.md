# Gestion des rate limits API (OpenAI + API-Football)

## Pourquoi les rate limits arrivent

Les erreurs 429 arrivent lorsqu'on dépasse les limites du provider. Avec OpenAI, cela peut arriver même avec peu de requêtes si chaque requête consomme beaucoup de tokens.

## RPM vs TPM

- **RPM (Requests Per Minute)** : nombre d'appels/minute.
- **TPM (Tokens Per Minute)** : volume de tokens/minute.

Un batch séquentiel peut rester bas en RPM mais exploser le TPM si les prompts sont trop longs.

## Stratégie implémentée

- **Retry automatique** sur erreurs temporaires (429/5xx/timeout/réseau).
- **Exponential backoff** pour espacer les tentatives.
- **Jitter** pour éviter que plusieurs retries tombent en même temps.
- **Respect de `Retry-After`** quand l'API le fournit.
- **Pacing inter-appels** configurable.
- **Limite batch** via `--max-matches` ou `OPENAI_BATCH_MAX_MATCHES`.
- **Compactage du contexte** envoyé au LLM pour réduire le volume token.

## Variables `.env`

### OpenAI

- `OPENAI_MAX_RETRIES` (défaut: 5)
- `OPENAI_INITIAL_BACKOFF_SECONDS` (défaut: 2)
- `OPENAI_MAX_BACKOFF_SECONDS` (défaut: 60)
- `OPENAI_TIMEOUT_SECONDS` (défaut: 120)
- `OPENAI_SLEEP_BETWEEN_MATCHES_SECONDS` (défaut: 5)
- `OPENAI_BATCH_MAX_MATCHES` (optionnel)

### API-Football

- `API_FOOTBALL_MAX_RETRIES` (défaut: 4)
- `API_FOOTBALL_INITIAL_BACKOFF_SECONDS` (défaut: 1)
- `API_FOOTBALL_MAX_BACKOFF_SECONDS` (défaut: 30)
- `API_FOOTBALL_TIMEOUT_SECONDS` (défaut: 30)
- `API_FOOTBALL_SLEEP_BETWEEN_REQUESTS_SECONDS` (défaut: 0.25)
- `API_FOOTBALL_DAILY_QUOTA` (informatif)

Les fréquences officielles par endpoint sont synthétisées dans `docs/api-football/endpoint-reference.md`. Les règles d'appel à respecter côté code sont dans `docs/api-football/usage-rules.md`.

## Bonnes pratiques

- Tester d'abord avec `--max-matches 1`.
- Augmenter `--sleep-between-matches` en cas de 429.
- Utiliser un modèle plus léger si nécessaire.
- Réduire le contexte envoyé quand un match est trop verbeux.
