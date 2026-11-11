import * as Sentry from "@sentry/nextjs"
import { NextRequest, NextResponse } from "next/server"
import { trustedClientIp } from "@/lib/client-ip"
import { scrubText, scrubUrl } from "@/lib/sentry-scrub"

export const runtime = "nodejs"

/**
 * POST /api/client-error
 *
 * Reception des erreurs JavaScript survenues dans le navigateur du visiteur,
 * envoyees par public/error-reporter.js (ES5). Complement de Sentry : ce
 * script voit les erreurs de syntaxe des vieux navigateurs, qui empechent le
 * SDK Sentry lui-meme de demarrer, ainsi que les erreurs des premieres
 * secondes (le SDK est charge en differe).
 *
 * Point d'entree public par nature (visiteur anonyme), donc borne :
 * - origine verifiee (Origin ou Referer du site) ;
 * - 10 rapports par IP et par quart d'heure ;
 * - 300 rapports par heure transmis a Sentry, tous visiteurs confondus, pour
 *   qu'un script ne puisse pas epuiser le quota.
 * Au-dela, la requete repond 204 sans rien journaliser.
 */

const MAX_BODY_BYTES = 8 * 1024
const IP_WINDOW_MS = 15 * 60_000
const IP_MAX = 10
const GLOBAL_WINDOW_MS = 60 * 60_000
const GLOBAL_MAX = 300

const ipHits = new Map<string, number[]>()
let globalHits: number[] = []

function allowIp(key: string, now: number): boolean {
    const recent = (ipHits.get(key) ?? []).filter((t) => now - t < IP_WINDOW_MS)
    if (recent.length >= IP_MAX) {
        ipHits.set(key, recent)
        return false
    }
    recent.push(now)
    ipHits.delete(key)
    ipHits.set(key, recent)
    // Plafond memoire : eviction des cles les plus anciennes.
    for (const k of ipHits.keys()) {
        if (ipHits.size <= 5_000) break
        ipHits.delete(k)
    }
    return true
}

function allowGlobal(now: number): boolean {
    globalHits = globalHits.filter((t) => now - t < GLOBAL_WINDOW_MS)
    if (globalHits.length >= GLOBAL_MAX) return false
    globalHits.push(now)
    return true
}

function isSameSite(req: NextRequest): boolean {
    const source = req.headers.get("origin") || req.headers.get("referer")
    if (!source) return false
    try {
        const { origin, hostname } = new URL(source)
        if (origin === req.nextUrl.origin) return true
        if (/^(www\.)?edupro\.africa$/.test(hostname)) return true
        const site = process.env.NEXT_PUBLIC_APP_URL
        return Boolean(site) && origin === new URL(site as string).origin
    } catch {
        return false
    }
}

export async function POST(req: NextRequest) {
    try {
        if (!isSameSite(req)) return new NextResponse(null, { status: 204 })

        const now = Date.now()
        if (!allowIp(trustedClientIp(req), now)) return new NextResponse(null, { status: 204 })

        const raw = await req.text()
        if (raw.length > MAX_BODY_BYTES) {
            return NextResponse.json({ ok: false, error: "payload_too_large" }, { status: 413 })
        }

        let payload: Record<string, unknown> = {}
        try {
            payload = JSON.parse(raw)
        } catch {
            return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 })
        }

        const entry = {
            kind: String(payload.kind ?? "unknown").slice(0, 40),
            message: scrubText(String(payload.message ?? "")).slice(0, 500),
            source: scrubUrl(String(payload.source ?? "")).slice(0, 300),
            line: Number(payload.line) || undefined,
            col: Number(payload.col) || undefined,
            // Defense en profondeur : un ancien script en cache peut encore
            // envoyer l'URL complete, jetons compris.
            url: scrubUrl(String(payload.url ?? "")).slice(0, 300),
            ua: String(payload.ua ?? "").slice(0, 300),
            at: String(payload.at ?? new Date().toISOString()).slice(0, 40),
            stack: scrubText(String(payload.stack ?? "")).slice(0, 2000),
        }

        if (!allowGlobal(now)) return new NextResponse(null, { status: 204 })

        // Journaux serveur (filtres de captureConsoleIntegration dans
        // sentry.server.config.ts pour ne pas compter deux fois) puis Sentry,
        // avec un regroupement par message plutot qu'un evenement unique par
        // contenu JSON.
        console.error("[client-error]", JSON.stringify(entry))
        Sentry.withScope((scope) => {
            scope.setTag("source", "client-error-reporter")
            scope.setTag("kind", entry.kind)
            scope.setContext("client_error", entry)
            scope.setFingerprint(["client-error", entry.kind, entry.message.slice(0, 120)])
            Sentry.captureMessage(`[client] ${entry.message || "erreur inconnue"}`, "error")
        })

        return NextResponse.json({ ok: true })
    } catch {
        return NextResponse.json({ ok: false }, { status: 500 })
    }
}
