## ADDED Requirements

### Requirement: Publication d'un catalogue vers le public

Un catalogue SHALL pouvoir être marqué « public » via un flag `is_public` dédié, distinct des champs `status` et `is_active` (qui restent réservés au cycle de vie B2B). Un catalogue SHALL être privé par défaut. Seul un superadmin SHALL pouvoir modifier ce flag.

#### Scenario: Publier un catalogue

- **WHEN** un superadmin active le flag « visible sur la marketplace » sur un catalogue
- **THEN** `is_public` passe à `true` et le catalogue devient lisible par les endpoints publics

#### Scenario: Catalogue privé par défaut

- **WHEN** un catalogue est créé
- **THEN** `is_public` vaut `false` et le catalogue n'est exposé par aucun endpoint public

#### Scenario: Non-régression B2B

- **WHEN** le flag `is_public` est modifié
- **THEN** les champs `status`, `is_active`, `revenue_share` et les accès partenaires sont inchangés

### Requirement: Lecture publique d'un catalogue via API SaaS

Le SaaS SHALL exposer un endpoint public authentifié par `x-api-key` qui renvoie, pour un slug de catalogue donné, une projection publique (titre, description, image de couverture, liste des parcours et cours). L'endpoint NE DOIT PAS renvoyer `revenue_share` ni les organisations partenaires. Il NE DOIT renvoyer un catalogue QUE si `is_public=true`, et NE DOIT lister QUE les parcours et cours eux-mêmes publiquement visibles.

#### Scenario: Catalogue public existant

- **WHEN** une requête `GET /api/marketplace/catalogs/[slug]` avec une clé API valide cible un catalogue `is_public=true`
- **THEN** la réponse contient titre, description, image de couverture et la liste filtrée des parcours/cours publiquement visibles

#### Scenario: Catalogue non public

- **WHEN** la requête cible un catalogue `is_public=false`
- **THEN** l'endpoint répond comme pour un catalogue introuvable (404), sans divulguer son existence

#### Scenario: Clé API manquante ou invalide

- **WHEN** la requête n'a pas d'en-tête `x-api-key` valide
- **THEN** l'endpoint répond 401 sans données

#### Scenario: Exclusion du contenu non publié

- **WHEN** un catalogue public contient un parcours en brouillon ou non-searchable
- **THEN** ce parcours n'apparaît pas dans la réponse publique

### Requirement: Page détail catalogue sur la vitrine

La vitrine SHALL exposer une page de détail catalogue à la route `/catalogues/[slug]` (au pluriel, distincte de `/catalogue/[slug]` qui reste la page catégorie). La page SHALL lire les données via l'API SaaS et SHALL afficher 404 pour un catalogue non public ou inexistant.
                    
#### Scenario: Affichage d'un catalogue public

- **WHEN** un visiteur ouvre `/catalogues/[slug]` pour un catalogue public
- **THEN** la page affiche son titre, sa description, son image et la liste de ses parcours et cours

#### Scenario: Catalogue introuvable ou privé

- **WHEN** un visiteur ouvre `/catalogues/[slug]` pour un slug inexistant ou un catalogue non public
- **THEN** la vitrine affiche une page 404

### Requirement: Section « appartient aux catalogues » sur les pages parcours et cours

La page d'un parcours OU d'un cours SHALL afficher la liste de TOUS les catalogues publics auxquels l'élément appartient (relation N–N via `catalog_learning_paths` pour un parcours, `catalog_courses` pour un cours), chaque catalogue étant lié vers sa page détail. La section SHALL être masquée si l'élément n'appartient à aucun catalogue public. Le libellé SHALL s'adapter (« Ce parcours… » / « Ce cours… »).

#### Scenario: Parcours appartenant à plusieurs catalogues publics

- **WHEN** un parcours appartient à deux catalogues publics
- **THEN** la page parcours affiche deux cartes catalogue, chacune liée vers `/catalogues/[slug]`

#### Scenario: Cours appartenant à un catalogue public

- **WHEN** un cours est ajouté en tant que cours standalone à un catalogue public
- **THEN** la page du cours affiche une carte vers ce catalogue, avec le libellé « Ce cours… »

#### Scenario: Élément sans catalogue public

- **WHEN** un parcours ou un cours n'appartient à aucun catalogue public
- **THEN** la section n'est pas affichée

### Requirement: Liste des catalogues co-certifiés sur la marketplace

La home marketplace de la vitrine (`/catalogue`) SHALL afficher une section listant les catalogues co-certifiés publics, distincte (par le libellé) du catalogue de formations à l'unité. Chaque catalogue SHALL être lié vers sa page détail. Les données SHALL provenir d'un endpoint SaaS public (`GET /api/marketplace/catalogs`, `x-api-key`) ne renvoyant que les catalogues `is_public=true`. La section SHALL être masquée s'il n'existe aucun catalogue public.

#### Scenario: Au moins un catalogue public

- **WHEN** un visiteur ouvre `/catalogue` et qu'au moins un catalogue est public
- **THEN** une section « Catalogues co-certifiés » liste les catalogues, chacun lié vers `/catalogues/[slug]`

#### Scenario: Aucun catalogue public

- **WHEN** aucun catalogue n'est public
- **THEN** la section « Catalogues co-certifiés » n'est pas affichée
