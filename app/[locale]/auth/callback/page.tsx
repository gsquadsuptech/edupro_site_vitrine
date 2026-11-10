"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

// Chemin interne uniquement (pas de redirection ouverte via `next`).
// Comparaison d'origine sur l'URL résolue, pas de test de préfixe.
function safeNext(raw: string | null, locale: string): string {
    if (raw && raw.startsWith("/") && !/[\x00-\x1f\\]/.test(raw)) {
        try {
            const url = new URL(raw, window.location.origin)
            if (url.origin === window.location.origin) return url.pathname + url.search
        } catch { /* repli ci-dessous */ }
    }
    return `/${locale}`
}

function friendlyError(code: string | null, description: string | null): string {
    if (code === "otp_expired" || /expired|invalid/i.test(description ?? "")) {
        return "Ce lien de confirmation a expiré ou a déjà été utilisé. Si votre compte est déjà confirmé, connectez-vous ; sinon, réinscrivez-vous avec le même email pour recevoir un nouveau lien."
    }
    return description || "Impossible de confirmer votre compte."
}

export default function AuthCallbackPage() {
    const router = useRouter()
    const { locale: rawLocale } = useParams()
    const locale = typeof rawLocale === "string" ? rawLocale : "fr"
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    const [message, setMessage] = useState("Confirmation de votre compte en cours...")
    const [target, setTarget] = useState(`/${locale}`)
    const ran = useRef(false)

    useEffect(() => {
        if (ran.current) return
        ran.current = true
        const supabase = createClient()

        const activate = async () => {
            const query = new URLSearchParams(window.location.search)
            const next = safeNext(query.get("next"), locale)
            setTarget(next)
            try {
                const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""))
                const errorCode = hash.get("error_code") || query.get("error_code")
                const errorDescription = hash.get("error_description") || query.get("error_description")
                if (errorCode || errorDescription) {
                    throw new Error(friendlyError(errorCode, errorDescription))
                }

                const accessToken = hash.get("access_token")
                const refreshToken = hash.get("refresh_token")
                const code = query.get("code")

                if (accessToken && refreshToken) {
                    const { error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    })
                    if (error) throw error
                } else if (code) {
                    const { error } = await supabase.auth.exchangeCodeForSession(code)
                    if (error) throw error
                } else {
                    throw new Error(friendlyError("otp_expired", null))
                }

                // Le lien ne sert plus qu'à confirmer l'email : on passe le
                // profil en « active » (même règle que /auth/activate du SaaS),
                // sans redemander de mot de passe.
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    const { error: profileError } = await (supabase.from("profiles") as any)
                        .update({ status: "active" })
                        .eq("id", user.id)
                        .neq("status", "active")
                    if (profileError) console.error("Activation: statut non mis à jour", profileError)
                }

                // Nettoie les jetons de l'URL avant de quitter la page.
                window.history.replaceState(null, "", window.location.pathname + window.location.search)

                setStatus("success")
                setMessage(
                    next === `/${locale}`
                        ? "Votre email est confirmé et vous êtes connecté. Redirection vers l'accueil..."
                        : "Votre email est confirmé et vous êtes connecté. Vous allez reprendre là où vous en étiez..."
                )
                setTimeout(() => router.replace(next), 2500)
            } catch (err: any) {
                console.error("Activation error:", err)
                setStatus("error")
                setMessage(err?.message || "Impossible de confirmer votre compte.")
            }
        }

        activate()
    }, [router, locale])

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-4 dark:from-violet-950/20 dark:via-background dark:to-fuchsia-950/20">
            <div className="w-full max-w-md rounded-xl border border-border bg-background p-8 text-center shadow-sm" role="status" aria-live="polite">
                {status === "loading" && (
                    <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-violet-600" />
                )}
                {status === "success" && (
                    <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-600" />
                )}
                {status === "error" && (
                    <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-600" />
                )}

                <h1 className="mb-2 text-2xl font-bold">
                    {status === "loading" && "Confirmation en cours"}
                    {status === "success" && "Compte confirmé 🎉"}
                    {status === "error" && "Échec de la confirmation"}
                </h1>
                <p className="text-muted-foreground">{message}</p>

                {status === "success" && (
                    <button
                        onClick={() => router.replace(target)}
                        className="mt-6 rounded-md bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-2 font-semibold text-white"
                    >
                        Continuer
                    </button>
                )}

                {status === "error" && (
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                            onClick={() => router.replace(`/${locale}/connexion`)}
                            className="rounded-md bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-2 font-semibold text-white"
                        >
                            Aller à la connexion
                        </button>
                        <button
                            onClick={() => router.replace(`/${locale}/inscription`)}
                            className="rounded-md border border-border px-6 py-2 font-semibold"
                        >
                            Recevoir un nouveau lien
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
