import type { Breadcrumb, ErrorEvent } from "@sentry/nextjs"

/**
 * Nettoyage des données sensibles avant tout envoi à Sentry.
 *
 * Les liens de confirmation et de réinitialisation Supabase transportent les
 * jetons de session dans l'URL : dans le hash (`#access_token=…&refresh_token=…`)
 * ou dans la query (`?code=…`, `?token_hash=…`). Une erreur sur
 * /auth/callback les enverrait tels quels : dans l'URL de la requête, le
 * Referer, les breadcrumbs, la pile d'appels (scripts inline) ou le message.
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

// Même liste, pour du texte libre (message d'erreur, chemin de fichier).
const SENSITIVE_IN_TEXT = new RegExp(`\\b(${SENSITIVE_PARAMS.join("|")})=[^&\\s#"'<>]+`, "gi")

// En-têtes qui révèlent l'identité ou l'adresse du visiteur.
const DROPPED_HEADERS = [
    "authorization",
    "cookie",
    "x-forwarded-for",
    "x-real-ip",
    "cf-connecting-ip",
    "true-client-ip",
    "x-client-ip",
]

export function scrubText(text: string): string {
    return text ? text.replace(SENSITIVE_IN_TEXT, "$1=[filtré]") : text
}

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
        return scrubText(raw.split("#")[0])
    }
}

export function scrubEvent<T extends ErrorEvent>(event: T): T {
    if (event.user) {
        delete event.user.email
        delete event.user.ip_address
    }
    if (typeof event.message === "string") event.message = scrubText(event.message)

    for (const ex of event.exception?.values ?? []) {
        if (typeof ex.value === "string") ex.value = scrubText(ex.value)
        for (const frame of ex.stacktrace?.frames ?? []) {
            if (typeof frame.filename === "string") frame.filename = scrubUrl(frame.filename)
            if (typeof frame.abs_path === "string") frame.abs_path = scrubUrl(frame.abs_path)
        }
    }

    if (event.request) {
        if (typeof event.request.url === "string") event.request.url = scrubUrl(event.request.url)
        if (typeof event.request.query_string === "string") {
            event.request.query_string = scrubText(event.request.query_string)
        }
        const headers = event.request.headers as Record<string, unknown> | undefined
        if (headers) {
            for (const name of Object.keys(headers)) {
                const lower = name.toLowerCase()
                if (DROPPED_HEADERS.includes(lower)) delete headers[name]
                else if (lower === "referer" && typeof headers[name] === "string") {
                    headers[name] = scrubUrl(headers[name] as string)
                }
            }
        }
        delete event.request.cookies
        delete event.request.data
    }
    if (event.breadcrumbs) event.breadcrumbs = event.breadcrumbs.map(scrubBreadcrumb)
    return event
}

export function scrubBreadcrumb(crumb: Breadcrumb): Breadcrumb {
    if (typeof crumb.message === "string") crumb.message = scrubText(crumb.message)
    const data = crumb.data as Record<string, unknown> | undefined
    if (data) {
        for (const key of ["url", "from", "to"]) {
            if (typeof data[key] === "string") data[key] = scrubUrl(data[key] as string)
        }
    }
    return crumb
}
