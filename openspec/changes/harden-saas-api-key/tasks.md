## 1. Pré-requis ops (avant tout déploiement code)

- [ ] 1.1 Ajouter `MARKETPLACE_API_KEY` à `/opt/edupro-site/staging.env` et `/opt/edupro-site/prod.env` (valeur actuelle dans un premier temps)
- [ ] 1.2 Confirmer que le SaaS valide bien `x-api-key` contre son `MARKETPLACE_API_KEY` (même valeur côté vitrine)

## 2. Proxys serveur paiement (vitrine)

- [x] 2.1 Créer la route proxy validation code promo : relaie `POST` vers `${SAAS}/api/discounts/validate` avec `x-api-key` serveur ; même payload/réponse
- [x] 2.2 Créer la route proxy init paiement : relaie l'init vers le SaaS avec `x-api-key` serveur ; transmet `Authorization: Bearer <jwt>` si présent (achats équipe)
- [x] 2.3 Les deux proxys lisent `process.env.MARKETPLACE_API_KEY` (sans fallback public) et renvoient une erreur claire si absent

## 3. Refactor client (vitrine)

- [x] 3.1 `components/payment/payment-process.tsx` : remplacer le `fetch` direct de validation promo (l.~180) par un appel au proxy 2.1, sans en-tête `x-api-key`
- [x] 3.2 `components/payment/payment-process.tsx` : remplacer le `fetch` direct d'init paiement (l.~275) par un appel au proxy 2.2 (le JWT est géré côté proxy)
- [x] 3.3 Vérifier qu'aucune référence à `NEXT_PUBLIC_SAAS_API_KEY` ne subsiste dans du code client

## 4. Unifier la clé côté routes serveur

- [x] 4.1 `app/api/enroll/free/route.ts` : `MARKETPLACE_API_KEY` seul (retirer le fallback `NEXT_PUBLIC_SAAS_API_KEY`)
- [x] 4.2 `app/api/gift/route.ts` et `app/api/gift/redeem/route.ts` : idem
- [x] 4.3 `services/catalog-service.ts` : déjà sur `MARKETPLACE_API_KEY` — vérifier (rien à changer)

## 5. Nettoyer la chaîne de build

- [x] 5.1 `Dockerfile` : retirer `ARG NEXT_PUBLIC_SAAS_API_KEY` et `ENV NEXT_PUBLIC_SAAS_API_KEY`
- [x] 5.2 `.github/workflows/deploy.yml` : retirer le build-arg `NEXT_PUBLIC_SAAS_API_KEY` (l.~116) et le `-e` runtime (l.~232)
- [ ] 5.3 Supprimer le secret d'Environnement GitHub `NEXT_PUBLIC_SAAS_API_KEY` (staging + production) — **ops (toi)**

## 6. Rotation

- [ ] 6.1 Générer une nouvelle clé
- [ ] 6.2 La poser simultanément sur Droplet vitrine (staging + prod) et côté SaaS `MARKETPLACE_API_KEY`
- [ ] 6.3 Invalider l'ancienne valeur (`c482…`)

## 7. Vérification

- [x] 7.1 `npx tsc --noEmit` propre (vitrine)
- [x] 7.2 Inspecter le bundle navigateur : la clé API SaaS n'y apparaît plus ; `grep -r NEXT_PUBLIC_SAAS_API_KEY` ne renvoie rien (code/Dockerfile/workflow propres)
- [ ] 7.3 Tests fonctionnels : code promo, paiement solo, paiement équipe (JWT), inscription gratuite, cadeau, redeem cadeau, page catalogue
