## Why

La page parcours de la vitrine n'exploite pas la vidéo de présentation déjà saisie en back-office, et n'expose aucun lien vers les catalogues — alors que l'entité `catalogs` existe déjà côté SaaS mais reste purement B2B (invisible du public). Par ailleurs un parcours ne peut porter qu'une seule catégorie. Ce change rend ces éléments visibles côté vitrine et assouplit la catégorisation des parcours, sans toucher à la logique B2B existante.

## What Changes

**Piste A — visibilité & affichage des catalogues + vidéo (livrable indépendamment) :**
- La page parcours affiche la **vidéo de présentation** (`preview_video`, embed YouTube déjà en base) à la place de l'image quand elle existe : image de couverture en poster + bouton Play → `<iframe>` au clic (pas de chargement YouTube au load).
- Nouveau flag `is_public` sur la table `catalogs` (SaaS) + toggle superadmin pour publier un catalogue sur la vitrine. Les catalogues restent privés par défaut.
- Nouveaux endpoints SaaS publics (`x-api-key`) : `GET /api/marketplace/catalogs/[slug]` et `GET /api/marketplace/catalogs/by-learning-path/[id]`, qui ne renvoient que des catalogues `is_public=true` et n'exposent jamais `revenue_share`/partenaires.
- Nouvelle **page détail catalogue** publique sur la vitrine à `/catalogues/[slug]` (pluriel, pour éviter la collision avec `/catalogue/[slug]` = page catégorie).
- Nouvelle **section « Ce parcours appartient au(x) catalogue(s) »** sur la page parcours, listant TOUS les catalogues publics du parcours, chacun lié vers sa page détail.

**Piste B — multi-catégories parcours (livrable indépendamment) :**
- Un parcours peut porter **plusieurs catégories** (table `categories` admin), au lieu d'une seule.
- **BREAKING (schéma, additif)** : nouvelle table de jonction `learning_path_categories` ; `learning_paths.category_id` est conservé en additif (déprécié pour l'affichage) et backfillé automatiquement.
- Le formulaire parcours (SaaS) passe d'un select mono-catégorie à un multi-select.
- La page parcours (vitrine) affiche des badges multi-catégories.

## Capabilities

### New Capabilities
- `parcours-preview-video`: affichage de la vidéo de présentation d'un parcours sur la vitrine (poster + lecture au clic), avec repli sur l'image.
- `public-catalogs`: publication d'un catalogue vers le public (flag + lecture API SaaS), page détail catalogue sur la vitrine, et section « appartient aux catalogues » sur la page parcours.
- `learning-path-categories`: catégorisation multiple d'un parcours via les catégories admin (saisie, stockage, affichage).

### Modified Capabilities
<!-- Aucune capability existante : openspec/specs/ est vide. -->

## Impact

**edupro-site (vitrine) :**
- `components/marketing/sections/parcours/hero-section.tsx` (vidéo + fix #418 `toLocaleString('fr-FR')`), nouveau sous-composant client de lecture vidéo.
- Nouveau `services/catalog-service.ts` (lecture via API SaaS), nouvelle page `app/[locale]/catalogues/[slug]/page.tsx`, nouvelle section sur `app/[locale]/parcours/[slug]/page.tsx`.
- `services/learning-path-service.ts` (lecture des catégories via jonction), affichage badges sur la page parcours.
- Variables d'env : `SAAS_API_URL`/`NEXT_PUBLIC_SAAS_URL` + `MARKETPLACE_API_KEY` (déjà utilisées par enroll/cadeau).

**edupro-saas-2 (SaaS) :**
- Migration : `ALTER TABLE catalogs ADD is_public` (+ `public_order` optionnel) ; `CREATE TABLE learning_path_categories` + backfill depuis `learning_paths.category_id`.
- Nouveaux endpoints publics `app/api/marketplace/catalogs/[slug]/route.ts` et `.../by-learning-path/[id]/route.ts`.
- `app/api/superadmin/catalogs/[id]/route.ts` (PATCH allow-list + POST : `is_public`), UI superadmin d'édition catalogue (toggle).
- `app/admin/learning-paths/[id]/edit/page.tsx` + `create` (multi-select), `lib/services/learning-path.service.ts` (écriture jonction).

**Contraintes transverses :** deux bases `qofr` (staging vitrine) vs `cgvet` (prod/SaaS) → lecture catalogues via API SaaS ; deux taxonomies disjointes `categories` vs `marketplace_categories` ; `catalogs` est une entité B2B sensible.

## Non-Goals

- Aligner ou fusionner les taxonomies `categories` et `marketplace_categories`.
- Rendre publics les catalogues B2B autrement que par le flag `is_public`.
- Lister les parcours sous les pages catégorie `/catalogue/[slug]` (taxonomie disjointe).
- Multi-catégories pour les cours ou les catalogues (parcours uniquement).
