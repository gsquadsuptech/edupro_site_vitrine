/**
 * Borne une promesse dans le temps.
 *
 * POURQUOI. Une promesse qui n'aboutit jamais n'est pas une erreur : c'est un
 * silence. Rien ne se declenche, aucun `catch` ne s'execute, aucun `finally`
 * non plus — et l'interface reste indefiniment sur son etat de chargement.
 *
 * C'est exactement ce qui a bloque la page de paiement : un service worker
 * interceptait les requetes Supabase et faisait `await fetch(request)` sans
 * borne. Quand le reseau stagnait au lieu d'echouer, la requete restait
 * suspendue, le `Promise.all` de la page aussi, et le spinner tournait sans
 * fin. Un echec franc, lui, aurait au moins affiche un message.
 *
 * Une requete qui n'a pas repondu au bout de quelques secondes ne repondra
 * generalement plus. Mieux vaut le dire a l'utilisateur et lui proposer de
 * reessayer que de le laisser devant une animation.
 */
export class TimeoutError extends Error {
  constructor(message = 'Delai depasse') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export function estTimeout(erreur: unknown): boolean {
  return erreur instanceof TimeoutError;
}

/**
 * Resout comme la promesse fournie, ou rejette avec TimeoutError au-dela du
 * delai.
 *
 * NB : la promesse d'origine n'est pas annulee — on ne peut pas annuler une
 * promesse. Elle continue en arriere-plan et son resultat est ignore. Pour une
 * lecture, c'est sans consequence ; ne pas utiliser tel quel pour une ecriture
 * dont on voudrait garantir qu'elle n'a pas eu lieu.
 */
export function withTimeout<T>(
  promesse: Promise<T>,
  delaiMs: number,
  libelle = 'requete'
): Promise<T> {
  let minuteur: ReturnType<typeof setTimeout>;

  const echeance = new Promise<never>((_, rejeter) => {
    minuteur = setTimeout(
      () => rejeter(new TimeoutError(`${libelle} : pas de reponse apres ${delaiMs} ms`)),
      delaiMs
    );
  });

  return Promise.race([promesse, echeance]).finally(() => {
    clearTimeout(minuteur);
  }) as Promise<T>;
}
