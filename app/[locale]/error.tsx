"use client"

import { useEffect } from "react"
import Link from "next/link"

/**
 * Error boundary du site.
 *
 * Avant ce fichier, toute exception dans un composant affichait la page
 * blanche generique de Next (« Application error: a client-side exception
 * has occurred »), sans aucune trace exploitable. Ici on affiche un message
 * lisible, on propose de reessayer, et on envoie l'erreur au serveur pour
 * pouvoir la diagnostiquer.
 *
 * Texte volontairement en dur, sans next-intl : si l'erreur vient du
 * chargement des traductions, une boundary qui en depend casserait a son tour.
 */
export default function LocaleError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        const report = (window as unknown as { __eduproReportError?: (e: Error, extra?: unknown) => void })
            .__eduproReportError
        if (typeof report === "function") {
            report(error, { digest: error.digest })
        }
    }, [error])

    return (
        <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
            <div className="max-w-md text-center">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Un imprevu est survenu
                </p>
                <h1 className="mb-3 text-2xl font-bold">Cette page n&apos;a pas pu s&apos;afficher</h1>
                <p className="mb-6 text-muted-foreground">
                    Le probleme a ete signale a notre equipe. Vous pouvez reessayer, ou revenir
                    a l&apos;accueil. Si cela se reproduit sur un iPhone ancien, une mise a jour
                    d&apos;iOS resout generalement le probleme.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                    <button
                        type="button"
                        onClick={reset}
                        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    >
                        Reessayer
                    </button>
                    <Link
                        href="/"
                        className="rounded-md border px-4 py-2 text-sm font-medium"
                    >
                        Retour a l&apos;accueil
                    </Link>
                </div>
                {error.digest && (
                    <p className="mt-6 text-xs text-muted-foreground">Reference : {error.digest}</p>
                )}
            </div>
        </div>
    )
}
