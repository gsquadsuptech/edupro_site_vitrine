import type { Breadcrumb, ErrorEvent } from "@sentry/nextjs"

/**
 * Nettoyage des données sensibles avant tout envoi à Sentry.
 *
 * Les liens de confirmation et de réinitialisation Supabase transportent les
 * jetons de session dans l'URL : dans le hash (`#access_token=…&refresh_token=…`)
 * ou dans la query (`?code=…`, `?token_hash=…`). Une erreur sur
 * /auth/callback les enverrait tels quels.
 */
const SENSITIVE_PARAMS = [
    "access_token",
    "refresh_token",
    "provider_token",
    "provider_refresh_token",
    "token",
    "token_hash",
    "code",
    "password",
]

export function scrubUrl(raw: string): string {
    if (!raw) return raw
    try {
        const absolute = /^[a-z][a-z0-9+.-]*:/i.test(raw)
        const url = new URL(raw, "http://relative.invalid")
        url.hash = ""
        for (const p of SENSITIVE_PARAMS) {
            if (url.searchParams.has(p)) url.searchParams.set(p, "[filtré]")
        }
        return absolute ? url.toString() : url.pathname + url.search
    } catch {
        return raw.split("#")[0]
    }
}

export function scrubEvent<T extends ErrorEvent>(event: T): T {
    if (event.user) {
        delete event.user.email
        delete event.user.ip_address
    }
    if (event.request) {
        if (typeof event.request.url === "string") event.request.url = scrubUrl(event.request.url)
        if (typeof event.request.query_string === "string") {
            event.request.query_string = scrubUrl(`?${event.request.query_string}`).replace(/^[^?]*\?/, "")
        }
        const headers = event.request.headers as Record<string, unknown> | undefined
        if (headers) {
            delete headers.authorization
            delete headers.Authorization
            delete headers.cookie
            delete headers.Cookie
        }
        delete event.request.cookies
        delete event.request.data
    }
    if (event.breadcrumbs) event.breadcrumbs = event.breadcrumbs.map(scrubBreadcrumb)
    return event
}

export function scrubBreadcrumb(crumb: Breadcrumb): Breadcrumb {
    const data = crumb.data as Record<string, unknown> | undefined
    if (data) {
        for (const key of ["url", "from", "to"]) {
            if (typeof data[key] === "string") data[key] = scrubUrl(data[key] as string)
        }
    }
    return crumb
}
