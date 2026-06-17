## Context

Deux applications partagent le domaine : la **vitrine** (`edupro-site`, Next.js App Router, affichage public) et le **SaaS** (`edupro-saas-2`, admin/superadmin, base de vérité). La vitrine lit l'affichage directement en base (client anon, filtré par les tables `marketplace_*`) et délègue les mutations (inscription, cadeau, paiement) au SaaS via une API protégée par `x-api-key` (`MARKETPLACE_API_KEY`).

Contrainte d'environnement vérifiée dans les `.env` : la vitrine lit `NEXT_PUBLIC_SUPABASE_URL = cgvet` (base SaaS) en **prod**, mais `qofr` (base vitrine distincte) en **staging**. Toute donnée présente uniquement côté SaaS est donc **vide en staging** si on tente une lecture DB directe (c'est la cause racine du « Cours introuvable » déjà résolu en routant l'inscription gratuite vers l'API SaaS).

État existant exploité :
- `learning_paths.preview_video` est déjà saisi en back-office et déjà remonté par `services/learning-path-service.ts` jusqu'au hero — mais le hero ne l'affiche pas.
- L'entité `catalogs` existe déjà (migration `20260522120000`) avec `catalog_learning_paths` (N–N) et `catalog_courses`, mais sa RLS est **B2B uniquement** (superadmin/org/partenaire), sans aucune visibilité publique.
- Un parcours porte une seule catégorie (`learning_paths.category_id → categories`).

## Goals / Non-Goals

**Goals:**
- Afficher la vidéo de présentation sur la page parcours, sans pénaliser le chargement.
- Rendre un catalogue publiable et consultable publiquement, en réutilisant l'entité `catalogs` existante.
- Lister sur la page parcours tous les catalogues publics auxquels il appartient.
- Permettre plusieurs catégories par parcours.
- Garder les deux pistes (A : catalogues + vidéo ; B : multi-catégories) livrables indépendamment.

**Non-Goals:**
- Fusionner/aligner les taxonomies `categories` et `marketplace_categories`.
- Exposer publiquement des catalogues B2B autrement que via `is_public`.
- Lister les parcours sous les pages catégorie `/catalogue/[slug]`.
- Multi-catégories pour les cours ou les catalogues.

## Decisions

### D1 — Lecture des catalogues via API SaaS (et non DB directe)
Les catalogues sont lus par la vitrine via de nouveaux endpoints publics `x-api-key`, comme l'inscription/cadeau.
- **Pourquoi** : (a) `catalogs` vit côté SaaS → une lecture directe serait **vide en staging** (base `qofr`) ; (b) entité B2B sensible → garder la logique de visibilité côté serveur, en un point auditable.
- **Alternatives écartées** : lecture anon directe de `catalogs` + nouvelle RLS publique (risque de fuite de catalogues B2B sur un faux pas de policy) ; vue/table de projection `marketplace_catalogs` lue en direct (rejouerait le bug d'env en staging).

### D2 — Visibilité par flag `is_public` sur `catalogs` (et non table `marketplace_catalogs`)
- **Pourquoi** : les catalogues sont créés **uniquement par superadmin** → pas de workflow de revue (la raison d'être des tables `marketplace_*` pour cours/parcours créés par des partenaires). Un simple flag suffit. Option `public_order INT` pour une mise en avant ultérieure.
- **Alternative écartée** : réutiliser `status='active'`/`is_active` → ferait fuiter des catalogues B2B (ces champs gèrent l'activation partenaire, pas la vitrine).

### D3 — Route vitrine `/catalogues/[slug]` (pluriel)
- **Pourquoi** : `/catalogue/[slug]` est **déjà** la page catégorie (`CategoryHero`, `getCategoryBySlug`). Le pluriel évite la collision tout en restant lisible.

### D4 — Vidéo : poster + lecture au clic (Option 2)
- Image de couverture en poster + bouton Play ; au clic → `<iframe>` YouTube `autoplay`.
- **Pourquoi** : évite de charger YouTube (et ses cookies tiers) à chaque vue ; garde le visuel de couverture par défaut. Coût : extraire un petit sous-composant **client** (le hero parcours est un Server Component).
- **Format** : `preview_video` est déjà normalisé en embed YouTube côté SaaS ; prévoir une normalisation **défensive** côté vitrine (extraire l'ID d'une éventuelle URL brute `watch?v=`/`youtu.be/`).
- **Piège** : NE PAS copier le hero formation — son bouton Play n'a aucun `onClick`, c'est un faux player.

### D5 — Multi-catégories sur la taxonomie `categories` (et non `marketplace_categories`)
- Jonction `learning_path_categories(learning_path_id, category_id → categories)`.
- **Pourquoi ce choix produit** : les parcours pointent déjà vers `categories` → **backfill automatique trivial** depuis `category_id` (1 ligne par valeur), aucun re-tag manuel. Le formulaire garde sa source `.from('categories')`.
- **Conséquence assumée** : ces catégories servent à l'**affichage de badges**, pas au browse `/catalogue/[slug]` (qui tourne sur `marketplace_categories`, disjoint). C'est un non-goal explicite.
- `learning_paths.category_id` conservé en additif (déprécié pour l'affichage), suppression dans une migration ultérieure.

### D6 — Projection publique stricte des endpoints catalogue
La projection ne renvoie jamais `revenue_share` ni les partenaires, et n'inclut que les parcours/cours **eux-mêmes publiquement visibles** (intersection avec `marketplace.searchable`/`published`). Gabarit = le `GET /api/superadmin/catalogs/[id]` existant (mêmes agrégations), avec auth `x-api-key` + filtre `is_public`.

## Risks / Trade-offs

- **[Staging vide pour les catalogues]** → l'API SaaS lit toujours sa propre base ; tester sur staging.edupro.africa. Documenter que `qofr` n'a pas les catalogues.
- **[Fuite de données B2B]** → projection en liste blanche de champs côté endpoint ; tests sur catalogue privé (404) et sur champs sensibles absents.
- **[Deux taxonomies disjointes]** → assumé ; les badges parcours ne sont pas cliquables vers le browse catégorie. À réévaluer si l'on veut un jour brancher la découverte.
- **[Hydratation #418]** → corriger `toLocaleString('fr-FR')` sur la page parcours en même temps que le hero.
- **[Migration jonction]** → additive ; `category_id` conservé. Rollback = drop de `learning_path_categories` sans perte (la source `category_id` reste).
- **[Hop réseau API catalogue]** → cacher via `revalidate` sur les pages catalogue/parcours.

## Migration Plan

1. **SaaS — schéma** : `ALTER TABLE catalogs ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT false` (+ `public_order INT` optionnel) ; `CREATE TABLE learning_path_categories` + backfill `INSERT ... SELECT learning_path_id, category_id FROM learning_paths WHERE category_id IS NOT NULL`.
2. **SaaS — superadmin** : ajouter `is_public` à l'allow-list du PATCH + au POST ; toggle dans l'UI d'édition catalogue.
3. **SaaS — endpoints publics** : `GET /api/marketplace/catalogs/[slug]` et `.../by-learning-path/[id]` (auth `x-api-key`, filtre `is_public`, projection stricte).
4. **SaaS — formulaire parcours** : select mono → multi-select ; écriture des lignes de jonction à la sauvegarde (create + update).
5. **Vitrine — vidéo** : sous-composant client de lecture + intégration hero (+ fix #418). *(livrable seul)*
6. **Vitrine — catalogues** : `catalog-service.ts` (fetch API), page `/catalogues/[slug]`, section « appartient aux catalogues » sur la page parcours.
7. **Vitrine — catégories** : lecture des catégories via jonction dans `learning-path-service.ts` + badges sur la page parcours.

**Ordre de déploiement** : SaaS (schéma + endpoints) avant vitrine (qui en dépend). La piste A vidéo (étape 5) peut partir indépendamment de tout le reste.

## Open Questions

- `public_order` : nécessaire dès maintenant, ou suffira-t-il d'ordonner par titre tant qu'il n'y a pas de page « liste des catalogues » ?
- Faut-il une page index `/catalogues` (liste de tous les catalogues publics), ou seulement les pages détail `/catalogues/[slug]` pour cette itération ?
