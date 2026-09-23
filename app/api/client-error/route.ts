import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

/**
 * POST /api/client-error
 *
 * Reception des erreurs JavaScript survenues dans le navigateur du visiteur.
 * Elles sont ecrites dans les journaux serveur (visibles dans les logs de
 * l'App Platform), avec un prefixe stable pour les retrouver d'un grep.
 *
 * Pourquoi ici et pas un service tiers : le site n'a pas de Sentry. Tant
 * qu'un DSN n'existe pas, ce point d'entree est le seul moyen de savoir ce
 * qui casse sur les appareils que nous ne possedons pas.
 *
 * Aucune authentification : un rapport d'erreur vient par definition d'un
 * visiteur anonyme. La taille est plafonnee et rien n'est persiste en base.
 */

const MAX_BODY_BYTES = 8 * 1024

export async function POST(req: NextRequest) {
    try {
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
            message: String(payload.message ?? "").slice(0, 500),
            source: String(payload.source ?? "").slice(0, 300),
            line: payload.line,
            col: payload.col,
            url: String(payload.url ?? "").slice(0, 300),
            ua: String(payload.ua ?? "").slice(0, 300),
            at: String(payload.at ?? new Date().toISOString()).slice(0, 40),
            stack: String(payload.stack ?? "").slice(0, 2000),
        }

        console.error("[client-error]", JSON.stringify(entry))

        return NextResponse.json({ ok: true })
    } catch {
        return NextResponse.json({ ok: false }, { status: 500 })
    }
}
