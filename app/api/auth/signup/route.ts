
import { createClient } from "@supabase/supabase-js"
import { randomBytes } from "crypto"
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

        // Réponse IDENTIQUE quel que soit l'état de l'adresse (nouvelle,
        // compte en attente, compte confirmé) : la route ne doit pas
        // permettre d'énumérer les comptes.
        const okResponse = () => NextResponse.json({ ok: true, email: normalizedEmail })
        const failClosed = (context: string, detail?: unknown) => {
            console.error(`signup: ${context}`, detail)
            return NextResponse.json(
                { error: "Impossible de traiter l'inscription pour le moment. Réessayez dans un instant." },
                { status: 500 }
            )
        }

        // 1) Création stricte : createUser échoue si l'email existe déjà
        //    (pas d'heuristique sur la date de création).
        const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: normalizedEmail,
            password,
            email_confirm: false,
            user_metadata: userMetadata,
        })

        let actionLink: string | undefined
        let mailNames = { first: userMetadata.first_name, last: userMetadata.last_name }

        if (!createError && created?.user) {
            // Nouveau compte : lien de CONFIRMATION (type signup). Le mot de
            // passe vient d'être choisi ici ; le lien valide l'adresse et
            // ouvre la session sur /auth/callback de la vitrine. Auparavant,
            // send-invitation générait un lien `recovery` vers /auth/activate
            // du SaaS qui redemandait un mot de passe (« same_password »).
            const { data, error } = await supabaseAdmin.auth.admin.generateLink({
                type: 'signup',
                email: normalizedEmail,
                password,
                options: { redirectTo: callbackUrl },
            })
            if (error || !data?.properties?.action_link) return failClosed('signup link', error?.message)
            actionLink = data.properties.action_link
        } else {
            const alreadyExists =
                (createError as any)?.code === 'email_exists' ||
                /already|exist|registered/i.test(createError?.message ?? '')
            if ((createError as any)?.code === 'weak_password') {
                return NextResponse.json(
                    { error: "Mot de passe trop faible : au moins 6 caractères avec majuscule, minuscule et chiffre." },
                    { status: 400 }
                )
            }
            if (!alreadyExists) return failClosed('createUser', createError?.message)

            // 2) Adresse déjà utilisée : état lu via l'API admin, en
            //    échec fermé (toute erreur de lecture interrompt).
            const { data: profile, error: profileError } = await supabaseAdmin
                .from('profiles')
                .select('id, first_name, last_name')
                .eq('email', normalizedEmail)
                .maybeSingle()
            if (profileError || !profile?.id) return failClosed('profile lookup', profileError?.message)

            const { data: existing, error: existingError } = await supabaseAdmin.auth.admin.getUserById(profile.id)
            if (existingError || !existing?.user) return failClosed('getUserById', existingError?.message)

            // Compte confirmé : aucun email, même réponse. L'interface invite
            // à se connecter ou à utiliser « Mot de passe oublié ».
            if (existing.user.email_confirmed_at) return okResponse()

            // Compte NON confirmé (inscription abandonnée, invitation
            // d'organisation, ou tiers l'ayant pré-créé avec SON mot de
            // passe). On remplace d'abord le mot de passe par un secret
            // aléatoire jamais communiqué : celui du tiers est révoqué même
            // si le lien n'est pas suivi jusqu'au bout. Sans risque pour un
            // compte légitime : non confirmé, il ne peut pas se connecter
            // par mot de passe. Le lien fait ensuite choisir le mot de passe
            // au détenteur de la boîte. Compte ni supprimé ni rattachements
            // modifiés.
            const { error: scrambleError } = await supabaseAdmin.auth.admin.updateUserById(existing.user.id, {
                password: randomBytes(48).toString('base64url'),
            })
            if (scrambleError) return failClosed('password reset', scrambleError.message)

            const { data, error } = await supabaseAdmin.auth.admin.generateLink({
                type: 'recovery',
                email: normalizedEmail,
                options: { redirectTo: `${origin}/${locale}/auth/update-password` },
            })
            if (error || !data?.properties?.action_link) return failClosed('recovery link', error?.message)
            actionLink = data.properties.action_link
            // Noms du compte existant, pas ceux saisis par le demandeur.
            mailNames = { first: profile.first_name || '', last: profile.last_name || '' }
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
                    firstName: mailNames.first,
                    lastName: mailNames.last,
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
            return failClosed('send-invitation', errorPayload)
        }

        return okResponse()

    } catch (error: any) {
        console.error('Signup error:', error)
        return NextResponse.json(
            { error: "Une erreur est survenue. Réessayez dans un instant." },
            { status: 500 }
        )
    }
}
