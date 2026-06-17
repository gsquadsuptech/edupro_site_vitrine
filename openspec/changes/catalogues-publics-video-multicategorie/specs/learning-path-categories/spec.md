## ADDED Requirements

### Requirement: Catégorisation multiple d'un parcours

Un parcours SHALL pouvoir être associé à plusieurs catégories issues de la table `categories` (catégories admin). Les associations SHALL être stockées dans une table de jonction `learning_path_categories`. La colonne `learning_paths.category_id` SHALL être conservée en additif (dépréciée pour l'affichage) afin de ne pas casser l'existant.

#### Scenario: Sélection de plusieurs catégories

- **WHEN** un administrateur enregistre un parcours avec trois catégories sélectionnées
- **THEN** trois lignes sont créées dans `learning_path_categories` pour ce parcours

#### Scenario: Mise à jour des catégories

- **WHEN** un administrateur modifie la sélection de catégories d'un parcours
- **THEN** les lignes de jonction reflètent exactement la nouvelle sélection (ajouts et retraits)

#### Scenario: Backfill des données existantes

- **WHEN** la migration s'applique sur un parcours ayant un `category_id` non nul
- **THEN** une ligne correspondante est créée dans `learning_path_categories` sans intervention manuelle

### Requirement: Saisie multi-catégories dans le formulaire parcours

Le formulaire de création et d'édition d'un parcours (SaaS) SHALL proposer une sélection multiple de catégories alimentée par la table `categories`, en remplacement du sélecteur mono-catégorie.

#### Scenario: Le formulaire charge la sélection actuelle

- **WHEN** un administrateur ouvre un parcours déjà catégorisé
- **THEN** toutes ses catégories courantes apparaissent comme sélectionnées dans le multi-select

### Requirement: Affichage des catégories d'un parcours sur la vitrine

La page d'un parcours SHALL afficher l'ensemble de ses catégories sous forme de badges. Ces catégories SHALL être lues via la table de jonction.

#### Scenario: Parcours multi-catégories

- **WHEN** un visiteur ouvre un parcours associé à plusieurs catégories
- **THEN** un badge est affiché pour chaque catégorie

#### Scenario: Parcours sans catégorie

- **WHEN** un parcours n'a aucune catégorie
- **THEN** aucun badge de catégorie n'est affiché
