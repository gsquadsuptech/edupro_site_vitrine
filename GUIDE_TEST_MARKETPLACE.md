# 🧪 Guide de test — Marketplace EduPro (non technique)

> Ce guide se suit **sans connaissance technique**. Pour chaque étape : faites l'action,
> puis vérifiez que ce que vous voyez correspond au **✅ Résultat attendu**.
> Cochez `[x]` au fur et à mesure. Notez tout écart dans la colonne « Remarque ».
>
> 🔵 **Astuce** : créez un compte de test (apprenant) et gardez-le connecté pour les tests
> Favoris / Sauvegarder / Cadeau.

---

## 0. Avant de commencer

- [ ] Ouvrir le site de test (staging).
- ✅ Une **bande orange « Environnement STAGING »** s'affiche en haut de **toutes** les pages.
  (Elle évite de confondre le site de test avec le vrai site.)

---

## 1. Catalogue — page d'accueil des formations

1. Cliquer sur **« Découvrir le catalogue »**.
   - [ ] ✅ La page affiche des formations et une section **« Explorez par Catégorie »**.
2. Cliquer sur une **catégorie** (ex. « Coaching & Développement Personnel »).
   - [ ] ✅ Une page de catégorie s'ouvre avec une **grande image de fond** correspondant à la catégorie (si une image a été définie par l'administrateur ; sinon une image par défaut).
3. Sur la page catalogue, tester les **filtres** (prix, niveau, durée) puis **« Appliquer »**.
   - [ ] ✅ La liste se met à jour selon les filtres.
4. Tester le **tri** (menu « Trier par » : plus récentes, prix croissant/décroissant, mieux notées…).
   - [ ] ✅ L'ordre des formations change selon le tri choisi.
5. S'il y a beaucoup de formations, utiliser la **pagination** en bas (numéros de page).
   - [ ] ✅ On passe d'une page à l'autre, sans page vide ni formation en double.
6. Utiliser la **recherche** (taper un mot-clé).
   - [ ] ✅ Les résultats correspondent au mot recherché.

---

## 2. Cours « sur invitation » non visibles publiquement

> (À faire avec l'aide d'un administrateur qui peut marquer un cours « sur invitation » / non visible.)

1. Demander à l'admin de rendre un cours **« sur invitation »** (privé).
2. Chercher ce cours dans le catalogue, la recherche et les catégories.
   - [ ] ✅ Le cours **n'apparaît nulle part** publiquement.
3. Ouvrir directement le lien de ce cours (s'il est connu).
   - [ ] ✅ La page affiche **« introuvable » (404)** — le cours privé n'est pas accessible.

---

## 3. Carte de formation (vignette dans le catalogue)

1. Regarder une vignette de cours **sans formateur** assigné.
   - [ ] ✅ Le **nom de l'institut** s'affiche (et **pas** « Instructeur »).
2. Regarder le nombre d'**inscrits** sur une vignette d'un cours **à sessions/cohortes**.
   - [ ] ✅ Le nombre d'inscrits correspond au **nombre réel** de participants (pas « 0 » si des gens sont inscrits).

---

## 4. Page détail d'une formation

Ouvrir une formation (clic sur une vignette).

### 4.1 Formateur / Institut
1. Regarder le haut de page et l'onglet **« Formateur »**.
   - [ ] ✅ Si un **vrai formateur** est assigné : son **nom et sa vraie biographie** s'affichent (pas un texte générique).
   - [ ] ✅ Si **aucun formateur** : l'onglet s'appelle **« Institut »** et affiche les infos de l'**institut** (nom, logo, description).

### 4.2 Sessions / Cohortes (si le cours en a)
1. Ouvrir l'onglet **« Sessions »**.
   - [ ] ✅ Les sessions affichent **dates, prix, nombre d'inscrits** réels.
   - [ ] ✅ Les **formateurs de chaque session** apparaissent (photo/nom), ou à défaut l'institut.

### 4.3 Bouton « M'avertir pour la prochaine session »
- [ ] ✅ Ce bouton apparaît **uniquement** pour un cours à **sessions** dont **aucune session n'est ouverte**.
- [ ] ✅ Il **n'apparaît pas** sur un cours classique (auto-formation) ni sur un parcours.
- [ ] ✅ Quand une session est **ouverte**, c'est le bouton **« S'inscrire »** qui s'affiche à la place.

### 4.4 Aperçu gratuit
1. Ouvrir l'onglet **« Programme »**. Repérer une leçon marquée **« Aperçu gratuit »**.
   - [ ] ✅ Cliquer dessus ouvre un **lecteur vidéo** (même sans être connecté).
2. Regarder une leçon **non gratuite** (cadenas).
   - [ ] ✅ Elle **n'est pas** cliquable / reste verrouillée.

### 4.5 Cours similaires (bas de page)
- [ ] ✅ S'il existe des cours similaires : ils s'affichent (section « Formations similaires »).
- [ ] ✅ S'il n'y en a pas : la section **est masquée** (pas de zone vide ni de chargement infini).

---

## 5. Favoris (cœur) — **doit rester après rechargement**

> Connectez-vous d'abord.

1. Sur une formation, cliquer sur **« Favoris »** (le cœur).
   - [ ] ✅ Un message **« Ajouté aux favoris »** apparaît et le bouton devient **rouge**.
2. **Recharger la page** (F5).
   - [ ] ✅ Le bouton est **toujours rouge** (le favori a bien été conservé). ⬅️ *test clé*
3. Se déconnecter puis se reconnecter, rouvrir la formation.
   - [ ] ✅ Le favori est **toujours là**.
4. Cliquer à nouveau sur le cœur pour **retirer**.
   - [ ] ✅ Message « Retiré des favoris », le cœur redevient gris, et reste gris après rechargement.

---

## 6. Sauvegarder (signet)

1. Sur une formation, cliquer sur **« Sauvegarder »**.
   - [ ] ✅ Message « Formation sauvegardée », le bouton change d'état.
2. Recharger la page.
   - [ ] ✅ L'état « Sauvegardé » est conservé.

---

## 7. Page « Mes favoris »

1. Cliquer sur l'**icône de compte** (en haut à droite) → **« Mes favoris »**.
   - [ ] ✅ Une page s'ouvre avec deux onglets : **Favoris** et **Sauvegardés**.
   - [ ] ✅ Chaque onglet liste les formations correspondantes ; si vide, un message + bouton « Découvrir le catalogue ».

---

## 8. Partager

1. Sur une formation, cliquer sur **« Partager cette formation »**.
   - [ ] ✅ Le partage natif s'ouvre, **ou** un message confirme que **le lien a été copié**.

---

## 9. Offrir en cadeau

> Connectez-vous d'abord (l'acheteur).

1. Sur une formation, cliquer sur **« Offrir en cadeau »**.
   - [ ] ✅ Une fenêtre s'ouvre : **email du destinataire**, nom, message.
2. Remplir et valider.
   - [ ] ✅ Pour un cours payant : redirection vers la **page de paiement**.
   - [ ] ✅ Pour un cours gratuit : confirmation du cadeau.
3. Le **destinataire** reçoit un **email** avec un lien d'activation. Ouvrir ce lien.
   - [ ] ✅ La page **« Votre cadeau EduPro »** s'affiche avec un bouton **« Activer mon cadeau »**.
4. Cliquer sur « Activer mon cadeau ».
   - [ ] ✅ Message « Cadeau activé », et l'accès à la formation est disponible.

---

## 10. Connexion & accès à l'espace formation

1. Se connecter avec un compte **apprenant**.
   - [ ] ✅ La connexion réussit (plus d'erreur de type « captcha »).
2. Cliquer sur l'**icône de compte** en haut à droite.
   - [ ] ✅ Le menu affiche **« Mon Espace Formation »** (accès aux formations de l'apprenant), **« Mes favoris »** et **« Se déconnecter »**.

---

## 11. Affichage mobile / tablette

1. Refaire rapidement les pages **Catalogue** et **Détail d'une formation** sur **téléphone**.
   - [ ] ✅ Tout reste lisible et utilisable (boutons accessibles, images correctes, pas de texte coupé).

---

## ✍️ Tableau de remarques

| # | Test | OK / KO | Remarque |
|---|------|---------|----------|
| 1 | Catalogue (fond, filtres, tri, pagination, recherche) | | |
| 2 | Cours sur invitation invisibles | | |
| 3 | Carte : institut + inscrits réels | | |
| 4 | Détail : formateur/institut, sessions, M'avertir, aperçu, similaires | | |
| 5 | Favoris persistants après rechargement | | |
| 6 | Sauvegarder | | |
| 7 | Page Mes favoris | | |
| 8 | Partager | | |
| 9 | Offrir en cadeau (bout en bout) | | |
| 10 | Connexion + menu Espace Formation | | |
| 11 | Mobile / tablette | | |
