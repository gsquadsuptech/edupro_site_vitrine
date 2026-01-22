import { Container } from "@/components/marketing/layout/container"
import { Video, Sparkles, Users, CreditCard, Smartphone, BarChart3, Palette, Lock, Award } from "lucide-react"

export function FormateursFeaturesSection() {
    const features = [
        {
            icon: Video,
            title: "Studio de Création",
            items: [
                "Éditeur de contenu intuitif",
                "Upload vidéos (optimisées auto)",
                "Création de quiz et exercices",
                "Intégration documents (PDF, PPT, Word)",
                "Prévisualisation en temps réel",
            ],
        },
        {
            icon: Sparkles,
            title: "Assistant IA",
            items: [
                "Structuration automatique de cours",
                "Génération de quiz contextualisés",
                "Suggestions d'exercices pratiques",
                "Optimisation pédagogique",
            ],
        },
        {
            icon: Users,
            title: "Gestion Apprenants",
            items: [
                "Suivi de progression en temps réel",
                "Messagerie intégrée",
                "Groupes de discussion",
                "Sessions live (Meet/Zoom/Teams)",
                "Remise de certificats automatisée",
                "Notifications intelligentes",
            ],
        },
        {
            icon: CreditCard,
            title: "Monétisation",
            items: [
                "Tarification flexible (unique, abonnement, paiements échelonnés)",
                "Paiements sécurisés (Mobile Money, CB)",
                "Commissions automatiques",
                "Factures générées automatiquement",
                "Codes promo et offres",
            ],
        },
        {
            icon: Smartphone,
            title: "Multi-plateforme",
            items: [
                "Web responsive",
                "Application PWA",
                "Mode hors-ligne",
                "Synchronisation automatique",
                "Optimisé faible bande passante",
                "Accès illimité 24/7",
            ],
        },
        {
            icon: BarChart3,
            title: "Analytics",
            items: [
                "Taux de complétion",
                "Engagement par module",
                "Feedback apprenants",
                "Revenus en temps réel",
                "Insights pédagogiques",
                "Export de données",
            ],
        },
        {
            icon: Palette,
            title: "Personnalisation (Instituts)",
            items: [
                "Marque blanche complète",
                "Votre nom de domaine",
                "Charte graphique personnalisée",
                "Emails à votre marque",
                "Certificats à votre nom",
                "Portail dédié",
            ],
        },
        {
            icon: Lock,
            title: "Sécurité & Conformité",
            items: [
                "Hébergement sécurisé",
                "Certificats SSL",
                "Backups quotidiens",
                "RGPD compliant",
                "Protection contenu",
                "Anti-piratage",
            ],
        },
        {
            icon: Award,
            title: "Certifications",
            items: [
                "Templates personnalisables",
                "Vérification en ligne",
                "Export PDF haute qualité",
                "Badges numériques",
                "Partage LinkedIn automatique",
            ],
        },
    ]

    return (
        <section className="py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                        Des outils pensés pour votre succès
                    </h2>
                    <p className="text-lg text-muted-foreground">Tout ce dont vous avez besoin, en un seul endroit</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <div
                                key={index}
                                className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow"
                            >
                                <Icon className="mb-4 h-7 w-7 text-primary" />
                                <h3 className="mb-4 font-bold">{feature.title}</h3>
                                <ul className="space-y-2">
                                    {feature.items.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <span className="mt-0.5 text-primary">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    })}
                </div>
            </Container>
        </section>
    )
}
