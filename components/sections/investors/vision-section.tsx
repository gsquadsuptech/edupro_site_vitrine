import { Container } from "@/components/marketing/layout/container"

export function VisionSection() {
    const vision = [
        { icon: "🌍", label: "Pays couverts", value: "15", description: "Afrique subsaharienne" },
        { icon: "🎓", label: "Apprenants formés", value: "2M+", description: "Cumulé" },
        { icon: "🏢", label: "Entreprises clientes", value: "10K+", description: "Actifs" },
        { icon: "👨‍🏫", label: "Formateurs partenaires", value: "5K+", description: "Qualifiés" },
        { icon: "💰", label: "ARR Cible", value: "50M+", description: "USD" },
        { icon: "🦄", label: "Valorisation", value: "250M+", description: "USD" },
    ]

    const impact = [
        { metric: "85%", description: "des apprenants trouvent un emploi dans 6 mois" },
        { metric: "+35%", description: "augmentation revenus post-formation" },
        { metric: "50%+", description: "de femmes dans nos programmes" },
        { metric: "ODD", description: "Contribution aux ODD 4, 5, 8, 10" },
    ]

    return (
        <section className="bg-muted/30 py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">Vision 2030</h2>
                    <p className="text-lg text-muted-foreground">De 3 pays à 15 pays en 5 ans</p>
                </div>

                <h3 className="mb-8 text-center text-xl font-bold">Vision Chiffrée (Aspirationnelle)</h3>
                <div className="mb-16 grid gap-6 md:grid-cols-3">
                    {vision.map((item, index) => (
                        <div key={index} className="rounded-lg border border-border bg-card p-6 text-center">
                            <div className="mb-2 text-3xl">{item.icon}</div>
                            <div className="mb-1 text-2xl font-bold text-primary">{item.value}</div>
                            <div className="mb-1 font-semibold text-foreground">{item.label}</div>
                            <div className="text-xs text-muted-foreground">{item.description}</div>
                        </div>
                    ))}
                </div>

                <h3 className="mb-8 text-center text-xl font-bold">Impact Social</h3>
                <div className="grid gap-6 md:grid-cols-2">
                    {impact.map((item, index) => (
                        <div key={index} className="rounded-lg border border-accent/20 bg-accent/5 p-6">
                            <div className="mb-2 text-3xl font-bold text-accent">{item.metric}</div>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    )
}
