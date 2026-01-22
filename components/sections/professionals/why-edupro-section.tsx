import { Container } from "@/components/marketing/layout/container"
import { BookOpen, Globe, Zap, Award, Users } from "lucide-react"

export function WhyEduProSection() {
    const reasons = [
        {
            icon: BookOpen,
            title: "Contenus Contextualisés",
            description:
                "Des formations créées par des experts africains qui comprennent vos défis. Exemples, cas pratiques et scénarios adaptés à nos réalités locales.",
            example:
                "Apprenez le marketing digital avec des exemples d'Orange CI, Wave, Jumia – des marques que vous connaissez.",
        },
        {
            icon: Zap,
            title: "Accessibilité Totale",
            description:
                "Des formations de qualité internationale à prix accessible pour le marché africain. Paiement Mobile Money accepté (Orange Money, Wave, MTN).",
            example: "L'excellence ne devrait pas être réservée à une élite.",
        },
        {
            icon: Globe,
            title: "Flexibilité Maximale",
            description:
                "Deux formats selon vos besoins : formations en auto-formation (100% à votre rythme) ou hybrides (sessions live et accompagnement).",
            example: "Apprenez pendant vos trajets, votre pause déjeuner, le soir chez vous – ou rejoignez des cohortes.",
        },
        {
            icon: Award,
            title: "Certifications de Compétences",
            description:
                "Des certificats de compétences avérées créés en co-certification avec des experts. Chaque certification valide des compétences pratiques et mesurables.",
            example: "Partagez-les sur LinkedIn en 1 clic. Augmentez votre employabilité et votre valeur sur le marché.",
        },
        {
            icon: Users,
            title: "Communauté et Support",
            description:
                "Rejoignez une communauté panafricaine de professionnels ambitieux. Support en français et anglais, assistance technique, et accès à des mentors experts.",
            example: "Vous n'apprenez jamais seul, réseau professionnel en bonus.",
        },
    ]

    return (
        <section className="py-20 md:py-32 bg-muted/30">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                        5 raisons de choisir EduPro pour booster votre carrière
                    </h2>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {reasons.map((reason, index) => {
                        const Icon = reason.icon
                        return (
                            <div
                                key={index}
                                className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                                    <Icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold">{reason.title}</h3>
                                <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{reason.description}</p>
                                <div className="border-t border-border/50 pt-3">
                                    <p className="text-xs italic text-chart-2 font-medium">{reason.example}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-muted-foreground italic">
                        Prêt à découvrir le Skill Pack qui va transformer votre carrière?
                    </p>
                </div>
            </Container>
        </section>
    )
}
