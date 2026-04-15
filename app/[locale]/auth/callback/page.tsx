"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function AuthCallbackPage() {
    const router = useRouter()
    const { locale } = useParams()
    const supabase = createClient()
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    const [message, setMessage] = useState("Activation de votre compte en cours...")

    useEffect(() => {
        const activate = async () => {
            try {
                const hash = window.location.hash.startsWith("#")
                    ? window.location.hash.substring(1)
                    : window.location.hash
                const params = new URLSearchParams(hash)
                const accessToken = params.get("access_token")
                const refreshToken = params.get("refresh_token")
                const errorDescription = params.get("error_description")

                if (errorDescription) {
                    throw new Error(errorDescription)
                }

                if (!accessToken || !refreshToken) {
                    throw new Error("Lien d'activation invalide ou expiré.")
                }

                const { error } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken,
                })

                if (error) throw error

                setStatus("success")
                setMessage("Votre compte a été activé avec succès. Redirection...")

                setTimeout(() => {
                    const target = `/${locale || "fr"}`
                    router.replace(target)
                }, 1500)
            } catch (err: any) {
                console.error("Activation error:", err)
                setStatus("error")
                setMessage(err?.message || "Impossible d'activer votre compte.")
            }
        }

        activate()
    }, [supabase, router, locale])

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-4 dark:from-violet-950/20 dark:via-background dark:to-fuchsia-950/20">
            <div className="w-full max-w-md rounded-xl border border-border bg-background p-8 text-center shadow-sm">
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
                    {status === "loading" && "Activation en cours"}
                    {status === "success" && "Compte activé"}
                    {status === "error" && "Échec de l'activation"}
                </h1>
                <p className="text-muted-foreground">{message}</p>

                {status === "error" && (
                    <button
                        onClick={() => router.replace(`/${locale || "fr"}/connexion`)}
                        className="mt-6 rounded-md bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-2 font-semibold text-white"
                    >
                        Aller à la connexion
                    </button>
                )}
            </div>
        </div>
    )
}