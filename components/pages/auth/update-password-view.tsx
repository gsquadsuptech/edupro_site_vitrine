"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import logo from "@/assets/images/logo.png"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

const formSchema = z
    .object({
        password: z
            .string()
            .min(6, "Le mot de passe doit contenir au moins 6 caractères")
            .regex(/[a-z]/, "Le mot de passe doit contenir au moins une lettre minuscule")
            .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule")
            .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
        confirmPassword: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    })

type FormValues = z.infer<typeof formSchema>

export function UpdatePasswordView() {
    const router = useRouter()
    const { locale } = useParams<{ locale: string }>()
    const supabase = createClient()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [sessionStatus, setSessionStatus] = useState<"checking" | "ready" | "invalid">("checking")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [done, setDone] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { password: "", confirmPassword: "" },
    })

    useEffect(() => {
        const init = async () => {
            try {
                const search = new URLSearchParams(window.location.search)
                const queryError = search.get("error_description") || search.get("error")
                const code = search.get("code")
                const tokenHash = search.get("token_hash")
                const otpType = search.get("type")

                const hash = window.location.hash.startsWith("#")
                    ? window.location.hash.substring(1)
                    : window.location.hash
                const hashParams = new URLSearchParams(hash)
                const accessToken = hashParams.get("access_token")
                const refreshToken = hashParams.get("refresh_token")
                const hashError = hashParams.get("error_description")

                if (queryError || hashError) {
                    setSessionStatus("invalid")
                    setErrorMessage(queryError || hashError)
                    return
                }

                // Flow OTP (token_hash) : pas de PKCE, marche cross-browser.
                // À activer en passant {{ .TokenHash }}&type=recovery dans le template email Supabase.
                if (tokenHash) {
                    const { error } = await supabase.auth.verifyOtp({
                        token_hash: tokenHash,
                        type: (otpType as any) || "recovery",
                    })
                    if (error) {
                        setSessionStatus("invalid")
                        setErrorMessage(error.message)
                        return
                    }
                    window.history.replaceState(null, "", window.location.pathname)
                    setSessionStatus("ready")
                    return
                }

                // Flow PKCE (Supabase par défaut via @supabase/ssr) : ?code=<uuid>
                // Requiert que le code_verifier soit en cookie (même navigateur).
                if (code) {
                    const { error } = await supabase.auth.exchangeCodeForSession(code)
                    if (error) {
                        setSessionStatus("invalid")
                        setErrorMessage(error.message)
                        return
                    }
                    window.history.replaceState(null, "", window.location.pathname)
                    setSessionStatus("ready")
                    return
                }

                // Flow implicite (legacy) : #access_token=...&refresh_token=...
                if (accessToken && refreshToken) {
                    const { error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    })
                    if (error) {
                        setSessionStatus("invalid")
                        setErrorMessage(error.message)
                        return
                    }
                    window.history.replaceState(null, "", window.location.pathname)
                    setSessionStatus("ready")
                    return
                }

                const { data } = await supabase.auth.getSession()
                if (data.session) {
                    setSessionStatus("ready")
                } else {
                    setSessionStatus("invalid")
                    setErrorMessage("Lien invalide ou expiré. Demandez un nouveau lien de réinitialisation.")
                }
            } catch (err: any) {
                console.error("Recovery session error:", err)
                setSessionStatus("invalid")
                setErrorMessage(err?.message || "Lien invalide ou expiré.")
            }
        }
        init()
    }, [supabase])

    const handleSubmit = async (data: FormValues) => {
        try {
            setIsLoading(true)
            const { error } = await supabase.auth.updateUser({ password: data.password })
            if (error) {
                toast.error("Impossible de mettre à jour le mot de passe", {
                    description: error.message,
                })
                return
            }

            setDone(true)
            toast.success("Mot de passe mis à jour")
            setTimeout(() => {
                router.replace(`/${locale || "fr"}/connexion`)
            }, 1500)
        } catch (err: any) {
            console.error("Update password error:", err)
            toast.error("Une erreur est survenue")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-4 dark:from-violet-950/20 dark:via-background dark:to-fuchsia-950/20">
            <div className="w-full max-w-md">
                <div className="mb-6 flex flex-col items-center">
                    <Image
                        src={logo}
                        alt="EduPro Logo"
                        width={150}
                        height={48}
                        className="mb-2"
                        priority
                        style={{ objectFit: "contain" }}
                    />
                </div>

                <Card className="w-full shadow-lg">
                    <CardContent className="p-6">
                        {sessionStatus === "checking" && (
                            <div className="space-y-4 text-center">
                                <Loader2 className="mx-auto h-12 w-12 animate-spin text-violet-600" />
                                <p className="text-sm text-muted-foreground">Vérification du lien...</p>
                            </div>
                        )}

                        {sessionStatus === "invalid" && (
                            <div className="space-y-4 text-center">
                                <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
                                <h1 className="text-2xl font-bold">Lien invalide</h1>
                                <p className="text-sm text-muted-foreground">
                                    {errorMessage || "Ce lien de réinitialisation est invalide ou expiré."}
                                </p>
                                <Link
                                    href={`/${locale || "fr"}/auth/reset-password`}
                                    className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-2 text-sm font-semibold text-white"
                                >
                                    Demander un nouveau lien
                                </Link>
                            </div>
                        )}

                        {sessionStatus === "ready" && done && (
                            <div className="space-y-4 text-center">
                                <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
                                <h1 className="text-2xl font-bold">Mot de passe mis à jour</h1>
                                <p className="text-sm text-muted-foreground">Redirection vers la connexion...</p>
                            </div>
                        )}

                        {sessionStatus === "ready" && !done && (
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-2xl font-bold">Nouveau mot de passe</h1>
                                    <p className="text-sm text-muted-foreground">
                                        Choisissez un mot de passe sécurisé pour votre compte.
                                    </p>
                                </div>

                                <Form form={form} onSubmit={handleSubmit} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nouveau mot de passe</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="******"
                                                            disabled={isLoading}
                                                            autoComplete="new-password"
                                                            {...field}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-11 w-11 flex items-center justify-center rounded-md hover:bg-muted/50 focus:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors duration-200"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                        >
                                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                        </button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirmer le mot de passe</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type={showConfirm ? "text" : "password"}
                                                            placeholder="******"
                                                            disabled={isLoading}
                                                            autoComplete="new-password"
                                                            {...field}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-11 w-11 flex items-center justify-center rounded-md hover:bg-muted/50 focus:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors duration-200"
                                                            onClick={() => setShowConfirm(!showConfirm)}
                                                        >
                                                            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                                        </button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 font-semibold"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        {isLoading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
                                    </Button>
                                </Form>

                                <div className="text-center text-sm">
                                    <Link
                                        href={`/${locale || "fr"}/connexion`}
                                        className="inline-flex items-center font-medium text-primary underline-offset-4 hover:underline"
                                    >
                                        <ArrowLeft className="mr-1 h-4 w-4" />
                                        Retour à la connexion
                                    </Link>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
