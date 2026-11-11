// Initialisation de Sentry côté serveur (runtime Node.js).
// Sans NEXT_PUBLIC_SENTRY_DSN, le SDK reste inactif.

import * as Sentry from "@sentry/nextjs"
import { scrubEvent } from "@/lib/sentry-scrub"

// Bruit attendu, déjà géré par le code ou le SDK (mêmes cas que le SaaS).
const IGNORED_NEEDLES = [
    // Onglet resté ouvert sur l'ancienne version après un déploiement.
    "The router state header was sent but could not be parsed",
    // Rotation des refresh tokens Supabase : le SDK nettoie lui-même.
    "Invalid Refresh Token",
    "refresh_token_already_used",
    "refresh_token_not_found",
    "Auth session missing",
]

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || undefined,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0),
    sendDefaultPii: false,

    // Les routes API journalisent puis répondent 500 sans relancer l'erreur :
    // sans cette intégration, elles resteraient invisibles. Elle remonte aussi
    // les rapports « [client-error] » des vieux navigateurs (public/error-reporter.js).
    integrations: [Sentry.captureConsoleIntegration({ levels: ["error"] })],

    beforeSend(event, hint) {
        try {
            const err = hint?.originalException as { message?: string } | undefined
            const texts = [err?.message, event.message, event.exception?.values?.[0]?.value]
            if (IGNORED_NEEDLES.some((n) => texts.some((t) => typeof t === "string" && t.includes(n)))) {
                return null
            }
            return scrubEvent(event)
        } catch {
            // Mieux vaut un événement sans contexte de requête que le silence.
            delete event.request
            return event
        }
    },
})
