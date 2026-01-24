"use client"

import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/hooks/useLanguage"

export function PricingSection() {
    const { locale } = useLanguage()

    const included = [
        "Plateforme complète et personnalisée",
        "Accès à la marketplace de formations",
        "Outils de création de contenus avec IA",
        "Dashboard analytics et reporting",
        "Certificats personnalisables",
        "Gestion multi-sites et multi-rôles",
        "Support technique dédié",
        "Formation de vos administrateurs",
        "Accompagnement au déploiement",
        "Mises à jour et nouvelles fonctionnalités",
    ]

    const options = [
        "Marque blanche complète",
        "Intégrations SIRH/ATS",
        "Création de contenus sur-mesure",
        "Support premium 24/7",
        "Bootcamp formateurs",
        "Consulting stratégique",
    ]

    return (
        <section className="bg-muted/30 py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                        Des solutions adaptées à votre taille et vos besoins
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Chez EduPro, nous construisons avec vous une solution adaptée à votre entreprise
                    </p>
                </div>

                <div className="mb-12 grid gap-8 md:grid-cols-2">
                    <div className="rounded-xl border-2 border-border bg-card p-8">
                        <h3 className="mb-6 text-xl font-bold">Ce qui est toujours inclus</h3>
                        <div className="space-y-4">
                            {included.map((item, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                    <span className="text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl border-2 border-primary bg-primary/5 p-8">
                        <h3 className="mb-6 text-xl font-bold">Options disponibles selon vos besoins</h3>
                        <div className="space-y-4">
                            {options.map((item, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                    <span className="text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-8 text-center">
                    <h3 className="mb-4 text-2xl font-bold">Pourquoi un devis personnalisé?</h3>
                    <p className="mb-6 text-muted-foreground">
                        Parce que nous refusons de vous faire payer pour des fonctionnalités dont vous n'avez pas besoin. Nous
                        définissons ensemble votre nombre de collaborateurs, vos parcours prioritaires, les fonctionnalités
                        essentielles et un calendrier de déploiement réaliste.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Button size="lg" className="bg-gradient-to-r from-primary to-chart-2" asChild>
                            <Link href={`/${locale}/demande-demo`}>
                                Réserver une démo personnalisée
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline">
                            Demander un devis
                        </Button>
                    </div>
                </div>
            </Container>
        </section>
    )
}
