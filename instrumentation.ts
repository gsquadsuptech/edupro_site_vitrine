import * as Sentry from "@sentry/nextjs"

export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        await import("./sentry.server.config")
    }
    if (process.env.NEXT_RUNTIME === "edge") {
        await import("./sentry.edge.config")
    }
}

// Erreurs non rattrapées des Server Components, routes et middleware.
export const onRequestError = Sentry.captureRequestError
