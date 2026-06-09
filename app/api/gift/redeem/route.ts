import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const SAAS_URL = process.env.SAAS_API_URL || process.env.NEXT_PUBLIC_SAAS_URL
const SAAS_API_KEY = process.env.MARKETPLACE_API_KEY || process.env.NEXT_PUBLIC_SAAS_API_KEY

/**
 * Relais serveur vers le SaaS `/api/marketplace/gifts/redeem` (server-to-server,
 * x-api-key). GET = aperçu d'un code ; POST = activation (redemption).
 */
export async function GET(req: NextRequest) {
    if (!SAAS_URL || !SAAS_API_KEY) {
        return NextResponse.json({ error: 'Configuration serveur incomplète.' }, { status: 500 })
    }
    const code = req.nextUrl.searchParams.get('code')
    if (!code) {
        return NextResponse.json({ error: 'Code requis.' }, { status: 400 })
    }

    try {
        const res = await fetch(`${SAAS_URL}/api/marketplace/gifts/redeem?code=${encodeURIComponent(code)}`, {
            headers: { 'x-api-key': SAAS_API_KEY },
        })
        const data = await res.json().catch(() => ({}))
        return NextResponse.json(data, { status: res.status })
    } catch (err) {
        console.error('Gift redeem GET proxy error:', err)
        return NextResponse.json({ error: 'Service indisponible.' }, { status: 502 })
    }
}

export async function POST(req: NextRequest) {
    if (!SAAS_URL || !SAAS_API_KEY) {
        return NextResponse.json({ error: 'Configuration serveur incomplète.' }, { status: 500 })
    }

    let body: any = {}
    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
    }

    const code = body?.code
    if (!code) {
        return NextResponse.json({ error: 'Code requis.' }, { status: 400 })
    }

    // Le destinataire est résolu côté SaaS depuis recipient_email du cadeau ;
    // on peut transmettre un email explicite si fourni.
    const recipient = body?.recipientEmail
        ? { email: body.recipientEmail }
        : undefined

    try {
        const res = await fetch(`${SAAS_URL}/api/marketplace/gifts/redeem`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': SAAS_API_KEY },
            body: JSON.stringify({ code, recipient }),
        })
        const data = await res.json().catch(() => ({}))
        return NextResponse.json(data, { status: res.status })
    } catch (err) {
        console.error('Gift redeem POST proxy error:', err)
        return NextResponse.json({ error: 'Service indisponible.' }, { status: 502 })
    }
}
