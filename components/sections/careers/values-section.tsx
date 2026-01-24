import { Lightbulb, Target, Users, TrendingUp } from "lucide-react"
import { Container } from "@/components/marketing/layout/container"

const values = [
    {
        icon: Lightbulb,
        title: "Innovation",
        description:
            "Nous repoussons les limites pour créer des solutions d'apprentissage révolutionnaires adaptées au contexte africain.",
    },
    {
        icon: Target,
        title: "Impact",
        description:
            "Chaque action que nous menons vise à créer un impact mesurable sur la vie des apprenants et des communautés.",
    },
    {
        icon: Users,
        title: "Communauté",
        description:
            "Nous croyons en la force du collectif et cultivons un environnement inclusif où chacun peut s'épanouir.",
    },
    {
        icon: TrendingUp,
        title: "Excellence",
        description:
            "Nous visons l'excellence dans tout ce que nous faisons, de nos produits à nos relations avec nos partenaires.",
    },
]

export function CareersValuesSection() {
    return (
        <section className="py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Nos valeurs</h2>
                    <p className="text-lg text-muted-foreground">Ce qui nous guide au quotidien</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {values.map((value, index) => {
                        const Icon = value.icon
                        return (
                            <div
                                key={index}
                                className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <Icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="mb-3 text-xl font-bold">{value.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                            </div>
                        )
                    })}
                </div>
            </Container>
        </section>
    )
}
