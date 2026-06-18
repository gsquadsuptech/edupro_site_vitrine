## 1. Piste A — Vidéo de présentation (vitrine, livrable seul)

- [x] 1.1 Créer un util de normalisation YouTube côté vitrine (extraire l'ID depuis `embed`/`watch?v=`/`youtu.be`, retourner une URL d'embed ou null)
- [x] 1.2 Créer un sous-composant client `ParcoursHeroMedia` : poster (image de couverture) + bouton Play ; au clic, remplace par `<iframe>` YouTube `autoplay`
- [x] 1.3 Intégrer `ParcoursHeroMedia` dans `components/marketing/sections/parcours/hero-section.tsx` (vidéo si `preview_video`, sinon `<Image>`), en conservant les badges flottants « X heures » / « N cours »
- [x] 1.4 Corriger le bug #418 : `enrolled.toLocaleString()` → `toLocaleString('fr-FR')` sur la page parcours
- [x] 1.5 Vérifier : parcours avec vidéo (poster + clic = lecture), parcours sans vidéo (image seule), aucune requête YouTube avant clic, aucune erreur d'hydratation

## 2. Piste A — Schéma & visibilité catalogue (SaaS)

- [x] 2.1 Migration : `ALTER TABLE catalogs ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT false` (+ `public_order INT NULL` optionnel) + index partiel `WHERE is_public`
- [x] 2.2 Ajouter `is_public` (et `public_order`) à l'allow-list du `PATCH /api/superadmin/catalogs/[id]` et aux champs du `POST /api/superadmin/catalogs`
- [x] 2.3 Ajouter un toggle « Visible sur la marketplace » dans l'UI superadmin d'édition de catalogue (à côté de `status`/`is_active`)
- [x] 2.4 Vérifier : publication/dépublication d'un catalogue ; champs B2B (`status`, `is_active`, `revenue_share`, partenaires) inchangés

## 3. Piste A — Endpoints publics catalogue (SaaS)

- [x] 3.1 `GET /api/marketplace/catalogs/[slug]` : auth `x-api-key` ; 404 si absent ou `is_public=false` ; projection (title, description, cover_image_url, learning_paths[], courses[]) SANS `revenue_share`/partenaires
- [x] 3.2 Dans 3.1, n'inclure que les parcours/cours publiquement visibles (intersection `marketplace.searchable` + `published`)
- [x] 3.3 `GET /api/marketplace/catalogs/by-learning-path/[id]` : auth `x-api-key` ; renvoie `[{ slug, title, cover_image_url }]` filtré `is_public=true`
- [x] 3.4 Vérifier : 401 sans clé ; 404 sur catalogue privé ; absence des champs sensibles ; exclusion d'un parcours en brouillon

## 4. Piste A — Affichage catalogues (vitrine)

- [x] 4.1 Créer `services/catalog-service.ts` : `getBySlug(slug)` et `getByLearningPath(lpId)` via `fetch` API SaaS (`SAAS_API_URL`/`NEXT_PUBLIC_SAAS_URL` + `MARKETPLACE_API_KEY`), avec `revalidate`
- [x] 4.2 Créer la page `app/[locale]/catalogues/[slug]/page.tsx` (titre, description, image, parcours, cours), 404 si introuvable/privé
- [x] 4.3 Ajouter la section « Ce parcours appartient au(x) catalogue(s) » dans `app/[locale]/parcours/[slug]/page.tsx` : N cartes liées vers `/catalogues/[slug]` ; section masquée si aucune
- [x] 4.4 Vérifier en staging (frappe SaaS staging) : page catalogue, section parcours, 404 catalogue privé

## 5. Piste B — Multi-catégories : schéma (SaaS)

- [x] 5.1 Migration : `CREATE TABLE learning_path_categories(learning_path_id, category_id → categories, UNIQUE)` + RLS (lecture publique scopée aux parcours publiés + superadmin ; écriture via Prisma qui contourne la RLS) + policy anon additive sur `categories`
- [x] 5.2 Backfill : `INSERT ... SELECT learning_path_id, category_id FROM learning_paths WHERE category_id IS NOT NULL`
- [x] 5.3 Vérifier le backfill (chaque parcours catégorisé a sa ligne de jonction) — *à valider après application de la migration en base*

## 6. Piste B — Saisie multi-catégories (SaaS)

- [x] 6.1 Remplacer le `<Select>` mono-catégorie par un multi-select (cases à cocher, source `.from('categories')`) dans `app/admin/learning-paths/[id]/edit/page.tsx` et la page `create`
- [x] 6.2 Écrire/mettre à jour les lignes de jonction à la sauvegarde (création + édition) via `syncLearningPathCategories` (SQL brut) dans `lib/services/learning-path.service.ts` ; `categoryIds` ajouté aux types et relayé par les routes API
- [x] 6.3 Charger la sélection courante (jonction lue via Prisma dans `GET /api/learning-paths/[id]`, renvoyée en `categoryIds`) à l'ouverture du formulaire d'édition
- [x] 6.4 Vérifier : sélection multiple persistée, ajout/retrait reflétés, `category_id` laissé en additif (= 1ʳᵉ catégorie)

## 7. Piste B — Affichage catégories (vitrine)

- [x] 7.1 Étendre `services/learning-path-service.ts` pour lire les catégories via la jonction (`attachCategories`, 2 requêtes séparées comme `attachOrganizations`)
- [x] 7.2 Afficher un badge par catégorie sur la page parcours (hero) ; rien si aucune
- [x] 7.3 Vérifier : parcours multi-catégories (N badges), parcours sans catégorie (aucun badge)

## 8. Clôture

- [x] 8.1 Typecheck `npx tsc --noEmit` propre sur les deux repos (vitrine exit 0 ; SaaS sans erreur sur les fichiers touchés)
- [ ] 8.2 Déploiement ordonné : SaaS (schéma + endpoints) avant vitrine ; valider piste A puis piste B

## 9. Extensions catalogues (cours + découvrabilité)

- [x] 9.1 SaaS : endpoint `GET /api/marketplace/catalogs/by-course/[id]` (catalogues publics d'un cours via `catalog_courses`)
- [x] 9.2 Vitrine : `CatalogService.getByCourse()` + section générique `CatalogBelongsSection` (prop `kind` parcours/cours) ; câblée dans la page formation
- [x] 9.3 SaaS : endpoint `GET /api/marketplace/catalogs` (liste des catalogues publics)
- [x] 9.4 Vitrine : `CatalogService.getPublicCatalogs()` + section « Catalogues co-certifiés » sur `/catalogue` (libellé distinct du catalogue de formations)
- [x] 9.5 Refonte design page détail catalogue (hero immersif, cartes, état vide) + badge « Catalogue co-certifié »
