## ADDED Requirements

### Requirement: La clé API SaaS n'est jamais exposée au navigateur

La clé d'authentification vers le SaaS SHALL être lue exclusivement depuis une variable d'environnement **serveur** (`MARKETPLACE_API_KEY`), sans préfixe `NEXT_PUBLIC_`. Aucun code exécuté côté navigateur NE DOIT lire cette clé, et elle NE DOIT figurer ni dans le bundle client, ni comme `ARG`/`ENV` de build, ni comme build-arg du workflow.

#### Scenario: Absence de la clé dans le bundle client

- **WHEN** le bundle navigateur de la vitrine est inspecté
- **THEN** la valeur de la clé API SaaS n'y apparaît pas

#### Scenario: Variable publique supprimée

- **WHEN** on recherche `NEXT_PUBLIC_SAAS_API_KEY` dans le code, le Dockerfile et le workflow
- **THEN** aucune occurrence n'est trouvée

### Requirement: Les appels vitrine → SaaS transitent par des routes serveur

Tout appel de la vitrine vers une API SaaS protégée par clé SHALL être émis depuis une route serveur de la vitrine (route handler), qui ajoute l'en-tête `x-api-key` côté serveur. Les composants client NE DOIVENT PAS appeler le SaaS directement avec la clé.

#### Scenario: Validation de code promo

- **WHEN** un utilisateur applique un code promo dans le tunnel de paiement
- **THEN** le composant client appelle une route serveur de la vitrine
- **AND** cette route relaie la requête au SaaS avec `x-api-key` ajouté côté serveur

#### Scenario: Initialisation de paiement

- **WHEN** un utilisateur lance un paiement
- **THEN** l'initialisation passe par une route serveur de la vitrine qui porte la clé
- **AND** le JWT utilisateur (achats équipe) est relayé au SaaS quand il est présent

### Requirement: Source unique de la clé pour les routes serveur

Toutes les routes serveur de la vitrine appelant le SaaS (inscription gratuite, cadeau, redeem, catalogues, proxys paiement) SHALL lire la clé via `MARKETPLACE_API_KEY` uniquement, sans repli sur une variable `NEXT_PUBLIC_*`.

#### Scenario: Aucun repli public

- **WHEN** on inspecte la résolution de la clé dans ces routes
- **THEN** elle provient de `process.env.MARKETPLACE_API_KEY` sans fallback `NEXT_PUBLIC_*`
