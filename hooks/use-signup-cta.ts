"use client"

import { useAuth } from "@/hooks/useAuth"

/**
 * Bouton « Créer mon compte gratuit » des pages publiques : une fois connecté,
 * il n'a plus de sens. On le remplace par l'étape suivante utile à un
 * apprenant, le catalogue.
 */
export function useSignupCta(locale: string) {
    const { user } = useAuth()
    const signedIn = Boolean(user)
    return {
        signedIn,
        href: signedIn ? `/${locale}/catalogue` : `/${locale}/inscription`,
        /** Libellé à afficher : celui fourni tant que l'utilisateur n'est pas connecté. */
        label: (signupLabel: string) =>
            signedIn ? (locale === "en" ? "Browse the catalog" : "Explorer le catalogue") : signupLabel,
    }
}
