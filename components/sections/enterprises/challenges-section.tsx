import { Container } from "@/components/marketing/layout/container"

export function ChallengesSection() {
    const challenges = [
        {
            icon: "📊",
            title: "Turnover explosif",
            description:
                "70% de turnover dans certains secteurs (BPO, retail, tech). Former un collaborateur qui part après 6 mois coûte une fortune.",
            impact: "Perte de productivité, coûts de recrutement répétés, démotivation des équipes.",
        },
        {
            icon: "⏱️",
            title: "Onboarding interminable",
            description:
                "3 à 6 mois pour atteindre la pleine productivité. Formations en présentiel coûteuses, manuels PDF obsolètes, formateurs surchargés.",
            impact: "Time-to-productivity rallongé, nouvelles recrues frustrées, managers dépassés.",
        },
        {
            icon: "📚",
            title: "Skills gap grandissant",
            description:
                "Les compétences d'hier ne suffisent plus. 85% des métiers de 2030 n'existent pas encore. Vos équipes ont besoin d'upskilling constant.",
            impact: "Perte de compétitivité, difficultés à innover, dépendance aux recrutements externes.",
        },
        {
            icon: "💰",
            title: "Budget formation mal optimisé",
            description:
                "Vous investissez 2-5% de la masse salariale dans la formation sans savoir si ça marche vraiment. Aucune donnée, juste de l'intuition.",
            impact: "ROI invisible, difficultés à justifier le budget auprès de la direction, gaspillage.",
        },
        {
            icon: "🌍",
            title: "Multi-sites ingérable",
            description:
                "Vos équipes sont dispersées (Dakar, Abidjan, Nairobi, agences régionales). Former tout le monde de manière cohérente relève du casse-tête.",
            impact: "Formations inégales, collaborateurs isolés, coûts logistiques énormes.",
        },
        {
            icon: "✅",
            title: "Conformité et certifications",
            description:
                "Prouver la conformité des formations (ISO, audits clients, réglementation locale) devient mission impossible sans traçabilité digitale.",
            impact: "Risques d'audit, perte de certifications, contrats clients menacés.",
        },
    ]

    return (
        <section className="py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                        Les 6 défis qui freinent votre croissance
                    </h2>
                </div>

                <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {challenges.map((challenge, index) => (
                        <div key={index} className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg">
                            <div className="mb-4 text-4xl">{challenge.icon}</div>
                            <h3 className="mb-2 text-lg font-bold">{challenge.title}</h3>
                            <p className="mb-4 text-sm text-muted-foreground">{challenge.description}</p>
                            <div className="rounded-lg bg-destructive/10 p-3">
                                <p className="text-xs font-semibold text-destructive">Impact:</p>
                                <p className="text-xs text-muted-foreground">{challenge.impact}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <p className="text-lg italic text-muted-foreground">
                        Et si vous pouviez régler ces 6 problèmes avec une seule plateforme?
                    </p>
                </div>
            </Container>
        </section>
    )
}
