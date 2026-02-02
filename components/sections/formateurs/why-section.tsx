import { Container } from "@/components/marketing/layout/container"
import { Zap, Globe, TrendingUp, Headphones, BarChart3 } from "lucide-react"

export function FormateursWhySection() {
    const reasons = [
        {
            icon: Zap,
            title: "Création Simplifiée",
            highlight: "Gagnez 40% de temps avec l'IA",
            description:
                "Notre assistant IA vous aide à structurer vos cours, créer des quiz pertinents, générer des exercices pratiques. La création n'a jamais été aussi simple.",
            cta: "Scénarisez votre expertise en quelques clics",
        },
        {
            icon: Globe,
            title: "Audience Panafricaine",
            highlight: "Du Sénégal au Rwanda, touchant 3 pays",
            description:
                "Vos formations sont accessibles à des milliers d'apprenants motivés à travers l'Afrique. Pas de frontières pour votre expertise.",
            cta: "Une audience que vous n'auriez jamais touchée seul",
        },
        {
            icon: TrendingUp,
            title: "Revenus Récurrents",
            highlight: "Jusqu'à 70% de commission",
            description:
                "Créez une fois, générez des revenus à chaque inscription. Monétisez votre expertise sans plafond de revenus.",
            cta: "Vos formations travaillent pour vous 24/7",
        },
        {
            icon: Headphones,
            title: "Support Complet",
            highlight: "On s'occupe de la technique",
            description:
                "Hébergement, paiements, certificats, support apprenants : tout est géré. Vous vous concentrez sur la création et la transmission.",
            cta: "Support dédié en français, réponse sous 24h",
        },
        {
            icon: BarChart3,
            title: "Pilotage Facile",
            highlight: "Analytics en temps réel",
            description:
                "Suivez la progression de vos apprenants, identifiez les points d'amélioration, mesurez votre impact. Des données pour optimiser vos formations.",
            cta: "Dashboard intuitif, insights actionnables",
        },
        {
            icon: BarChart3,
            title: "Zéro Investissement",
            highlight: "Lancez-vous sans frais ni infrastructure",
            description:
                "Créez une fois, générez des revenus à chaque inscription. Monétisez votre expertise sans plafond de revenus.",
            cta: "Concentrez-vous sur votre expertise, on s'occupe du reste.",
        },
    ]

    return (
        <section className="py-20 md:py-32 bg-muted/30">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                        Pourquoi 150+ formateurs nous font confiance
                    </h2>
                    <p className="text-lg text-muted-foreground">Les 6 raisons qui changent tout</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {reasons.map((reason, index) => {
                        const Icon = reason.icon
                        return (
                            <div
                                key={index}
                                className="rounded-xl border border-border bg-card p-8 hover:shadow-lg transition-shadow"
                            >
                                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                                    <Icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold">{reason.title}</h3>
                                <p className="mb-4 text-sm font-semibold text-primary">{reason.highlight}</p>
                                <p className="mb-4 text-sm text-muted-foreground">{reason.description}</p>
                                <p className="text-xs italic text-chart-5">{reason.cta}</p>
                            </div>
                        )
                    })}
                </div>
            </Container>
        </section>
    )
}
