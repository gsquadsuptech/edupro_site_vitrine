import { Container } from "@/components/marketing/layout/container"
import { Globe, Users, Target, Sprout } from "lucide-react"

export function PillarsSection() {
    const pillars = [
        {
            icon: Globe,
            title: "Accessibilité",
            subtitle: "Faire tomber toutes les barrières",
            features: [
                "Prix adaptés aux réalités locales (jusqu'à 70% moins cher)",
                "Mobile-first : 78% de notre trafic est mobile",
                "Mode offline natif pour zones à faible connexion",
                "Multilingue (FR, EN, + langues locales en phase 2)",
                "Paiements locaux (Mobile Money, FCFA, Shilling)",
            ],
            commitment: "Aucun talent ne doit être limité par sa géographie ou sa situation économique.",
        },
        {
            icon: Users,
            title: "Inclusion",
            subtitle: "Chaque voix compte, chaque talent a sa place",
            features: [
                "Contenus créés par des experts africains pour l'Afrique",
                "Représentation équitable des genres et des régions",
                "Parcours adaptés à tous les niveaux (débutant à expert)",
                "Accessibilité pour personnes en situation de handicap",
                "Bourses et programmes d'aide pour les profils à fort potentiel",
                "Nous célébrons la diversité africaine comme notre plus grande richesse.",
            ],
            commitment: "Nous célébrons la diversité africaine comme notre plus grande richesse.",
        },
        {
            icon: Target,
            title: "Contextualisation",
            subtitle: "Des solutions pensées pour nos réalités",
            features: [
                "Cas d'usage basés sur des entreprises africaines réelles",
                "Formateurs qui comprennent le contexte local",
                "Intégration des spécificités réglementaires de chaque pays",
                "Exemples et exercices ancrés dans la réalité africaine",
                "Partenariats avec des entreprises locales leaders",
            ],
            commitment: "Qualité internationale, pertinence locale. Le meilleur des deux mondes.",
        },
        {
            icon: Sprout,
            title: "Durabilité",
            subtitle: "Bâtir pour les générations futures",
            features: [
                "Modèle économique équilibré et rentable",
                "Rémunération juste des formateurs africains",
                "Impact social mesurable et transparent",
                "Développement des compétences critiques pour l'avenir",
                "Partenariats avec des acteurs engagés pour le développement",
            ],
            commitment: "Nous ne construisons pas une startup. Nous bâtissons une institution.",
        },
    ]

    return (
        <section className="py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">Les 4 piliers qui nous guident</h2>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    {pillars.map((pillar, index) => {
                        const Icon = pillar.icon
                        return (
                            <div key={index} className="rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg">
                                <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-4">
                                    <Icon className="h-8 w-8 text-primary" />
                                </div>

                                <h3 className="mb-2 text-2xl font-bold">{pillar.title}</h3>
                                <p className="mb-6 text-lg font-medium text-muted-foreground">{pillar.subtitle}</p>

                                <div className="mb-6 space-y-3">
                                    <p className="text-sm font-semibold text-foreground">Ce que ça signifie concrètement:</p>
                                    <ul className="space-y-2">
                                        {pillar.features.map((feature, idx) => (
                                            <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                                                <span className="text-primary">•</span>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="rounded-lg bg-primary/5 p-4">
                                    <p className="text-sm font-medium italic text-foreground">{pillar.commitment}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Container>
        </section>
    )
}
