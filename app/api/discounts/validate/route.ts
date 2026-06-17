import { NextRequest, NextResponse } from "next/server"

export const runtime = 'nodejs'

/**
 * Proxy serveur — validation de code promo.
 *
 * Relaie la requête du tunnel de paiement vers le SaaS en ajoutant
 * `x-api-key` CÔTÉ SERVEUR. La clé n'est donc jamais embarquée dans le bundle
 * navigateur (cf. durcissement : la clé était auparavant lue côté client via
 * NEXT_PUBLIC_SAAS_API_KEY dans payment-process.tsx).
 */
const SAAS_URL = process.env.SAAS_API_URL || process.env.NEXT_PUBLIC_SAAS_URL
const SAAS_API_KEY = process.env.MARKETPLACE_API_KEY

export async function POST(request: NextRequest) {
    if (!SAAS_URL || !SAAS_API_KEY) {
        return NextResponse.json(
            { isValid: false, errors: ["Configuration serveur incomplète (SAAS)."] },
            { status: 500 },
        )
    }

    const body = await request.json().catch(() => ({}))

    try {
        const res = await fetch(`${SAAS_URL}/api/discounts/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': SAAS_API_KEY },
            body: JSON.stringify(body),
        })
        const data = await res.json().catch(() => ({}))
        return NextResponse.json(data, { status: res.status })
    } catch (error) {
        console.error('discounts/validate proxy error:', error)
        return NextResponse.json(
            { isValid: false, errors: ["Service indisponible. Réessayez."] },
            { status: 502 },
        )
    }
}
