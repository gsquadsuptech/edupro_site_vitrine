import { Container } from "@/components/marketing/layout/container"
import { Award, Heart, UsersIcon, Zap } from "lucide-react"

export function ValuesSection() {
    const values = [
        {
            icon: Award,
            title: "Excellence Africaine",
            subtitle: "Nous visons l'excellence mondiale, ancrée dans l'Afrique",
            description:
                "Nous refusons le compromis sur la qualité. Chaque formation, chaque fonctionnalité, chaque interaction doit être au niveau des meilleurs standards internationaux, tout en étant profondément pertinente pour le contexte africain.",
            practices: [
                "Processus de sélection rigoureux des formateurs",
                "Tests utilisateurs continus",
                "Veille technologique permanente",
                "Certifications internationales",
            ],
        },
        {
            icon: Heart,
            title: "Impact Avant Profit",
            subtitle: "Notre succès se mesure en vies transformées",
            description:
                "Nous construisons un modèle économique durable, mais jamais au détriment de notre mission. Chaque décision est évaluée d'abord sur son impact sur les apprenants, les formateurs, et les entreprises africaines.",
            practices: [
                "Tarifs accessibles pensés pour le contexte africain",
                "Programme de bourses pour talents à fort potentiel (en préparation)",
                "Transparence totale sur notre vision et nos objectifs d'impact",
                "Réinvestissement prioritaire dans la R&D et l'amélioration de la plateforme",
            ],
        },
        {
            icon: UsersIcon,
            title: "Orientation Utilisateur",
            subtitle: "Chaque décision commence par l'apprenant",
            description:
                "Nous concevons chaque fonctionnalité, chaque contenu, chaque interaction en pensant d'abord à l'expérience de nos utilisateurs : apprenants, formateurs et entreprises. Leur réussite est notre seule boussole.",
            practices: [
                "Tests utilisateurs réguliers avant chaque lancement",
                "Support client réactif et bienveillant",
                "Feedback intégré en continu dans nos cycles de développement",
                "Formations co-créées avec les utilisateurs finaux",
                "Interface pensée pour le contexte africain (mobile-first, faible bande passante)",
            ],
        },
        {
            icon: Zap,
            title: "Agilité et Innovation",
            subtitle: "Le statu quo n'est pas une option",
            description:
                "L'Afrique évolue rapidement, et nous aussi. Nous testons, itérons, apprenons, et améliorons en permanence. L'échec intelligent est encouragé, la stagnation est inacceptable.",
            practices: [
                "Sprints d'innovation trimestriels",
                "Culture du test & learn",
                "Adoption rapide des nouvelles technologies (IA, cloud-native, edge computing)",
                "Feedback utilisateurs intégré en continu",
            ],
        },
    ]

    return (
        <section className="py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">Les valeurs qui nous unissent</h2>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Nos valeurs ne sont pas des mots sur un mur. Ce sont les principes qui guident chacune de nos décisions, de
                        notre culture interne à nos interactions avec nos clients.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    {values.map((value, index) => {
                        const Icon = value.icon
                        return (
                            <div key={index} className="rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg">
                                <div className="mb-6 inline-flex rounded-xl bg-gradient-to-br from-primary/10 to-chart-2/10 p-4">
                                    <Icon className="h-8 w-8 text-primary" />
                                </div>

                                <h3 className="mb-2 text-2xl font-bold">{value.title}</h3>
                                <p className="mb-4 text-lg font-medium text-muted-foreground">{value.subtitle}</p>

                                <p className="mb-6 leading-relaxed text-muted-foreground">{value.description}</p>

                                <div className="space-y-3">
                                    <p className="text-sm font-semibold text-foreground">En pratique:</p>
                                    <ul className="space-y-2">
                                        {value.practices.map((practice, idx) => (
                                            <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                                                <span className="text-primary">✓</span>
                                                <span>{practice}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Container>
        </section>
    )
}
