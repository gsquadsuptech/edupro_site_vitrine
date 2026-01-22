import { Container } from "@/components/marketing/layout/container"

export function TimingSection() {
    const catalysts = [
        {
            icon: "📱",
            title: "Révolution Mobile",
            points: [
                "78% de taux de pénétration mobile",
                "4G généralisée dans les villes moyennes",
                "Coût data divisé par 4 depuis 2020",
            ],
        },
        {
            icon: "💳",
            title: "Explosion Mobile Money",
            points: [
                "60% de la population bancarisée via mobile money",
                "300M d'utilisateurs Orange Money, Wave, M-Pesa",
                "Écosystème fintech mature pour abonnements",
            ],
        },
        {
            icon: "🎓",
            title: "Politiques Publiques Favorables",
            points: [
                "Sénégal: Vision 2050 + Fonds 3FPT",
                "Côte d'Ivoire: Fonds Formation Continue (15Md FCFA)",
                "Rwanda: Digital Skills Program",
            ],
        },
        {
            icon: "💼",
            title: "Pénurie de Talents Post-COVID",
            points: [
                "Travail hybride normalisé",
                "Demande explosive en compétences digitales",
                "Entreprises prêtes à investir dans la formation",
            ],
        },
        {
            icon: "🌍",
            title: "Momentum EdTech Africa",
            points: [
                "+200% de startups EdTech depuis 2020",
                "500M USD de financement en 2023-2024",
                "Sorties réussies: Andela, uLesson",
            ],
        },
    ]

    return (
        <section className="py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">Pourquoi Maintenant?</h2>
                    <p className="text-lg text-muted-foreground">5 catalyseurs convergent simultanément</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {catalysts.map((catalyst, index) => (
                        <div key={index} className="rounded-lg border border-border bg-card p-6 hover:shadow-lg transition-all">
                            <div className="mb-3 text-3xl">{catalyst.icon}</div>
                            <h3 className="mb-3 font-bold text-foreground">{catalyst.title}</h3>
                            <ul className="space-y-2">
                                {catalyst.points.map((point, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 rounded-lg border-2 border-primary/20 bg-primary/5 p-8 text-center">
                    <p className="text-lg font-semibold text-foreground">
                        La fenêtre d'opportunité: <span className="text-primary">2-3 ans pour prendre le leadership.</span>
                    </p>
                </div>
            </Container>
        </section>
    )
}
