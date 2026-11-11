// Initialisation de Sentry pour le runtime edge (middleware).
// Sans NEXT_PUBLIC_SENTRY_DSN, le SDK reste inactif.

import * as Sentry from "@sentry/nextjs"
import { scrubEvent } from "@/lib/sentry-scrub"

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || undefined,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0),
    sendDefaultPii: false,
    beforeSend(event) {
        try {
            return scrubEvent(event)
        } catch {
            delete event.request
            return event
        }
    },
})
