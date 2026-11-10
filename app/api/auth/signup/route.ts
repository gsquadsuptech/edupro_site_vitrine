
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
        // `/a/..//evil.com` se résout en chemin `//evil.com` (URL relative
        // au protocole une fois réutilisée) : on rejette aussi le résultat.
        const out = url.pathname + url.search
        return out.startsWith('//') ? null : out
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

        if (typeof email !== 'string' || typeof password !== 'string' || typeof firstName !== 'string' || !email || !password || !firstName) {
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

        // Noms bornés : ils sont repris dans l'email envoyé à l'adresse saisie.
        const userMetadata = {
            first_name: firstName.trim().slice(0, 60),
            last_name: typeof lastName === 'string' ? lastName.trim().slice(0, 60) : '',
            role: role
        }

        const normalizedEmail = String(email).trim().toLowerCase()
        const existsError = NextResponse.json(
            { error: "Un compte avec cet email existe déjà. Connectez-vous ou utilisez « Mot de passe oublié »." },
            { status: 400 }
        )

        // Compte déjà présent ? (profil créé par trigger à chaque compte)
        let pendingExisting = false
        const { data: existingProfile } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('email', normalizedEmail)
            .maybeSingle()
        if (existingProfile?.id) {
            const { data: existing } = await supabaseAdmin.auth.admin.getUserById(existingProfile.id)
            if (existing?.user?.email_confirmed_at) return existsError
            if (existing?.user) pendingExisting = true
        }

        let user: { id: string; email?: string } | null = null
        let actionLink: string | undefined
        let mode: 'confirm' | 'set_password' = 'confirm'

        if (!pendingExisting) {
            // Nouveau compte : lien de CONFIRMATION (type signup). Le mot de
            // passe vient d'être choisi ici ; le lien valide l'adresse et
            // ouvre la session sur /auth/callback de la vitrine. Auparavant,
            // send-invitation générait un lien `recovery` vers /auth/activate
            // du SaaS qui redemandait un mot de passe (« same_password »).
            const { data, error } = await supabaseAdmin.auth.admin.generateLink({
                type: 'signup',
                email: normalizedEmail,
                password,
                options: { data: userMetadata, redirectTo: callbackUrl },
            })
            if (error) {
                if (/already|exist|registered/i.test(error.message)) return existsError
                return NextResponse.json({ error: error.message }, { status: 400 })
            }
            user = data?.user ?? null
            actionLink = data?.properties?.action_link
            // Course : compte apparu entre la vérification et ici (profil
            // absent ou en retard) → on le traite comme préexistant.
            if (user && Date.now() - new Date((data.user as any).created_at).getTime() > 60_000) {
                pendingExisting = true
            }
        }

        if (pendingExisting) {
            // Email déjà rattaché à un compte NON confirmé (inscription
            // abandonnée, invitation d'organisation, ou tiers ayant pré-créé
            // le compte avec SON mot de passe). Confirmer ce compte en l'état
            // laisserait ce mot de passe en place : on envoie à la place un
            // lien qui fait choisir le mot de passe par le détenteur de la
            // boîte mail. Le compte n'est ni modifié ni supprimé ici (il peut
            // porter des rattachements d'organisation).
            const { data, error } = await supabaseAdmin.auth.admin.generateLink({
                type: 'recovery',
                email: normalizedEmail,
                options: { redirectTo: `${origin}/${locale}/auth/update-password` },
            })
            if (error) {
                return NextResponse.json({ error: error.message }, { status: 400 })
            }
            user = data?.user ?? null
            actionLink = data?.properties?.action_link
            mode = 'set_password'
        }

        if (!user || !actionLink) {
            return NextResponse.json(
                { error: "Impossible de créer le compte" },
                { status: 500 }
            )
        }

        const invitationResponse = await fetch(
            `${supabaseUrl}/functions/v1/send-invitation`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${serviceRoleKey}`,
                },
                body: JSON.stringify({
                    email: normalizedEmail,
                    firstName: userMetadata.first_name,
                    lastName: userMetadata.last_name,
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

        return NextResponse.json({ user: { id: user.id, email: normalizedEmail }, mode })

    } catch (error: any) {
        console.error('Signup error:', error)
        return NextResponse.json(
            { error: error.message || "Une erreur est survenue" },
            { status: 500 }
        )
    }
}
