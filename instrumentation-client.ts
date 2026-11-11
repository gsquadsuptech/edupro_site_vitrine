// Initialisation de Sentry dans le navigateur, CHARGÉE EN DIFFÉRÉ.
//
// Le site est d'abord consulté sur mobile : importer le SDK ici directement
// ajoutait ~32 kB au JavaScript chargé par toutes les pages. Il est donc
// téléchargé une fois la page chargée et le navigateur inactif. Les erreurs
// des premières secondes ne sont pas perdues : public/error-reporter.js (ES5,
// chargé avant tout) les envoie à /api/client-error, remonté à Sentry côté
// serveur.
//
// Sans NEXT_PUBLIC_SENTRY_DSN (valeur inlinée au build), rien n'est chargé.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { scrubBreadcrumb, scrubEvent } from "@/lib/sentry-scrub"

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

function initSentry() {
    import("@sentry/nextjs")
        .then((Sentry) => {
            Sentry.init({
                dsn: DSN,
                environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
                // Erreurs uniquement : le code de traces est retiré du bundle au
                // build (next.config.ts, webpack.treeshake.removeTracing).
                tracesSampleRate: 0,
                sendDefaultPii: false,

                ignoreErrors: [
                    // Bruit de navigateurs et de WebViews, hors de notre code.
                    "ResizeObserver loop limit exceeded",
                    "ResizeObserver loop completed with undelivered notifications",
                    "Non-Error promise rejection captured",
                ],
                denyUrls: [/^chrome-extension:\/\//, /^moz-extension:\/\//, /^safari-(web-)?extension:\/\//],

                beforeSend(event, hint) {
                    try {
                        // Verrou d'auth de supabase-js (navigatorLock) : AbortError
                        // gérée par le SDK lui-même, même filtre que le SaaS
                        // (EDUPRO-SAAS-3V).
                        const err = hint?.originalException as { name?: string; message?: string } | undefined
                        const value = event.exception?.values?.[0]?.value || ""
                        const fromLock = (err?.message || value).includes("navigatorLock")
                        if (fromLock && (err?.name === "AbortError" || value.includes("signal is aborted"))) return null
                        return scrubEvent(event)
                    } catch {
                        // Un filtre qui plante ne doit pas faire disparaître
                        // l'erreur : on l'envoie sans URL ni requête (jetons possibles).
                        delete event.request
                        delete event.breadcrumbs
                        return event
                    }
                },
                beforeBreadcrumb(crumb) {
                    try {
                        return scrubBreadcrumb(crumb)
                    } catch {
                        return null
                    }
                },
            })
        })
        .catch(() => {
            // Chunk bloqué (bloqueur, réseau) : le rapporteur ES5 reste actif.
        })
}

if (DSN && typeof window !== "undefined") {
    const schedule = () => {
        const w = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }
        if (typeof w.requestIdleCallback === "function") w.requestIdleCallback(initSentry, { timeout: 5000 })
        else setTimeout(initSentry, 2000)
    }
    if (document.readyState === "complete") schedule()
    else window.addEventListener("load", schedule, { once: true })
}
