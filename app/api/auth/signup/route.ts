
import { createClient } from "@supabase/supabase-js"
import { randomBytes } from "crypto"
import { isIPv4, isIPv6 } from "net"
import { NextRequest, NextResponse } from "next/server"
import { verifyTurnstileToken, getRemoteIp } from "@/lib/turnstile"
import { ensureStudentProfile } from "@/lib/ensure-profile"

export const runtime = 'nodejs'

const SUPPORTED_LOCALES = new Set(['fr', 'en'])

// Limitation en mémoire (vitrine = un seul conteneur) : borne les envois
// d'emails et les réinitialisations de comptes en attente déclenchés par un
// tiers. Appliquée à toutes les adresses de la même façon (pas d'énumération).
const WINDOW_MS = 15 * 60_000
const LIMITS = { email: 3, ip: 10 }
const hits = new Map<string, number[]>()
function isRateLimited(key: string, max: number): boolean {
    const now = Date.now()
    const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS)
    if (recent.length >= max) {
        hits.set(key, recent)
        return true
    }
    recent.push(now)
    // delete puis set : la clé repasse en fin de Map → éviction LRU réelle
    // (une clé active n'est pas sacrifiée au profit d'une rafale de clés neuves).
    hits.delete(key)
    hits.set(key, recent)
    if (hits.size > 10_000) {
        for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k)
        // Plafond dur : on évince les clés les plus anciennes (ordre
        // d'insertion de la Map) si l'élagage ne suffit pas.
        for (const k of hits.keys()) {
            if (hits.size <= 10_000) break
            hits.delete(k)
        }
    }
    return false
}

// IP pour la limitation : X-Real-IP est ÉCRASÉ par notre nginx
// ($remote_addr, deploy/nginx/edupro.africa.conf) ; X-Forwarded-For et
// CF-Connecting-IP sont fournis par le client et donc falsifiables.
function trustedClientIp(request: NextRequest): string {
    const ip = request.headers.get('x-real-ip')?.trim() || 'unknown'
    return rateLimitIpKey(ip)
}

// IPv4 telle quelle ; IPv4 mappée (::ffff:a.b.c.d) ramenée en IPv4 ;
// IPv6 développée sur 8 groupes puis agrégée en /64 (un client dispose en
// général d'un /64 entier). Valeur non analysable → adresse brute.
function rateLimitIpKey(ip: string): string {
    if (isIPv4(ip)) return ip
    if (!isIPv6(ip)) return ip
    const mapped = ip.match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i)
    if (mapped && isIPv4(mapped[1])) return mapped[1]
    const [head, tail] = ip.split('::')
    const h = head ? head.split(':') : []
    const t = tail !== undefined && tail !== '' ? tail.split(':') : []
    if (t.some((g) => g.includes('.')) || h.some((g) => g.includes('.'))) return ip
    const groups = tail === undefined ? h : [...h, ...Array(8 - h.length - t.length).fill('0'), ...t]
    if (groups.length !== 8) return ip
    const norm = groups.map((g) => parseInt(g || '0', 16).toString(16))
    return `${norm.slice(0, 4).join(':')}::/64`
}

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

        // Limite par client : erreur explicite (c'est lui qui insiste).
        if (isRateLimited(`ip:${trustedClientIp(request)}`, LIMITS.ip)) {
            return NextResponse.json(
                { error: "Trop de tentatives. Réessayez dans quelques minutes." },
                { status: 429 }
            )
        }
        // Limite par adresse : on ne bloque PAS le propriétaire de l'adresse
        // à cause de requêtes d'un tiers. Au-delà du quota, rien n'est fait
        // (ni email, ni modification de compte) mais la réponse reste la
        // réponse générique. « Mot de passe oublié » reste disponible.
        if (isRateLimited(`email:${normalizedEmail}`, LIMITS.email)) {
            return NextResponse.json({ ok: true, email: normalizedEmail })
        }

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

            // Le SaaS retrouve l'inscrit par `profiles.email` (inscription aux
            // cours) : on ne dépend pas du seul trigger handle_new_user.
            const { error: profileError } = await ensureStudentProfile(supabaseAdmin, {
                id: created.user.id,
                email: normalizedEmail,
                firstName: userMetadata.first_name,
                lastName: userMetadata.last_name,
            })
            if (profileError) console.error('signup: profil non créé', profileError)
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
            // modifiés. Arbitrage assumé : sans ce remplacement, le mot de
            // passe d'un tiers redevient valide dès que l'email est confirmé
            // via le lien ; avec, un tiers ne peut que changer un mot de passe
            // inutilisable (connexion refusée tant que l'email n'est pas
            // confirmé), et c'est borné par la limitation ci-dessus.
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
