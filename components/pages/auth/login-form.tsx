"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface LoginFormProps {
    onRegisterClick: () => void;
}

export function LoginForm({ onRegisterClick }: LoginFormProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoadingForm, setIsLoadingForm] = useState<boolean>(false)

    const formSchema = z.object({
        email: z.string().email("Email invalide"),
        password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
        rememberMe: z.boolean().default(false),
    })

    type FormValues = z.infer<typeof formSchema>

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    })

    const handleSubmit = async (data: FormValues) => {
        try {
            setIsLoadingForm(true)
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))

            toast.success("Connexion réussie")
            router.push('/')

        } catch (err: any) {
            console.error("Erreur de connexion:", err)
            toast.error("Erreur de connexion")
        } finally {
            setIsLoadingForm(false)
        }
    }

    // Mock OAuth handlers
    const handleGoogleSignIn = () => toast.info("Google Login (Mock)")
    const handleFacebookSignIn = () => toast.info("Facebook Login (Mock)")

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Connexion</h1>
                <p className="text-sm text-muted-foreground">
                    Entrez vos identifiants pour accéder à votre compte
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
                                    disabled={isLoadingForm}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="******"
                                        disabled={isLoadingForm}
                                        {...field}
                                        autoComplete="current-password"
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

                <div className="flex items-center justify-between">
                    <FormField
                        control={form.control}
                        name="rememberMe"
                        render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={isLoadingForm}
                                    />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">Se souvenir de moi</FormLabel>
                            </FormItem>
                        )}
                    />
                    <Link
                        href="/auth/reset-password"
                        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                        Mot de passe oublié?
                    </Link>
                </div>

                <Button
                    type="submit"
                    className="w-full mt-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 font-semibold"
                    disabled={isLoadingForm}
                >
                    {isLoadingForm ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isLoadingForm ? "Connexion en cours..." : "Se connecter"}
                </Button>
            </Form>

            <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-border" />
                <span className="text-sm text-muted-foreground">Ou continuer avec</span>
                <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button" className="gap-2 bg-transparent hover:bg-muted" onClick={handleGoogleSignIn}>
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Google
                </Button>
                <Button variant="outline" type="button" className="gap-2 bg-transparent hover:bg-muted" onClick={handleFacebookSignIn}>
                    <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                </Button>
            </div>

            <div className="mt-4 text-center text-sm">
                Vous n'avez pas de compte?{" "}
                <button
                    type="button"
                    onClick={onRegisterClick}
                    className="font-medium text-primary underline-offset-4 hover:underline"
                >
                    S'inscrire
                </button>
            </div>
        </div>
    )
}
