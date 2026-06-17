## Context

La vitrine s'authentifie auprès du SaaS via un en-tête `x-api-key`. Le SaaS valide cette clé contre son `MARKETPLACE_API_KEY`. Côté vitrine, la même valeur est aujourd'hui fournie sous le nom `NEXT_PUBLIC_SAAS_API_KEY` :

- déclarée `ARG`/`ENV` dans le `Dockerfile` (l.39/50), passée en build-arg + runtime `-e` par `.github/workflows/deploy.yml`, et stockée comme secret d'Environnement GitHub (staging + production) ;
- lue côté **serveur** par `app/api/enroll/free`, `app/api/gift`, `app/api/gift/redeem` (avec fallback `MARKETPLACE_API_KEY || NEXT_PUBLIC_SAAS_API_KEY`) ;
- lue côté **client** par `components/payment/payment-process.tsx` (`'use client'`) qui appelle le SaaS directement pour la validation de code promo et l'init de paiement.

Comme un composant client lit la variable, `next build` l'inline dans le bundle navigateur → la clé est publiquement extractible. La valeur actuelle (`c482…`) doit donc être considérée **compromise**.

## Goals / Non-Goals

**Goals:**
- Retirer toute exposition de la clé API SaaS au navigateur.
- Faire transiter 100 % des appels vitrine → SaaS par des routes serveur.
- Unifier la source de la clé sur `MARKETPLACE_API_KEY` (serveur uniquement).
- Permettre la rotation propre de la clé compromise.

**Non-Goals:**
- Modifier la logique métier (paiement, promo, inscription, catalogues).
- Changer l'auth cross-app par JWT (conservée, relayée par le proxy).

## Decisions

### D1 — Proxys serveur pour les appels paiement
`payment-process.tsx` n'appelle plus le SaaS directement. On crée des routes serveur vitrine qui relaient :
- validation de code promo (`/api/discounts/validate` côté SaaS) ;
- initialisation de paiement (endpoint SaaS d'init).
La clé est ajoutée côté serveur ; le JWT utilisateur (achats équipe) est transmis en `Authorization` quand présent.
- **Pourquoi** : c'est le seul moyen de retirer la clé du bundle tout en gardant la fonctionnalité. Cohérent avec `enroll`/`cadeau` déjà proxifiés.
- **Alternative écartée** : laisser l'appel client mais masquer la clé → impossible, un appel client authentifié par clé expose forcément la clé.

### D2 — Source unique `MARKETPLACE_API_KEY` (sans fallback public)
Toutes les routes serveur lisent `process.env.MARKETPLACE_API_KEY`. Le fallback `|| NEXT_PUBLIC_SAAS_API_KEY` est supprimé partout.
- **Pourquoi** : un seul secret serveur, auditable, jamais bundlé.

### D3 — Suppression de `NEXT_PUBLIC_SAAS_API_KEY` de la chaîne de build
Retrait des `ARG`/`ENV` du Dockerfile, du build-arg et du `-e` runtime du workflow, et du secret d'Environnement GitHub.
- **Pourquoi** : tant que la variable existe sous ce nom, le risque de re-fuite (toute future référence client) persiste.

### D4 — Emplacement du secret serveur : fichier Droplet
`MARKETPLACE_API_KEY` est ajouté à `/opt/edupro-site/{staging,prod}.env` (là où vivent déjà `SUPABASE_SERVICE_ROLE_KEY`, etc.), injecté au runtime via `--env-file`. Pas besoin de build-arg (la clé n'est pas utilisée au build).

### D5 — Rotation
Nouvelle valeur générée, posée simultanément côté vitrine (Droplet) et côté SaaS (`MARKETPLACE_API_KEY`). L'ancienne valeur est invalidée. La rotation se fait APRÈS le retrait de la clé du client (D1), sinon la nouvelle clé fuiterait à son tour.

## Risks / Trade-offs

- **[Ordre de bascule]** → si le code passe à `MARKETPLACE_API_KEY` avant que la variable n'existe sur le Droplet, enroll/cadeau/paiement/catalogues cassent. Mitigation : poser `MARKETPLACE_API_KEY` sur le Droplet (même valeur d'abord) AVANT de déployer le code, puis roter.
- **[Proxy paiement]** → un bug dans les proxys casse le tunnel de paiement (sensible). Mitigation : tester promo + init paiement (solo et équipe avec JWT) avant prod.
- **[Achats équipe / JWT]** → le proxy doit relayer le `Authorization: Bearer` ; oublier ce relais casse l'auth cross-app. Couvert par un scénario de test.
- **[Clé compromise encore active]** → tant que la rotation n'est pas faite, `c482…` reste valable. Roter dès que D1 est déployé.

## Migration Plan

1. **Préparer la valeur** : décider de garder `c482…` temporairement OU générer la nouvelle clé.
2. **Ops (avant déploiement code)** : ajouter `MARKETPLACE_API_KEY` aux fichiers Droplet staging + prod.
3. **Code** : créer les proxys paiement, refactorer `payment-process.tsx`, retirer les fallbacks `NEXT_PUBLIC_*`, nettoyer Dockerfile + workflow.
4. **Déployer** la vitrine (les proxys portent la clé serveur).
5. **Roter** : nouvelle valeur sur Droplet vitrine + SaaS simultanément ; invalider l'ancienne.
6. **Nettoyer** : supprimer le secret d'Environnement GitHub `NEXT_PUBLIC_SAAS_API_KEY` (staging + prod).
7. **Vérifier** : promo, paiement (solo + équipe), inscription gratuite, cadeau, catalogues fonctionnels ; clé absente du bundle.

## Open Questions

- Roter immédiatement avec une nouvelle clé, ou réutiliser `c482…` le temps de la bascule puis roter dans la foulée ?
- Les proxys paiement vont-ils sous `/api/marketplace/*` (cohérent avec l'existant) ou sous un autre préfixe ?
