// PIERRE TOMBALE — ce service worker ne fait plus que se supprimer lui-meme.
//
// POURQUOI CE FICHIER EXISTE ENCORE.
// Plus aucune page du site n'enregistre de service worker : le code
// d'enregistrement a ete retire. Mais un service worker ne disparait PAS quand
// on cesse de l'enregistrer. Tout navigateur qui a visite le site a l'epoque le
// conserve indefiniment, et continue de se mettre a jour depuis /sw.js.
//
// Supprimer ce fichier ne reglerait donc rien : un 404 sur le script laisse la
// version deja installee en place. Le seul moyen d'atteindre ces navigateurs
// est de leur servir un service worker qui se desinscrit. D'ou ce fichier.
//
// NE PAS LE SUPPRIMER tant qu'on n'a pas la certitude qu'aucun navigateur ne
// porte plus l'ancienne version.
//
// CE QUE FAISAIT L'ANCIENNE VERSION (edupro-epic2-v1.1.0), ET POURQUOI ELLE
// BLOQUAIT LE PAIEMENT.
// Son handler `fetch` interceptait TOUT sauf /_next/, /api/v1/student/dashboard/
// et /api/payments/ — donc y compris les appels cross-origin vers Supabase
// (cgvetdddfskhrrjziiig.supabase.co). Ces requetes tombaient dans networkFirst,
// qui faisait `await fetch(request)` SANS TIMEOUT.
//
// Si le reseau echoue, le catch renvoie une erreur et la page l'affiche. Mais
// s'il STAGNE, l'await ne se resout jamais, respondWith non plus, et la requete
// de la page reste suspendue pour toujours. La page de commande
// (app/[locale]/checkout/[courseId]/page.tsx) attend ses deux requetes dans un
// Promise.all : son `finally`, qui remet `loading` a false, n'etait jamais
// atteint. Resultat : « Chargement des informations du cours... » indefiniment,
// sans erreur ni possibilite de reessayer, sur une page de PAIEMENT.
//
// Cela explique aussi pourquoi le probleme ne touchait qu'une partie des
// utilisateurs : seuls ceux dont le navigateur portait une ancienne inscription
// etaient concernes. Un navigateur neuf n'a jamais eu de service worker.
//
// Le meme defaut existait sur l'application SaaS ; il y a ete corrige en
// v1.1.4 par un contournement cross-origin. Le site vitrine, lui, etait reste
// sur la version d'avant.

self.addEventListener('install', () => {
  // Ne pas attendre la fermeture des onglets ouverts pour prendre le relais :
  // ce sont precisement eux qui sont bloques.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // 1. Prendre le controle des onglets deja ouverts. Comme cette version
      //    n'a AUCUN handler `fetch`, leurs requetes cessent immediatement
      //    d'etre interceptees.
      await self.clients.claim();

      // 2. Purger les caches laisses par les versions precedentes. Le Cache
      //    Storage n'avait ni plafond ni expiration : il peut peser lourd.
      const noms = await caches.keys();
      await Promise.all(noms.map((nom) => caches.delete(nom)));

      // 3. Se desinscrire. Le navigateur n'aura plus de service worker sur ce
      //    site, et n'en reprendra pas tant que rien ne l'enregistre.
      await self.registration.unregister();
    })()
  );
});

// AUCUN handler `fetch` — c'est le point essentiel. Rien n'est intercepte, ni
// pendant la desinscription, ni apres.
