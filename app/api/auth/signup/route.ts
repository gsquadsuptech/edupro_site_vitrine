
import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import { verifyTurnstileToken, getRemoteIp } from "@/lib/turnstile"

export const runtime = 'nodejs'

const SUPPORTED_LOCALES = new Set(['fr', 'en'])

// Origine du lien de confirmation : jamais prise telle quelle dans les
// en-têtes (falsifiables). Liste blanche, sinon le domaine de production.
const DEFAULT_SITE_ORIGIN = 'https://edupro.africa'
function resolveSiteOrigin(headerOrigin: string | null): string {
    const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '')
    if (!headerOrigin) return fromEnv || DEFAULT_SITE_ORIGIN
    const allowed =
        headerOrigin === fromEnv ||
        /^https:\/\/(www\.)?edupro\.africa$/.test(headerOrigin) ||
        (process.env.NODE_ENV !== 'production' && /^http:\/\/localhost:\d+$/.test(headerOrigin))
    return allowed ? headerOrigin : (fromEnv || DEFAULT_SITE_ORIGIN)
}

// Chemin interne uniquement (pas de redirection ouverte via `next`) : on
// résout l'URL et on exige la même origine, plutôt qu'un test de préfixe
// contournable (tabulations/retours ligne retirés par les navigateurs,
// antislashs…).
function sanitizeNext(next: unknown): string | null {
    if (typeof next !== 'string' || next.length > 512) return null
    if (!next.startsWith('/') || /[\x00-\x1f\\]/.test(next)) return null
    try {
        const base = 'https://internal.invalid'
        const url = new URL(next, base)
        if (url.origin !== base) return null
        return url.pathname + url.search
    } catch {
        return null
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password, firstName, lastName, captchaToken } = body
        // Inscription publique = apprenant uniquement. Le rôle n'est jamais
        // lu depuis la requête (sinon `role: 'admin'` passait dans les
        // métadonnées du compte).
        const role = 'student'
        const locale = SUPPORTED_LOCALES.has(body.locale) ? body.locale : 'fr'
        const next = sanitizeNext(body.next)

        if (!email || !password || !firstName) {
            return NextResponse.json(
                { error: "Email, mot de passe et prénom sont requis" },
                { status: 400 }
            )
        }

        // Cette route utilise la service-role et bypasse donc le Captcha
        // natif Supabase. On vérifie le token Turnstile manuellement.
        const captcha = await verifyTurnstileToken(captchaToken, getRemoteIp(request))
        if (!captcha.success) {
            return NextResponse.json(
                { error: "Captcha invalide. Rechargez la page et réessayez." },
                { status: 400 }
            )
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseUrl || !serviceRoleKey) {
            return NextResponse.json(
                { error: "Configuration serveur incorrecte" },
                { status: 500 }
            )
        }

        const supabaseAdmin = createClient(
            supabaseUrl,
            serviceRoleKey,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        const origin = resolveSiteOrigin(request.headers.get('origin'))
        const callbackUrl = `${origin}/${locale}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ''}`

        const userMetadata = {
            first_name: firstName,
            last_name: lastName || '',
            role: role
        }

        // Lien de CONFIRMATION d'email (type signup) et non plus lien de
        // récupération : l'utilisateur a déjà choisi son mot de passe ici,
        // le lien se contente de valider l'adresse et d'ouvrir la session sur
        // /auth/callback de la vitrine. Auparavant, send-invitation générait un
        // lien `recovery` vers /auth/activate du SaaS qui redemandait un mot de
        // passe (et refusait le même : « same_password »).
        // generateLink(signup) crée l'utilisateur non confirmé, ou réutilise
        // celui d'une tentative précédente non confirmée (renvoi possible).
        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
            type: 'signup',
            email,
            password,
            options: {
                data: userMetadata,
                redirectTo: callbackUrl,
            },
        })

        if (error) {
            const message = /already|exist|registered/i.test(error.message)
                ? "Un compte avec cet email existe déjà. Connectez-vous ou utilisez « Mot de passe oublié »."
                : error.message
            return NextResponse.json({ error: message }, { status: 400 })
        }

        const user = data?.user
        const actionLink = data?.properties?.action_link

        if (!user || !actionLink) {
            return NextResponse.json(
                { error: "Impossible de créer le compte" },
                { status: 500 }
            )
        }

        // Nouvelle tentative sur un compte encore non confirmé : on renvoie
        // seulement un lien. Le mot de passe n'est JAMAIS modifié ici (route
        // non authentifiée : sinon n'importe qui pourrait réécrire celui d'un
        // compte en attente). L'utilisateur garde le mot de passe de sa
        // première inscription, ou passe par « Mot de passe oublié ».

        const invitationResponse = await fetch(
            `${supabaseUrl}/functions/v1/send-invitation`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${serviceRoleKey}`,
                },
                body: JSON.stringify({
                    email,
                    firstName,
                    lastName: lastName || '',
                    role,
                    organizationName: 'EduPro',
                    // Lien fourni : la fonction Edge ne génère plus son
                    // propre lien de récupération.
                    invitationUrl: actionLink,
                }),
            }
        )

        if (!invitationResponse.ok) {
            const errorPayload = await invitationResponse.json().catch(() => ({}))
            console.error('send-invitation failed for', email, errorPayload)
            return NextResponse.json(
                {
                    error: "Compte créé mais l'email de confirmation n'a pas pu être envoyé. Réessayez dans un instant ou contactez le support.",
                    userId: user.id,
                },
                { status: 500 }
            )
        }

        return NextResponse.json({ user: { id: user.id, email: user.email } })

    } catch (error: any) {
        console.error('Signup error:', error)
        return NextResponse.json(
            { error: error.message || "Une erreur est survenue" },
            { status: 500 }
        )
    }
}
