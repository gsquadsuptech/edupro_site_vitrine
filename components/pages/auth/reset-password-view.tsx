"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react"
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

const formSchema = z.object({
    email: z.string().email("Email invalide"),
})

type FormValues = z.infer<typeof formSchema>

export function ResetPasswordView() {
    const { locale } = useParams<{ locale: string }>()
    const supabase = createClient()
    const [isLoading, setIsLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: "" },
    })

    const handleSubmit = async (data: FormValues) => {
        try {
            setIsLoading(true)

            const redirectTo = `${window.location.origin}/${locale || "fr"}/auth/update-password`

            const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
                redirectTo,
            })

            if (error) {
                toast.error("Impossible d'envoyer l'email", {
                    description: error.message,
                })
                return
            }

            setSent(true)
            toast.success("Email envoyé", {
                description: "Vérifiez votre boîte de réception pour réinitialiser votre mot de passe.",
            })
        } catch (err: any) {
            console.error("Reset password error:", err)
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
                        {sent ? (
                            <div className="space-y-4 text-center">
                                <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
                                <h1 className="text-2xl font-bold">Vérifiez votre email</h1>
                                <p className="text-sm text-muted-foreground">
                                    Si un compte est associé à cet email, vous recevrez un lien pour réinitialiser
                                    votre mot de passe. Le lien expire dans 1 heure.
                                </p>
                                <Link
                                    href={`/${locale || "fr"}/connexion`}
                                    className="inline-flex items-center justify-center text-sm font-medium text-primary underline-offset-4 hover:underline"
                                >
                                    <ArrowLeft className="mr-1 h-4 w-4" />
                                    Retour à la connexion
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-2xl font-bold">Mot de passe oublié</h1>
                                    <p className="text-sm text-muted-foreground">
                                        Entrez votre email pour recevoir un lien de réinitialisation.
                                    </p>
                                </div>

                                <Form form={form} onSubmit={handleSubmit} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="votreemail@exemple.com"
                                                        disabled={isLoading}
                                                        {...field}
                                                    />
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
                                        {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
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
