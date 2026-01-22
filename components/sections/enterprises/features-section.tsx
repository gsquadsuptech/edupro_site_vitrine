import { Container } from "@/components/marketing/layout/container"
import { Zap, Users, Brain, Globe, CheckCircle, BarChart3 } from "lucide-react"

export function FeaturesSection() {
    const features = [
        {
            icon: Zap,
            title: "Onboarding Automatisé",
            subtitle: "Transformez 6 mois en 6 semaines",
            description:
                "Parcours personnalisés par poste/département, validation étape par étape, quiz auto-corrigés, certificat d'intégration automatique, notifications manageurs.",
            benefit: "Bénéfice mesurable: -50% time-to-productivity constaté chez nos clients BPO",
        },
        {
            icon: Globe,
            title: "Accès à la Marketplace",
            subtitle: "Des centaines de formations sectorielles",
            description:
                "Soft skills (communication, leadership, service client), hard skills sectoriels (Tech, Entrepreneuriat, Construction, BPO, Santé), contenus créés par des experts africains certifiés.",
            benefit: "Catalogue en constante expansion selon les besoins du marché",
        },
        {
            icon: Brain,
            title: "Création de Contenus IA",
            subtitle: "Vos experts deviennent formateurs",
            description:
                "Assistant IA pour scénariser vos formations, génération automatique de quiz, transformation de documents en modules interactifs, interface intuitive et guidée.",
            benefit: "Créez vos formations internes 10x plus vite",
        },
        {
            icon: Users,
            title: "Gestion Multi-Sites",
            subtitle: "Une plateforme, N agences",
            description:
                "Gestion centralisée avec vue par site, parcours différenciés selon la localisation, multi-administrateurs avec rôles et permissions, déploiement simultané.",
            benefit: "Formez toutes vos équipes de manière cohérente, où qu'elles soient",
        },
        {
            icon: CheckCircle,
            title: "Certifications et Conformité",
            subtitle: "Traçabilité totale pour vos audits",
            description:
                "Certificats personnalisables et vérifiables, historique complet des formations par collaborateur, exports pour audits, rappels automatiques de renouvellement.",
            benefit: "Toute la documentation nécessaire pour vos audits en quelques clics",
        },
        {
            icon: BarChart3,
            title: "Analytics et Reporting",
            subtitle: "Les données qui font la différence",
            description:
                "Dashboard de suivi en temps réel, taux de complétion et engagement par équipe, statistiques détaillées par formation, exports personnalisables.",
            benefit: "Suivez précisément la progression de vos équipes et identifiez les besoins",
        },
    ]

    return (
        <section className="py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                        Tout ce dont votre DRH a besoin (et même plus)
                    </h2>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <div key={index} className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg">
                                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                                    <Icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="mb-1 text-lg font-bold">{feature.title}</h3>
                                <p className="mb-3 text-sm font-semibold text-primary">{feature.subtitle}</p>
                                <p className="mb-4 text-sm text-muted-foreground">{feature.description}</p>
                                <div className="rounded-lg bg-accent/10 p-3">
                                    <p className="text-xs font-semibold text-accent">{feature.benefit}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Container>
        </section>
    )
}
