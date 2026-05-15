/**
 * Vérification server-side d'un token Cloudflare Turnstile.
 *
 * À utiliser dans les routes API qui contournent le Captcha natif Supabase
 * (ex: /api/auth/signup qui appelle admin.createUser avec la service role).
 * Sans cela, ces endpoints sont une porte dérobée pour les bots.
 *
 * Réf: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */

const SITEVERIFY_URL =
    "https://challenges.cloudflare.com/turnstile/v0/siteverify"

export type TurnstileVerifyResult =
    | { success: true }
    | { success: false; reason: string; codes?: string[] }

/**
 * Retourne `success: true` uniquement si le token est valide. Si le secret
 * n'est pas configuré, on considère la vérification désactivée (pour ne pas
 * bloquer les déploiements avant l'activation côté Supabase + Cloudflare).
 */
// Désactivation forcée en code (en plus de la variable d'env). Repasser à
// `false` quand le widget Turnstile + le captcha Supabase seront réactivés.
const TURNSTILE_DISABLED = true

export async function verifyTurnstileToken(
    token: string | null | undefined,
    remoteIp?: string,
): Promise<TurnstileVerifyResult> {
    if (TURNSTILE_DISABLED) {
        return { success: true }
    }
    const secret = process.env.TURNSTILE_SECRET_KEY
    if (!secret) {
        return { success: true }
    }
    if (!token || typeof token !== "string") {
        return { success: false, reason: "missing_token" }
    }

    const body = new URLSearchParams()
    body.append("secret", secret)
    body.append("response", token)
    if (remoteIp) body.append("remoteip", remoteIp)

    try {
        const res = await fetch(SITEVERIFY_URL, {
            method: "POST",
            body,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
        const data = (await res.json()) as {
            success: boolean
            "error-codes"?: string[]
        }
        if (data.success) return { success: true }
        return {
            success: false,
            reason: "invalid_token",
            codes: data["error-codes"],
        }
    } catch (err) {
        return {
            success: false,
            reason: err instanceof Error ? err.message : "verification_failed",
        }
    }
}

export function getRemoteIp(req: Request): string | undefined {
    const headers = req.headers
    return (
        headers.get("cf-connecting-ip") ||
        headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        headers.get("x-real-ip") ||
        undefined
    )
}
