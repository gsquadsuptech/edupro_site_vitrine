"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useParams } from "next/navigation"
// Adjusted imports for Vitrine structure
import { Header } from "@/components/layout/header/header"
import { Footer } from "@/components/layout/footer/footer"
// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FlagImage } from "@/components/ui/flag-image"
import { User, Briefcase, GraduationCap, Eye, EyeOff, Check, ArrowRight, Loader2, School } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { getAppUrl } from "@/lib/utils"

// Import assets locally if needed, assuming /images/edupro-logo.png exists in public or using the imported logo from header
import logo from "@/assets/images/logo.png"

type TabType = "professionnel" | "formateur" | "entreprise" | "institut"

export default function InscriptionPage() {
    const [activeTab, setActiveTab] = useState<TabType>("professionnel")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { locale } = useParams()
    const supabase = createClient()

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        country: ""
    })

    // Derived state for password strength
    const password = formData.password


    // Password strength indicator
    const getPasswordStrength = (pass: string) => {
        if (pass.length === 0) return { label: "", strength: 0 }
        if (pass.length < 6) return { label: "Faible", strength: 1, color: "bg-red-500" }
        if (pass.length < 10) return { label: "Moyen", strength: 2, color: "bg-yellow-500" }
        if (pass.length >= 10 && /[A-Z]/.test(pass) && /[0-9]/.test(pass))
            return { label: "Fort", strength: 3, color: "bg-green-500" }
        return { label: "Moyen", strength: 2, color: "bg-yellow-500" }
    }

    const passwordStrength = getPasswordStrength(password)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Split name into first and last name
        const nameParts = formData.fullName.trim().split(' ')
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    firstName,
                    lastName,
                    role: 'student'
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error("Erreur lors de l'inscription", {
                    description: data.error || "Une erreur est survenue"
                })
            } else {
                toast.success("Inscription réussie !", {
                    description: "Veuillez vérifier votre email pour confirmer votre compte."
                })
            }
        } catch (err) {
            console.error(err)
            toast.error("Une erreur est survenue")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 py-12 dark:from-violet-950/20 dark:via-background dark:to-fuchsia-950/20">
                    <div className="container mx-auto px-4 text-center">
                        <div className="mb-8 flex justify-center">
                            <Image src={logo} alt="EduPro Logo" width={200} height={60} className="h-16 w-auto object-contain" />
                        </div>
                        <h1 className="mb-3 text-4xl font-bold text-foreground md:text-5xl">Rejoignez EduPro</h1>
                        <p className="text-xl text-muted-foreground">L'Éveil des Talents Africains</p>
                    </div>
                </section>

                {/* Tab Selector */}
                <section className="border-b border-border bg-background">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-center gap-2 md:gap-4">
                            <button
                                onClick={() => setActiveTab("professionnel")}
                                className={`flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-medium transition-colors md:px-8 md:text-base ${activeTab === "professionnel"
                                    ? "border-violet-600 text-violet-600"
                                    : "border-transparent text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                <User className="h-5 w-5" />
                                <span>Professionnel</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("formateur")}
                                className={`flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-medium transition-colors md:px-8 md:text-base ${activeTab === "formateur"
                                    ? "border-indigo-600 text-indigo-600"
                                    : "border-transparent text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                <GraduationCap className="h-5 w-5" />
                                <span>Formateur</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("institut")}
                                className={`flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-medium transition-colors md:px-8 md:text-base ${activeTab === "institut"
                                    ? "border-emerald-600 text-emerald-600"
                                    : "border-transparent text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                <School className="h-5 w-5" />
                                <span>Institut de Formation</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("entreprise")}
                                className={`flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-medium transition-colors md:px-8 md:text-base ${activeTab === "entreprise"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                <Briefcase className="h-5 w-5" />
                                <span>Entreprise</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Content Area */}
                <section className="py-12 md:py-16">
                    <div className="container mx-auto px-4">
                        {/* PROFESSIONNEL TAB */}
                        {activeTab === "professionnel" && (
                            <div className="mx-auto max-w-md animate-fade-in">
                                <div className="mb-8 text-center">
                                    <h2 className="mb-2 text-3xl font-bold text-slate-900">Créer mon compte</h2>
                                    <p className="text-slate-600">Commencez votre parcours d'apprentissage en 2 minutes</p>
                                </div>

                                <form className="space-y-6" onSubmit={handleRegister}>
                                    <div className="space-y-2">
                                        <Label htmlFor="fullname">Nom complet *</Label>
                                        <Input
                                            id="fullname"
                                            type="text"
                                            placeholder="Votre nom complet"
                                            required
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="votre.email@exemple.com"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Mot de passe *</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        {formData.password && (
                                            <div className="space-y-1">
                                                <div className="flex gap-1">
                                                    {[1, 2, 3].map((level) => (
                                                        <div
                                                            key={level}
                                                            className={`h-1 flex-1 rounded ${level <= passwordStrength.strength ? passwordStrength.color : "bg-slate-200"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-xs text-slate-600">Force: {passwordStrength.label}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="country">Pays *</Label>
                                        <Select onValueChange={(value) => setFormData({ ...formData, country: value })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionnez votre pays" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="senegal">
                                                    <div className="flex items-center gap-2">
                                                        <FlagImage countryCode="sn" /> <span>Sénégal</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="cote-ivoire">
                                                    <div className="flex items-center gap-2">
                                                        <FlagImage countryCode="ci" /> <span>Côte d'Ivoire</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="rwanda">
                                                    <div className="flex items-center gap-2">
                                                        <FlagImage countryCode="rw" /> <span>Rwanda</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="mali">
                                                    <div className="flex items-center gap-2">
                                                        <FlagImage countryCode="ml" /> <span>Mali</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="benin">
                                                    <div className="flex items-center gap-2">
                                                        <FlagImage countryCode="bj" /> <span>Bénin</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="burkina">
                                                    <div className="flex items-center gap-2">
                                                        <FlagImage countryCode="bf" /> <span>Burkina Faso</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="cameroun">
                                                    <div className="flex items-center gap-2">
                                                        <FlagImage countryCode="cm" /> <span>Cameroun</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="gabon">
                                                    <div className="flex items-center gap-2">
                                                        <FlagImage countryCode="ga" /> <span>Gabon</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="autre">
                                                    <div className="flex items-center gap-2">
                                                        <FlagImage countryCode="autre" /> <span>Autre</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <Checkbox id="terms" required />
                                        <Label htmlFor="terms" className="text-sm leading-relaxed">
                                            J'accepte les{" "}
                                            <Link href="/conditions" className="text-violet-600 hover:underline">
                                                conditions d'utilisation
                                            </Link>{" "}
                                            et la{" "}
                                            <Link href="/confidentialite" className="text-violet-600 hover:underline">
                                                politique de confidentialité
                                            </Link>
                                        </Label>
                                    </div>

                                    <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 py-6 text-lg font-semibold text-white hover:opacity-90" disabled={isLoading}>
                                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        {isLoading ? "Création en cours..." : "Créer mon compte gratuitement"}
                                    </Button>
                                </form>

                                <div className="my-8 flex items-center gap-4">
                                    <div className="h-px flex-1 bg-slate-200" />
                                    <span className="text-sm text-slate-500">Ou continuer avec</span>
                                    <div className="h-px flex-1 bg-slate-200" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Button variant="outline" className="gap-2 bg-transparent">
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
                                    <Button variant="outline" className="gap-2 bg-transparent">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                        Facebook
                                    </Button>
                                </div>

                                <p className="mt-6 text-center text-sm text-slate-600">
                                    Vous avez déjà un compte ?{" "}
                                    <button
                                        onClick={() => router.push(`/${locale}/connexion`)}
                                        className="font-medium text-violet-600 hover:underline bg-transparent border-0 p-0"
                                    >
                                        Se connecter
                                    </button>
                                </p>
                            </div>
                        )}

                        {/* FORMATEUR TAB */}
                        {activeTab === "formateur" && (
                            <div className="mx-auto max-w-3xl animate-fade-in">
                                <div className="mb-12 text-center">
                                    <div className="mb-6 flex justify-center">
                                        <div className="rounded-full bg-indigo-100 p-6 dark:bg-indigo-900/30">
                                            <GraduationCap className="h-16 w-16 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                    </div>
                                    <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">Devenir Formateur</h2>
                                    <p className="text-lg text-muted-foreground">
                                        Partagez votre expertise et formez des milliers de professionnels africains
                                    </p>
                                </div>

                                {/* Benefits */}
                                <div className="mb-12 grid gap-6 md:grid-cols-2">
                                    <div className="flex gap-4 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:bg-muted/50">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                                            <Check className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-semibold text-foreground">Visibilité panafricaine</h3>
                                            <p className="text-sm text-muted-foreground">Atteignez des milliers de professionnels</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:bg-muted/50">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                                            <Check className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-semibold text-foreground">Outils IA de création</h3>
                                            <p className="text-sm text-muted-foreground">Créez vos cours facilement</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:bg-muted/50">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                                            <Check className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-semibold text-foreground">Jusqu'à 85% de commission</h3>
                                            <p className="text-sm text-muted-foreground">Revenus attractifs</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:bg-muted/50">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                                            <Check className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-semibold text-foreground">Support dédié</h3>
                                            <p className="text-sm text-muted-foreground">Formation et accompagnement</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Process */}
                                <div className="mb-12">
                                    <h3 className="mb-8 text-center text-2xl font-bold text-foreground">Le processus</h3>
                                    <div className="grid gap-6 md:grid-cols-4">
                                        <div className="text-center">
                                            <div className="mb-4 flex justify-center">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
                                                    1
                                                </div>
                                            </div>
                                            <h4 className="mb-2 font-semibold text-foreground">Candidature</h4>
                                            <p className="text-sm text-muted-foreground">Remplissez le formulaire (5 min)</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="mb-4 flex justify-center">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
                                                    2
                                                </div>
                                            </div>
                                            <h4 className="mb-2 font-semibold text-foreground">Qualification</h4>
                                            <p className="text-sm text-muted-foreground">Échange avec notre équipe (48h)</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="mb-4 flex justify-center">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
                                                    3
                                                </div>
                                            </div>
                                            <h4 className="mb-2 font-semibold text-foreground">Onboarding</h4>
                                            <p className="text-sm text-muted-foreground">Formation aux outils (1 semaine)</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="mb-4 flex justify-center">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
                                                    4
                                                </div>
                                            </div>
                                            <h4 className="mb-2 font-semibold text-foreground">Lancement</h4>
                                            <p className="text-sm text-muted-foreground">Publiez et commencez à former</p>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="text-center">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-lg font-semibold text-white hover:opacity-90"
                                    >
                                        <Link href={`/${locale}/formateurs/candidature`}>
                                            Postuler comme formateur
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                    <p className="mt-4 text-sm text-muted-foreground">Taux d'acceptation : 85% des candidats qualifiés</p>
                                </div>
                            </div>
                        )}

                        {/* ENTREPRISE TAB */}
                        {activeTab === "entreprise" && (
                            <div className="mx-auto max-w-3xl animate-fade-in">
                                <div className="mb-12 text-center">
                                    <div className="mb-6 flex justify-center">
                                        <div className="rounded-full bg-blue-100 p-6 dark:bg-blue-900/30">
                                            <Briefcase className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </div>
                                    <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">Solution Entreprise</h2>
                                    <p className="text-lg text-muted-foreground">Formez vos équipes avec une plateforme clé en main</p>
                                </div>

                                {/* Solutions */}
                                <div className="mb-12 grid gap-6 md:grid-cols-2">
                                    <div className="flex gap-4 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:bg-muted/50">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                            <Check className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-semibold text-foreground">Déploiement rapide</h3>
                                            <p className="text-sm text-muted-foreground">Opérationnel en 48h</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:bg-muted/50">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                            <Check className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-semibold text-foreground">Marque blanche</h3>
                                            <p className="text-sm text-muted-foreground">Votre académie à vos couleurs</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:bg-muted/50">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                            <Check className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-semibold text-foreground">Catalogue riche</h3>
                                            <p className="text-sm text-muted-foreground">180+ formations prêtes</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:bg-muted/50">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                            <Check className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-semibold text-foreground">Reporting complet</h3>
                                            <p className="text-sm text-muted-foreground">Suivez la progression de vos équipes</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Use Cases */}
                                <div className="mb-12 rounded-lg border border-border bg-card p-8 shadow-sm">
                                    <h3 className="mb-6 text-center text-xl font-bold text-foreground">Ils nous font confiance</h3>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="flex items-start gap-3">
                                            <Check className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                                            <div>
                                                <p className="font-medium text-foreground">Centres d'appel</p>
                                                <p className="text-sm text-muted-foreground">Formation soft skills pour agents</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Check className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                                            <div>
                                                <p className="font-medium text-foreground">Entreprises tech</p>
                                                <p className="text-sm text-muted-foreground">Upskilling équipes digitales</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Check className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                                            <div>
                                                <p className="font-medium text-foreground">Industries</p>
                                                <p className="text-sm text-muted-foreground">Sécurité et conformité</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Check className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                                            <div>
                                                <p className="font-medium text-foreground">Instituts</p>
                                                <p className="text-sm text-muted-foreground">Solution marque blanche</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Process */}
                                <div className="mb-12">
                                    <h3 className="mb-8 text-center text-2xl font-bold text-foreground">Comment ça marche</h3>
                                    <div className="grid gap-6 md:grid-cols-4">
                                        <div className="text-center">
                                            <div className="mb-4 flex justify-center">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                                                    1
                                                </div>
                                            </div>
                                            <h4 className="mb-2 font-semibold text-foreground">Demande de démo</h4>
                                            <p className="text-sm text-muted-foreground">Remplissez le formulaire</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="mb-4 flex justify-center">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                                                    2
                                                </div>
                                            </div>
                                            <h4 className="mb-2 font-semibold text-foreground">Démo personnalisée</h4>
                                            <p className="text-sm text-muted-foreground">Présentation adaptée (48h)</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="mb-4 flex justify-center">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                                                    3
                                                </div>
                                            </div>
                                            <h4 className="mb-2 font-semibold text-foreground">Essai gratuit</h4>
                                            <p className="text-sm text-muted-foreground">Testez pendant 14 jours</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="mb-4 flex justify-center">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                                                    4
                                                </div>
                                            </div>
                                            <h4 className="mb-2 font-semibold text-foreground">Déploiement</h4>
                                            <p className="text-sm text-muted-foreground">Configuration et formation (48h)</p>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="text-center">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-6 text-lg font-semibold text-white hover:opacity-90"
                                    >
                                        <Link href={`/${locale}/demande-demo`}>
                                            Demander une démo
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                    <p className="mt-4 text-sm text-muted-foreground">Réponse sous 24h - Sans engagement</p>
                                </div>
                            </div>
                        )}

                        {/* INSTITUT TAB */}
                        {activeTab === "institut" && (
                            <div className="mx-auto max-w-3xl animate-fade-in">
                                <div className="mb-12 text-center">
                                    <div className="mb-6 flex justify-center">
                                        <div className="rounded-full bg-emerald-100 p-6 dark:bg-emerald-900/30">
                                            <School className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                    </div>
                                    <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">Solution Institut de Formation</h2>
                                    <p className="text-lg text-muted-foreground">Transformez votre institut avec une plateforme de formation digitale complète</p>
                                </div>

                                {/* Solutions */}
                                <div className="mb-12 grid gap-6 md:grid-cols-2">
                                    <div className="flex gap-4 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:bg-muted/50">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                            <Check className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-semibold text-foreground">Académie digitale personnalisée à vos couleurs</h3>
                                            <p className="text-sm text-muted-foreground">Votre plateforme avec votre identité visuelle</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:bg-muted/50">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                            <Check className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-semibold text-foreground">Votre nom de domaine</h3>
                                            <p className="text-sm text-muted-foreground">Plateforme accessible via votre propre domaine</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:bg-muted/50">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                            <Check className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-semibold text-foreground">Gestion complète des professionnels</h3>
                                            <p className="text-sm text-muted-foreground">Suivi et administration de tous vos professionnels</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:bg-muted/50">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                            <Check className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-semibold text-foreground">Analytics et reporting avancés</h3>
                                            <p className="text-sm text-muted-foreground">Tableaux de bord et rapports détaillés sur la progression</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Process */}
                                <div className="mb-12">
                                    <h3 className="mb-8 text-center text-2xl font-bold text-foreground">Comment ça marche</h3>
                                    <div className="grid gap-6 md:grid-cols-4">
                                        <div className="text-center">
                                            <div className="mb-4 flex justify-center">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
                                                    1
                                                </div>
                                            </div>
                                            <h4 className="mb-2 font-semibold text-foreground">Demande de démo</h4>
                                            <p className="text-sm text-muted-foreground">Remplissez le formulaire</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="mb-4 flex justify-center">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
                                                    2
                                                </div>
                                            </div>
                                            <h4 className="mb-2 font-semibold text-foreground">Démo personnalisée</h4>
                                            <p className="text-sm text-muted-foreground">Présentation adaptée (48h)</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="mb-4 flex justify-center">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
                                                    3
                                                </div>
                                            </div>
                                            <h4 className="mb-2 font-semibold text-foreground">Essai gratuit</h4>
                                            <p className="text-sm text-muted-foreground">Testez pendant 14 jours</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="mb-4 flex justify-center">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
                                                    4
                                                </div>
                                            </div>
                                            <h4 className="mb-2 font-semibold text-foreground">Déploiement</h4>
                                            <p className="text-sm text-muted-foreground">Configuration et formation (48h)</p>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="text-center">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6 text-lg font-semibold text-white hover:opacity-90"
                                    >
                                        <Link href={`/${locale}/demande-demo?type=institute`}>
                                            Demander une démo
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                    <p className="mt-4 text-sm text-muted-foreground">Réponse sous 24h - Sans engagement</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Footer Help Section */}
                <section className="border-t border-border bg-muted/30 py-8">
                    <div className="container mx-auto px-4 text-center">
                        <p className="mb-2 text-foreground">Besoin d'aide ?</p>
                        <a href="mailto:contact@edupro.africa" className="font-medium text-violet-600 hover:underline">
                            contact@edupro.africa
                        </a>
                        <div className="mt-4 flex justify-center gap-4 text-sm">
                            <Link href="/conditions" className="text-muted-foreground hover:text-foreground">
                                CGU
                            </Link>
                            <span className="text-muted-foreground/50">•</span>
                            <Link href="/confidentialite" className="text-muted-foreground hover:text-foreground">
                                Politique de confidentialité
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
