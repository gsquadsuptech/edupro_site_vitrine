import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const SAAS_URL = process.env.SAAS_API_URL || process.env.NEXT_PUBLIC_SAAS_URL
const SAAS_API_KEY = process.env.MARKETPLACE_API_KEY

/**
 * « Offrir en cadeau » — relais serveur vers le SaaS `POST /api/marketplace/gifts`.
 *
 * - L'acheteur (customer) est l'utilisateur connecté (session cookies).
 * - Le montant et le cours sont résolus côté serveur (pas de confiance au client).
 * - On fournit redirectUrl (retour paiement) et redemptionUrl (page d'activation
 *   du cadeau côté vitrine, le SaaS y ajoute ?code=<code>).
 */
export async function POST(req: NextRequest) {
    if (!SAAS_URL || !SAAS_API_KEY) {
        return NextResponse.json({ message: 'Configuration serveur incomplète (SAAS).' }, { status: 500 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !anonKey) {
        return NextResponse.json({ message: 'Configuration serveur incomplète (Supabase).' }, { status: 500 })
    }

    let body: any = {}
    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ message: 'Requête invalide.' }, { status: 400 })
    }

    const { courseId, recipientEmail, recipientName, message, locale = 'fr' } = body || {}
    if (!courseId || !recipientEmail) {
        return NextResponse.json({ message: 'Cours et email du destinataire requis.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(recipientEmail))) {
        return NextResponse.json({ message: 'Email du destinataire invalide.' }, { status: 400 })
    }

    // 1. Acheteur = utilisateur connecté
    const cookieStore = await cookies()
    const supabase = createServerClient(supabaseUrl, anonKey, {
        cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} },
    })
    const { data: userData } = await supabase.auth.getUser()
    const buyer = userData?.user
    if (!buyer?.email) {
        return NextResponse.json(
            { message: 'Vous devez être connecté pour offrir cette formation.' },
            { status: 401 }
        )
    }

    // 2. Résolution serveur du cours + montant (cours publié = lecture publique)
    const anon = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } })
    const { data: course, error: courseError } = await anon
        .from('courses')
        .select('id, slug, title, price, one_time_price, access_type')
        .eq('id', courseId)
        .eq('status', 'published')
        .maybeSingle()

    if (courseError || !course) {
        return NextResponse.json({ message: 'Formation introuvable.' }, { status: 404 })
    }

    const c = course as any
    const amount = c.access_type === 'free'
        ? 0
        : Number(c.one_time_price || c.price || 0)

    // 3. URLs de retour / redemption
    const origin = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin
    const courseUrl = `${origin}/${locale}/formation/${c.slug}`
    const meta = (buyer.user_metadata || {}) as any
    const fullName: string = meta.full_name || meta.name || ''
    const [firstName, ...rest] = fullName.split(' ')

    const payload = {
        courseId: c.id,
        amount,
        currency: 'XOF',
        customer: {
            email: buyer.email,
            firstName: meta.first_name || firstName || undefined,
            lastName: meta.last_name || (rest.length ? rest.join(' ') : undefined),
            phone: meta.phone || undefined,
        },
        recipient: { email: recipientEmail, name: recipientName || undefined },
        message: message || undefined,
        redirectUrl: `${courseUrl}?gift=success`,
        cancelUrl: `${courseUrl}?gift=cancel`,
        redemptionUrl: `${origin}/${locale}/cadeau/redeem`,
    }

    // 4. Appel SaaS
    try {
        const res = await fetch(`${SAAS_URL}/api/marketplace/gifts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': SAAS_API_KEY },
            body: JSON.stringify(payload),
        })
        const data = await res.json().catch(() => ({}))

        if (!res.ok) {
            return NextResponse.json(
                { message: data?.error || "Échec de la création du cadeau." },
                { status: res.status }
            )
        }

        // redirectUrl = URL de paiement (cadeau payant) ou page de retour (cadeau gratuit)
        return NextResponse.json({
            redirectUrl: data.redirectUrl,
            free: !!data.free,
            giftId: data.giftId,
        })
    } catch (err) {
        console.error('Gift proxy error:', err)
        return NextResponse.json({ message: 'Service cadeau indisponible. Réessayez.' }, { status: 502 })
    }
}
