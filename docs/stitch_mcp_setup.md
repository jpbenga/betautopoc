# Configuration locale Stitch MCP (BetAuto)

> Objectif : préparer l'accès local à Stitch MCP pour Codex **sans exposer de secret**.

## Méthode recommandée (API key)

Pour ce projet BetAuto, la méthode recommandée est l'**API key** (simple et adaptée au workflow d'audit/lecture Stitch).

### 1) Créer une API key dans Stitch Settings
1. Ouvrir Stitch.
2. Aller dans les paramètres (Settings).
3. Créer une API key dédiée à l'usage local Codex.
4. Conserver la clé en lieu sûr (gestionnaire de secrets).

### 2) Copier le fichier d'exemple
Depuis la racine du repo :

```bash
cp .codex/config.toml.example .codex/config.toml
```

### 3) Remplacer la clé d'exemple
Éditer `.codex/config.toml` et remplacer :
- `YOUR-STITCH-API-KEY`
par votre vraie clé Stitch.

### 4) Ne jamais committer `.codex/config.toml`
- Le fichier `.codex/config.toml` contient un secret local.
- Il est ignoré par Git via `.gitignore`.
- Ne partagez pas ce fichier dans des tickets, PR, captures ou logs.

### 5) Relancer Codex
Après mise à jour de la configuration locale, redémarrer/recharger Codex pour prendre en compte le serveur MCP Stitch.

### 6) Vérifier avec une commande de lecture
Une fois Codex relancé, demander :

> "Liste mes projets Stitch avec list_projects."

---

## Option OAuth (facultative)

OAuth peut être utilisé selon votre politique d'accès entreprise (SSO, scopes gérés, rotation centralisée).

Cependant, pour BetAuto et ce flux de travail, **l'API key reste recommandée** car :
- configuration plus rapide ;
- setup local plus simple ;
- reproductible pour les audits de maquettes Stitch.

Si vous adoptez OAuth, appliquez les mêmes règles de sécurité :
- ne pas committer les tokens ;
- éviter toute exposition dans les logs/sorties terminal ;
- utiliser le stockage local sécurisé approprié.
