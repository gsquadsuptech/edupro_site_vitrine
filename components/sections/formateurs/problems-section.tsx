import { Container } from "@/components/marketing/layout/container"

export function FormateursProblemsSection() {
    const problems = [
        {
            title: "Portée limitée",
            icon: "❌",
            description: "Vous formez 10-30 personnes en présentiel, mais des milliers ont besoin de votre expertise.",
            consequence: "Impact limité et revenus plafonnés malgré une expertise reconnue.",
        },
        {
            title: "Outils complexes",
            icon: "❌",
            description:
                "Créer du contenu digital de qualité demande des compétences techniques que vous n'avez pas ou peu de temps à maîtriser.",
            consequence: "Vous restez bloqué dans le présentiel ou créez du contenu de qualité moyenne.",
        },
        {
            title: "Visibilité inexistante",
            icon: "❌",
            description: "Même avec du contenu de qualité, comment atteindre votre audience cible à travers l'Afrique?",
            consequence: "Vos formations restent confidentielles et votre expertise sous-valorisée.",
        },
        {
            title: "Gestion chronophage",
            icon: "❌",
            description:
                "Entre la création, la gestion administrative, le suivi des apprenants et la logistique, vous manquez de temps pour ce qui compte: former.",
            consequence: "Épuisement et impossibilité de scaler votre activité.",
        },
    ]

    return (
        <section className="py-20 md:py-32 bg-muted/30">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                        Les défis de la formation en Afrique que vous connaissez trop bien
                    </h2>
                    <p className="text-lg text-muted-foreground">Votre expertise est précieuse, mais sous-exploitée</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    {problems.map((problem, index) => (
                        <div key={index} className="rounded-xl border border-border bg-card p-8 hover:shadow-lg transition-shadow">
                            <div className="mb-4 text-4xl">{problem.icon}</div>
                            <h3 className="mb-3 text-xl font-bold">{problem.title}</h3>
                            <p className="mb-4 text-muted-foreground">{problem.description}</p>
                            <p className="text-sm italic text-chart-5">
                                <strong>Conséquence:</strong> {problem.consequence}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-lg italic text-muted-foreground">
                        Et si vous pouviez former des milliers de personnes avec le même effort?
                    </p>
                </div>
            </Container>
        </section>
    )
}
