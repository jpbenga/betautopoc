# BetAuto — POC réel : GPT web search + Browser Use Unibet

Ce POC correspond au besoin suivant :

```text
1. GPT analyse les matchs de demain.
2. GPT génère des picks.
3. Les picks doivent former un combiné cible entre 2.80 et 3.50.
4. Maximum 5 matchs.
5. Browser Use va sur Unibet.
6. Browser Use retrouve les rencontres.
7. Browser Use lit les cotes Unibet publiques au moment de la recherche.
8. Browser Use ajoute les sélections dans le panier sans valider le pari.
9. Browser Use produit un JSON de vérification.
```

L'interface HTML avec Tailwind CDN permet de :

```text
- lancer le process ;
- voir les logs étape par étape ;
- lire l'analyse de chaque match ;
- voir le combiné final ;
- voir les étapes Browser Use sur Unibet ;
- voir la comparaison des cotes ;
- ouvrir les fichiers JSON générés.
```

## Ce que ce POC ne contient pas

- Pas de base de données.
- Pas de JSON fourni à l'avance.
- Pas de mock de cote.
- Pas de connexion à un compte.
- Pas de mot de passe.
- Pas de validation de coupon (mise non confirmée).

Les fichiers JSON sont créés uniquement au moment de l'exécution dans :

```text
runs/<job_id>/picks.json
runs/<job_id>/unibet_verification.json
```

## Modèle GPT pour rechercher sur Internet

Dans l'API OpenAI, le modèle ne recherche pas Internet “tout seul” par défaut.

La bonne approche est :

```text
Responses API + outil web_search
```

Le POC utilise par défaut :

```text
OPENAI_ANALYSIS_MODEL=gpt-5.5
```

Tu peux changer ce modèle dans `.env` selon ton accès :

```text
OPENAI_ANALYSIS_MODEL=gpt-5.5
OPENAI_ANALYSIS_MODEL=gpt-5
OPENAI_ANALYSIS_MODEL=gpt-4.1
OPENAI_ANALYSIS_MODEL=gpt-4o
```

La partie Browser Use utilise par défaut :

```text
OPENAI_BROWSER_MODEL=gpt-4.1
```

## Installation

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Renseigne ensuite :

```text
OPENAI_API_KEY=...
```

## Lancement

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Ouvre ensuite :

```text
http://localhost:8000
```

Clique sur :

```text
Lancer le process
```

## Fonctionnement interne

### Étape 1 — Analyse GPT avec recherche web

Le backend lit :

```text
prompts/master_analysis_prompt.txt
```

Il ajoute le contexte runtime :

```text
- date actuelle ;
- date cible de demain ;
- timezone Europe/Paris ;
- cible de cote 2.80 à 3.50 ;
- maximum 5 picks.
```

Puis il appelle :

```python
client.responses.create(
    model="gpt-5.5",
    tools=[{"type": "web_search"}],
    input=prompt,
    text={"format": {"type": "json_schema", ...}}
)
```

Résultat généré :

```text
runs/<job_id>/picks.json
```

### Étape 2 — Vérification Browser Use sur Unibet

Le backend lit `picks.json`, puis construit une mission Browser Use.

Browser Use doit :

```text
- aller sur https://www.unibet.fr/ ;
- retrouver les compétitions ;
- retrouver les matchs ;
- retrouver les marchés ;
- lire les cotes ;
- comparer avec expected_odds_min ;
- produire un JSON structuré.
```

Résultat généré :

```text
runs/<job_id>/unibet_verification.json
```

## Fichiers importants

```text
main.py                              Backend FastAPI
schemas.py                           Schémas Pydantic
static/index.html                    Interface HTML Tailwind CDN
prompts/master_analysis_prompt.txt   Prompt maître expert
.env.example                         Configuration
requirements.txt                     Dépendances
```

## Debug

Si l'étape OpenAI échoue :

```text
- vérifie OPENAI_API_KEY ;
- vérifie que ton modèle a accès au web_search ;
- remplace gpt-5.5 par un modèle disponible sur ton compte.
```

Si Browser Use échoue :

```text
- vérifie que Browser Use est correctement installé ;
- lance le process avec un navigateur visible si nécessaire ;
- augmente max_steps dans main.py ;
- regarde les logs dans l'interface.
```

## Important

La clé API ne doit jamais être écrite dans le code.
Utilise toujours `.env`.
