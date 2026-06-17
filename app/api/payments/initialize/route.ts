import { NextRequest, NextResponse } from "next/server"

export const runtime = 'nodejs'

/**
 * Proxy serveur — initialisation de paiement.
 *
 * Relaie l'init de paiement du tunnel vers le SaaS en ajoutant `x-api-key`
 * CÔTÉ SERVEUR (la clé n'est plus exposée au navigateur). Le JWT utilisateur
 * (achats équipe, auth cross-app) est relayé via l'en-tête `Authorization`
 * quand il est présent.
 */
const SAAS_URL = process.env.SAAS_API_URL || process.env.NEXT_PUBLIC_SAAS_URL
const SAAS_API_KEY = process.env.MARKETPLACE_API_KEY

export async function POST(request: NextRequest) {
    if (!SAAS_URL || !SAAS_API_KEY) {
        return NextResponse.json(
            { success: false, message: "Configuration serveur incomplète (SAAS)." },
            { status: 500 },
        )
    }

    const body = await request.json().catch(() => ({}))

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-api-key': SAAS_API_KEY,
    }
    // Relais du JWT pour l'auth cross-app (achats équipe).
    const auth = request.headers.get('authorization')
    if (auth) headers['Authorization'] = auth

    try {
        const res = await fetch(`${SAAS_URL}/api/payments/initialize`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        })
        const data = await res.json().catch(() => ({}))
        return NextResponse.json(data, { status: res.status })
    } catch (error) {
        console.error('payments/initialize proxy error:', error)
        return NextResponse.json(
            { success: false, message: "Service de paiement indisponible. Réessayez." },
            { status: 502 },
        )
    }
}
