import { Container } from "@/components/marketing/layout/container"
import { Banknote, TrendingUp, Target } from "lucide-react"

export function OpportunitySection() {
    const opportunities = [
        {
            icon: Banknote,
            number: "40-50 Md FCFA",
            title: "Marché Total",
            description:
                "Taille du marché de la formation professionnelle dans nos 3 pays de lancement (Sénégal, Côte d'Ivoire, Rwanda)",
        },
        {
            icon: TrendingUp,
            number: "+32% CAGR",
            title: "Croissance Marché",
            description:
                "Croissance annuelle du secteur EdTech en Afrique, accélérée post-COVID et par les politiques publiques",
        },
        {
            icon: Target,
            number: "Aucun",
            title: "Leader Dominant",
            description: "Marché massivement fragmenté, opportunité de créer le leader panafricain de la formation pro",
        },
    ]

    return (
        <section className="py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">L'Opportunité en 3 Chiffres</h2>
                    <p className="text-lg text-muted-foreground">Un marché massif en pleine croissance sans leader consolidé</p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {opportunities.map((item, index) => {
                        const Icon = item.icon
                        return (
                            <div
                                key={index}
                                className="rounded-xl border border-border bg-card p-8 transition-all hover:shadow-lg hover:shadow-primary/10"
                            >
                                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                                    <Icon className="h-6 w-6 text-primary" />
                                </div>
                                <div className="mb-2 text-3xl font-bold text-primary">{item.number}</div>
                                <div className="mb-3 font-semibold text-foreground">{item.title}</div>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                        )
                    })}
                </div>
            </Container>
        </section>
    )
}
