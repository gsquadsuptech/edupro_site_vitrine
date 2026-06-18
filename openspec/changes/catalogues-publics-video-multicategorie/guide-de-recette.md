# Guide de recette — Catalogues, vidéo de présentation, multi-catégories & sécurité paiement

**Pour le testeur** — aucune compétence technique requise. Suivez chaque scénario dans l'ordre, cochez ✅ si le résultat attendu est conforme, ❌ sinon (avec une capture d'écran et l'URL de la page).

---

## 1. Avant de commencer

- **Environnement à tester** : staging → **https://site.edupro.africa** (un bandeau orange « Environnement STAGING » s'affiche en haut : c'est normal, ce sont des données de test).
- **Navigateur** : Chrome ou Edge à jour. Testez aussi sur mobile si possible.
- **Langue** : les pages sont en français (`/fr/...`).
- **Ce qu'on teste** :
  1. La **vidéo de présentation** sur la page d'un parcours.
  2. La nouvelle **page détail d'un catalogue**.
  3. La section **« Ce parcours / ce cours appartient à un catalogue »**.
  4. La liste **« Catalogues co-certifiés »** sur la page Catalogue.
  5. Les **plusieurs catégories** d'un parcours (badges).
  6. Que **l'inscription et le paiement fonctionnent toujours** (non-régression).

> ℹ️ Si une section liée aux catalogues n'apparaît nulle part, prévenez l'équipe : c'est peut-être que les données de test (catalogue rendu « visible », contenu rattaché) ne sont pas encore en place. Ce n'est pas forcément un bug d'affichage.

---

## PARTIE A — Préparation côté admin (superadmin SaaS)

> Réservé à la personne ayant un accès **superadmin**. C'est l'étape qui rend les catalogues visibles côté site ; sans elle, les sections de la PARTIE B n'apparaîtront pas.

| # | Étape | Résultat attendu |
|---|-------|------------------|
| A.1 | Se connecter au **superadmin**, aller dans **Catalogues**, ouvrir un catalogue. | La fiche du catalogue s'ouvre avec les onglets **Infos / Contenu / Partenaires / Analytics**. |
| A.2 | Onglet **Infos** → activer le switch **« Visible sur la marketplace »** → cliquer **Enregistrer**. | Un message de confirmation ; le catalogue est maintenant public. |
| A.3 | Onglet **Contenu** → bouton **« Ajouter un parcours »** → choisir un parcours → **Ajouter**. | Le parcours apparaît dans la liste du contenu du catalogue. |
| A.4 | Toujours onglet **Contenu** → bouton **« Ajouter un cours »** → choisir un cours → **Ajouter**. | Le cours apparaît dans la liste du contenu. |
| A.5 | Vérifier que le parcours / cours ajouté est bien **publié et visible sur la marketplace** (côté gestion de ce parcours/cours). | Sinon, il n'apparaîtra pas dans le catalogue côté site (c'est voulu). |
| A.6 | Pour tester le cas « non public » : ouvrir un **autre** catalogue et **laisser** le switch désactivé. | Servira au test B (point 3.6) : ce catalogue ne doit pas être accessible côté site. |
| A.7 | **Multi-catégories** : aller dans **Parcours**, éditer un parcours, dans **Catégories** cocher **2 ou 3 catégories** → **Enregistrer**. | La sélection est enregistrée. En rouvrant le parcours, les mêmes cases sont cochées. |

✅ / ❌ : __________

> Notez les **noms / liens** du catalogue public, du parcours et du cours rattachés (et du parcours multi-catégories) : ils serviront pour la PARTIE B.

---

## PARTIE B — Tests côté site (visiteur)

## 2. Vidéo de présentation du parcours

**But** : quand un parcours a une vidéo, elle remplace l'image en haut de page.

| # | Étape | Résultat attendu |
|---|-------|------------------|
| 2.1 | Ouvrez la page d'un parcours qui a une vidéo (ex. « Excel Pro Track »). | En haut à droite, on voit une **image d'aperçu avec un bouton ▶ (Play)** au centre. |
| 2.2 | Cliquez sur le bouton ▶. | La vidéo **se lance directement dans la page** (pas d'ouverture d'un autre site). |
| 2.3 | Ouvrez un parcours **sans** vidéo. | On voit **une simple image** (pas de bouton Play). Rien n'est cassé. |
| 2.4 | Sur la page parcours, regardez le nombre d'inscrits / chiffres. | Les nombres s'affichent normalement, **sans message d'erreur** ni page blanche. |

✅ / ❌ : __________

---

## 3. Page détail d'un catalogue

**But** : une page dédiée présente un catalogue et son contenu (parcours et cours).

| # | Étape | Résultat attendu |
|---|-------|------------------|
| 3.1 | Demandez à l'équipe le lien d'un catalogue **public** (format `…/fr/catalogues/nom-du-catalogue`). Ouvrez-le. | La page affiche un **grand visuel d'en-tête**, le **titre**, une **description**, et un badge **« Catalogue co-certifié »**. |
| 3.2 | Faites défiler la page. | On voit les **parcours** et/ou les **cours** du catalogue sous forme de cartes (image, titre, niveau). |
| 3.3 | Survolez une carte (sur ordinateur). | La carte réagit (léger zoom / ombre) — effet visuel normal. |
| 3.4 | Cliquez sur une carte de parcours. | On arrive sur la **page de ce parcours**. |
| 3.5 | Cliquez sur une carte de cours. | On arrive sur la **page de ce cours**. |
| 3.6 | Dans la barre d'adresse, remplacez le nom par un nom bidon (ex. `…/fr/catalogues/nimporte-quoi`). | La page affiche une **erreur 404 / page introuvable** (c'est le comportement attendu pour un catalogue inexistant ou non publié). |

✅ / ❌ : __________

---

## 4. Section « appartient à un catalogue » — sur un PARCOURS

**But** : sur la page d'un parcours rattaché à un catalogue, une section l'indique avec un lien.

| # | Étape | Résultat attendu |
|---|-------|------------------|
| 4.1 | Ouvrez la page d'un parcours **rattaché à un catalogue public**. | Une section du type **« Ce parcours appartient au(x) catalogue(s) »** apparaît, avec une ou plusieurs cartes catalogue. |
| 4.2 | Cliquez sur une carte catalogue. | On arrive sur la **page détail du catalogue** (celle du point 3). |
| 4.3 | Ouvrez un parcours **qui n'est dans aucun catalogue**. | **Aucune** section catalogue ne s'affiche (c'est normal, elle est masquée). |

✅ / ❌ : __________

---

## 5. Section « appartient à un catalogue » — sur un COURS

**But** : même principe, sur la page d'un cours.

| # | Étape | Résultat attendu |
|---|-------|------------------|
| 5.1 | Ouvrez la page d'un cours **rattaché à un catalogue public**. | Une section du type **« Ce cours… »** apparaît avec la/les carte(s) catalogue. |
| 5.2 | Cliquez sur la carte catalogue. | On arrive sur la **page détail du catalogue**. |
| 5.3 | Ouvrez un cours **qui n'est dans aucun catalogue**. | **Aucune** section catalogue ne s'affiche. |

✅ / ❌ : __________

---

## 6. Liste « Catalogues co-certifiés » sur la page Catalogue

**But** : la page Catalogue met en avant les catalogues co-certifiés, séparés des formations à l'unité.

| # | Étape | Résultat attendu |
|---|-------|------------------|
| 6.1 | Ouvrez la page **`…/fr/catalogue`** (menu « Découvrir le catalogue »). | La page se charge normalement. |
| 6.2 | Faites défiler jusqu'à la section **« Catalogues co-certifiés »**. | On voit une liste de catalogues, chacun avec un badge **« Co-certifié »**. Le libellé est **différent** des formations à l'unité (pas de confusion possible). |
| 6.3 | Cliquez sur un catalogue de cette section. | On arrive sur sa **page détail** (point 3). |

> ℹ️ Si aucun catalogue n'a été rendu public, cette section **n'apparaît pas du tout** — c'est le comportement prévu, pas un bug.

✅ / ❌ : __________

---

## 7. Multi-catégories d'un parcours (badges)

**But** : un parcours peut afficher plusieurs catégories sous forme de badges.

> Prérequis : avoir coché 2-3 catégories sur un parcours **publié** à l'étape A.7.

| # | Étape | Résultat attendu |
|---|-------|------------------|
| 7.1 | Ouvrez la page du parcours sur lequel vous avez coché plusieurs catégories. | Sous le badge **« Parcours »** (en haut), on voit **un badge par catégorie** cochée. |
| 7.2 | Comparez avec la sélection faite à l'étape A.7. | Les badges correspondent exactement aux catégories cochées (ni plus, ni moins). |
| 7.3 | Ouvrez un parcours **sans aucune catégorie**. | **Aucun** badge de catégorie n'est affiché (seul « Parcours » reste). |

✅ / ❌ : __________

---

## 8. Non-régression : inscription & paiement

**But** : vérifier qu'après les changements techniques de sécurité, l'inscription et le paiement marchent toujours.

| # | Étape | Résultat attendu |
|---|-------|------------------|
| 7.1 | Sur un parcours/cours **gratuit**, cliquez sur **« S'inscrire maintenant »** (connecté avec un compte de test). | L'inscription aboutit, **sans erreur** ; on accède au contenu. |
| 7.2 | Sur un parcours/cours **payant**, lancez le **paiement** et allez jusqu'à l'écran de paiement. | L'écran de paiement s'affiche correctement (montant, moyens de paiement). |
| 7.3 | Si vous avez un **code promo** de test, saisissez-le. | La **réduction est appliquée** (ou un message clair si le code est invalide). |
| 7.4 | Testez l'**offrir en cadeau** si disponible. | Le parcours est offert, **sans erreur**. |

> ⚠️ Important : aucune fonctionnalité d'inscription/paiement/cadeau ne doit afficher d'erreur. Si c'est le cas, **signalez-le en priorité** (capture + heure exacte).

✅ / ❌ : __________

---

## 9. Comment remonter un problème

Pour chaque anomalie, indiquez :
- **L'URL** exacte de la page.
- **Ce que vous avez fait** (étape, ex. « 4.2 »).
- **Ce qui s'est passé** vs. **ce qui était attendu**.
- Une **capture d'écran** (et l'heure).
- Le **navigateur / appareil** (Chrome PC, Safari iPhone…).

Merci 🙏
