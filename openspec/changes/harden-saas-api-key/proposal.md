## Why

La clé d'intégration SaaS de la vitrine est exposée sous le nom `NEXT_PUBLIC_SAAS_API_KEY` : `components/payment/payment-process.tsx` est un composant **client** qui appelle le SaaS directement (`x-api-key`), donc la clé est **inlinée dans le bundle navigateur** et extractible par tout visiteur. Cette clé protège la validation de code promo, l'initialisation de paiement, l'inscription, le cadeau et les catalogues — sa fuite est une faille de sécurité active (HIGH).

## What Changes

- **BREAKING (config)** : la clé API SaaS devient un secret **strictement serveur** (`MARKETPLACE_API_KEY`). `NEXT_PUBLIC_SAAS_API_KEY` est supprimé du code, du Dockerfile, du workflow et des secrets GitHub.
- Les appels client → SaaS de `payment-process.tsx` (validation code promo + init paiement) passent désormais par des **routes proxy serveur** de la vitrine, qui portent la clé côté serveur (comme `enroll`/`cadeau` le font déjà).
- `enroll`/`cadeau`/`catalog-service` n'utilisent plus que `MARKETPLACE_API_KEY` (suppression du fallback `NEXT_PUBLIC_SAAS_API_KEY`).
- **Rotation** : la clé actuelle (`c482…`) est compromise et doit être remplacée par une nouvelle valeur, posée côté vitrine (Droplet) et côté SaaS.

## Capabilities

### New Capabilities
- `saas-api-key-server-side`: la clé d'API SaaS n'est jamais exposée au navigateur ; tous les appels vitrine → SaaS transitent par des routes serveur authentifiées par un secret serveur.

### Modified Capabilities
<!-- Aucune capability existante dans openspec/specs/. -->

## Impact

**edupro-site (vitrine) :**
- `components/payment/payment-process.tsx` : remplacer les 2 `fetch` directs vers le SaaS par des appels aux proxys serveur internes.
- Nouvelles routes proxy : `app/api/marketplace/discounts/validate/route.ts` et `app/api/marketplace/payments/init/route.ts` (ou équivalent) — clé `MARKETPLACE_API_KEY` côté serveur, transmission éventuelle du JWT pour les achats équipe.
- `app/api/enroll/free/route.ts`, `app/api/gift/route.ts`, `app/api/gift/redeem/route.ts`, `services/catalog-service.ts` : retirer le fallback `NEXT_PUBLIC_SAAS_API_KEY`.
- `Dockerfile` : retirer `ARG`/`ENV NEXT_PUBLIC_SAAS_API_KEY`.
- `.github/workflows/deploy.yml` : retirer le build-arg et le `-e` runtime `NEXT_PUBLIC_SAAS_API_KEY`.

**Configuration / ops :**
- Ajouter `MARKETPLACE_API_KEY` (nouvelle valeur rotée) aux fichiers Droplet `/opt/edupro-site/{staging,prod}.env`.
- Mettre `MARKETPLACE_API_KEY` côté SaaS à la même nouvelle valeur.
- Supprimer le secret d'Environnement GitHub `NEXT_PUBLIC_SAAS_API_KEY` (staging + production).

## Non-Goals

- Modifier la logique métier du paiement, des codes promo, de l'inscription ou des catalogues (uniquement le transport de la clé).
- Changer le mécanisme d'authentification cross-app par JWT (il est conservé, simplement relayé par le proxy).
