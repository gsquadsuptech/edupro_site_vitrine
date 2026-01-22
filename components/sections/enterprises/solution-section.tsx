import { Container } from "@/components/marketing/layout/container"
import { CheckCircle2, Zap, BarChart3 } from "lucide-react"

export function SolutionSection() {
    const differentiators = [
        {
            icon: CheckCircle2,
            title: "Personnalisation à Votre Image",
            subtitle: "Votre académie digitale clé en main",
            description:
                "Accédez à votre espace de formation sur un sous-domaine EduPro personnalisé. Logo, couleurs de marque, contenus sur-mesure. Option marque blanche disponible pour un domaine 100% à votre nom si besoin.",
            example: "Exemple: votreentreprise.edupro.africa",
        },
        {
            icon: BarChart3,
            title: "ROI Mesurable en Temps Réel",
            subtitle: "Enfin des chiffres qui parlent à la direction",
            description:
                "Dashboard analytics complet : taux de complétion, temps passé, skills acquis, impact sur la performance. Exportez vos rapports pour le COMEX en 2 clics.",
            example: "Démonstration du dashboard lors de la démo",
        },
        {
            icon: Zap,
            title: "Déploiement Express",
            subtitle: "48h de l'onboarding au premier cours",
            description:
                "Pas de projet IT de 6 mois. Nos experts vous accompagnent : migration de contenus, création de parcours, formation des admins. Vous êtes opérationnel en 2 jours.",
            example: "Support dédié pendant 3 mois",
        },
    ]

    return (
        <section className="bg-muted/30 py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                        Une académie digitale clé en main, à votre marque
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        EduPro Enterprise est la solution complète pour digitaliser, automatiser et mesurer vos formations en
                        Afrique.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {differentiators.map((item, index) => {
                        const Icon = item.icon
                        return (
                            <div key={index} className="rounded-xl border border-border bg-card p-8 transition-all hover:shadow-lg">
                                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                                    <Icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
                                <p className="mb-4 text-sm font-semibold text-primary">{item.subtitle}</p>
                                <p className="mb-4 text-sm text-muted-foreground">{item.description}</p>
                                <div className="rounded-lg bg-muted/50 p-3">
                                    <p className="text-xs italic text-muted-foreground">{item.example}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Container>
        </section>
    )
}
