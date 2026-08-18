import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export const runtime = 'nodejs'

const SAAS_URL = process.env.SAAS_API_URL || process.env.NEXT_PUBLIC_SAAS_URL
const SAAS_API_KEY = process.env.MARKETPLACE_API_KEY

/**
 * Inscription gratuite — relais serveur vers le SaaS
 * `POST /api/marketplace/payments/init` (amount=0).
 *
 * Aligné sur les flux cadeau/paiement : l'inscription est créée DANS LA BASE
 * SAAS (source de vérité du dashboard étudiant) via EnrollmentService, et non
 * plus en écriture directe dans la base vitrine. Le cours est aussi validé
 * côté SaaS, là où il est géré — ce qui évite les « Cours introuvable » dus à
 * un désalignement entre la base lue par la vitrine et la base d'inscription.
 *
 * L'inscrit (customer) est l'utilisateur connecté : on l'authentifie via les
 * cookies de session (pas de confiance au client pour l'identité).
 */
export async function POST(request: NextRequest) {
    if (!SAAS_URL || !SAAS_API_KEY) {
        return NextResponse.json(
            { error: "Configuration serveur incomplète (SAAS)." },
            { status: 500 }
        )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !anonKey) {
        return NextResponse.json(
            { error: "Configuration serveur incorrecte" },
            { status: 500 }
        )
    }

    // Authentifier l'inscrit via ses cookies de session.
    const cookieStore = await cookies()
    const supabase = createServerClient(supabaseUrl, anonKey, {
        cookies: {
            getAll() {
                return cookieStore.getAll()
            },
            setAll() {
                // no-op : route handler, cookies en lecture seule ici
            },
        },
    })

    const { data: userData, error: userError } = await supabase.auth.getUser()
    const user = userData?.user
    if (userError || !user?.email) {
        return NextResponse.json(
            { error: "Vous devez être connecté pour vous inscrire." },
            { status: 401 }
        )
    }

    const body = await request.json().catch(() => ({}))
    const { courseId, cohortId, purchaseMode, seats, organizationId } = body as {
        courseId?: string
        cohortId?: string
        purchaseMode?: 'individual' | 'team'
        seats?: number
        organizationId?: string
    }
    if (!courseId) {
        return NextResponse.json({ error: "courseId est requis" }, { status: 400 })
    }

    const meta = (user.user_metadata || {}) as any
    const fullName: string = meta.full_name || meta.name || ''
    const [firstName, ...rest] = fullName.split(' ')
    const lastName = meta.last_name || (rest.length ? rest.join(' ') : undefined)

    // redirectUrl est requis par le schéma SaaS (zod .url()) ; il n'est pas
    // utilisé côté vitrine (le client gère l'écran de confirmation), mais doit
    // être une URL valide.
    const origin = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin

    // Achat groupé d'un contenu GRATUIT : il n'y a pas de paiement, mais il faut
    // quand même créer le pool de sièges (`purchase_seat_pools`). Sans ça l'admin
    // était simplement inscrit à titre individuel et n'avait rien à distribuer
    // (« Aucun achat groupé » dans /admin/billing/seat-pools).
    //
    // On relaie vers `POST /api/payments/initialize` du SaaS (amount = 0) plutôt
    // que vers `/api/marketplace/payments/init` : c'est cet endpoint qui porte
    // déjà les validations équipe (admin de l'org, plan one_time, pas de pool
    // actif en double) et qui marque `payment_details` pour qu'EnrollmentService
    // crée le pool au lieu d'un enrollment.
    if (purchaseMode === 'team') {
        const seatsNum = Number(seats)
        if (!organizationId) {
            return NextResponse.json(
                { error: "L'achat groupé nécessite une organisation acheteuse." },
                { status: 400 }
            )
        }
        if (!Number.isFinite(seatsNum) || seatsNum < 1) {
            return NextResponse.json(
                { error: "Le nombre de sièges doit être d'au moins 1." },
                { status: 400 }
            )
        }

        try {
            const res = await fetch(`${SAAS_URL}/api/payments/initialize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-api-key': SAAS_API_KEY },
                body: JSON.stringify({
                    courseId,
                    cohortId: cohortId || undefined,
                    itemType: 'course',
                    itemId: courseId,
                    amount: 0,
                    currency: 'XOF',
                    // V1 : l'achat équipe n'existe qu'en paiement unique.
                    paymentPlan: 'one_time',
                    purchaseMode: 'team',
                    seats: seatsNum,
                    organizationId,
                    // Le SaaS résout l'acheteur via l'email (pas de cookie de
                    // session en appel serveur-à-serveur avec x-api-key).
                    userId: user.id,
                    email: user.email,
                    firstName: meta.first_name || firstName || undefined,
                    lastName,
                    returnUrl: origin,
                }),
            })
            const data = await res.json().catch(() => ({}))

            if (!res.ok || !data?.success) {
                return NextResponse.json(
                    {
                        error: data?.message || "Échec de l'achat groupé",
                        code: data?.error,
                    },
                    { status: res.ok ? 500 : res.status }
                )
            }

            return NextResponse.json({
                success: true,
                free: true,
                teamPurchase: true,
                seats: seatsNum,
                reference: data.reference,
                // Le checkout affiche `data.enrollment` en priorité : on y remet
                // les sièges pour le récapitulatif de confirmation.
                enrollment: { reference: data.reference, seats: seatsNum },
            })
        } catch (error) {
            console.error('Free team enroll proxy error:', error)
            return NextResponse.json(
                { error: "Service d'inscription indisponible. Réessayez." },
                { status: 502 }
            )
        }
    }

    const payload = {
        courseId,
        cohortId: cohortId || undefined,
        amount: 0,
        currency: 'XOF',
        customer: {
            email: user.email,
            firstName: meta.first_name || firstName || undefined,
            lastName,
            phone: meta.phone || undefined,
        },
        redirectUrl: origin,
    }

    try {
        const res = await fetch(`${SAAS_URL}/api/marketplace/payments/init`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': SAAS_API_KEY },
            body: JSON.stringify(payload),
        })
        const data = await res.json().catch(() => ({}))

        if (!res.ok) {
            return NextResponse.json(
                { error: data?.error || "Échec de l'inscription gratuite" },
                { status: res.status }
            )
        }

        return NextResponse.json({
            success: true,
            free: true,
            reference: data.reference,
            enrollment: { reference: data.reference },
        })
    } catch (error: any) {
        console.error('Free enroll proxy error:', error)
        return NextResponse.json(
            { error: "Service d'inscription indisponible. Réessayez." },
            { status: 502 }
        )
    }
}
