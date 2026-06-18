import { NextRequest, NextResponse } from "next/server"

export const runtime = 'nodejs'

/**
 * Proxy serveur — prix effectif (promos publiques) pour les composants client
 * (tunnel de paiement). Relaie la requête vers l'API SaaS publique
 * `POST /api/marketplace/pricing`.
 *
 * L'endpoint SaaS est public (pas de clé API), mais on passe par un proxy pour
 * résoudre l'URL de base côté serveur (en dev, `SAAS_API_URL` pointe sur le SaaS
 * local) et homogénéiser le pattern d'appel de la vitrine.
 *
 * Robustesse : cet appel ne doit JAMAIS bloquer le checkout. En cas d'erreur ou
 * de configuration absente, on renvoie `{ prices: {} }` (HTTP 200) → le client
 * se rabat sur le prix normal.
 */
const SAAS_URL = process.env.SAAS_API_URL || process.env.NEXT_PUBLIC_SAAS_URL

export async function POST(request: NextRequest) {
    if (!SAAS_URL) {
        return NextResponse.json({ prices: {} }, { status: 200 })
    }

    const body = await request.json().catch(() => ({}))

    try {
        const res = await fetch(`${SAAS_URL}/api/marketplace/pricing`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            // Borne le temps d'attente pour ne jamais retarder le checkout.
            signal: AbortSignal.timeout(5000),
        })
        const data = await res.json().catch(() => ({ prices: {} }))
        return NextResponse.json(data, { status: res.ok ? 200 : res.status })
    } catch (error) {
        console.error('marketplace/pricing proxy error:', error)
        return NextResponse.json({ prices: {} }, { status: 200 })
    }
}
