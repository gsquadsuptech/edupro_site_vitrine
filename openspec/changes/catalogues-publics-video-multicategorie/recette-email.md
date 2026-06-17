**Objet : Recette staging — Catalogues, vidéo parcours & paiement**

Bonjour,

Merci de tester les nouveautés ci-dessous. Chrome ou Edge à jour, et sur mobile si possible. Pour chaque point, répondez **OK** ou **KO** (avec capture + URL).
Environnement : ____________________ (staging ou prod).
À NE PAS tester : le choix de plusieurs catégories pour un parcours (pas encore développé).

Liens de test à utiliser :
- Parcours avec vidéo : __________
- Catalogue public : __________
- Parcours/cours rattaché à un catalogue : __________

---

**0. Préparation (superadmin SaaS — fait par l'admin)**
- Superadmin → Catalogues → ouvrir un catalogue → onglet **Infos** → activer **« Visible sur la marketplace »** → **Enregistrer**.
- Onglet **Contenu** → **« Ajouter un parcours »** puis **« Ajouter un cours »**.
- Vérifier que ce parcours/cours est bien publié et visible sur la marketplace (sinon il n'apparaîtra pas dans le catalogue : normal).
- Laisser un autre catalogue **non** public pour le test du point 2 (404).
→ OK / KO : ____

---

**1. Vidéo du parcours**
- Ouvrir un parcours avec vidéo → une image avec un bouton ▶ s'affiche en haut.
- Cliquer ▶ → la vidéo se lance **dans la page**.
- Ouvrir un parcours sans vidéo → simple image, rien de cassé.
→ OK / KO : ____

**2. Page détail d'un catalogue**
- Ouvrir le lien d'un catalogue → titre, description, grande image, badge « Catalogue co-certifié », et cartes des parcours/cours.
- Cliquer une carte → on arrive sur le parcours / le cours.
- Mettre un nom bidon dans l'URL (…/catalogues/xxx) → page « introuvable » (404) attendue.
→ OK / KO : ____

**3. Section « appartient à un catalogue » (parcours ET cours)**
- Sur un parcours rattaché à un catalogue → section « Ce parcours appartient au(x) catalogue(s) » avec lien vers le catalogue.
- Idem sur un cours rattaché → section « Ce cours… ».
- Sur un parcours/cours sans catalogue → **aucune** section (normal).
→ OK / KO : ____

**4. Page Catalogue (…/fr/catalogue)**
- Faire défiler → section « Catalogues co-certifiés » avec badge « Co-certifié ».
- Cliquer un catalogue → sa page détail s'ouvre.
- (Si aucun catalogue n'est public, la section n'apparaît pas : normal.)
→ OK / KO : ____

**5. Inscription & paiement (vérif. importante)**
- S'inscrire à une formation **gratuite** → aboutit sans erreur.
- Lancer un **paiement** sur une formation payante → l'écran de paiement s'affiche.
- Saisir un **code promo** de test → réduction appliquée (ou message clair si invalide).
- Offrir en **cadeau** (si dispo) → aboutit sans erreur.
→ OK / KO : ____  ⚠️ Toute erreur ici = à signaler en priorité.

---

**Pour signaler un souci :** URL exacte + n° du point (ex. « 3 ») + ce qui s'est passé vs attendu + capture + navigateur/appareil.

Merci !
