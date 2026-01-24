import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { Briefcase, GraduationCap, Handshake, ArrowRight } from "lucide-react"
import Link from "next/link"

export function JoinSection() {
    const opportunities = [
        {
            icon: Briefcase,
            title: "Opportunités de Carrière",
            subtitle: "Construisez avec nous la plateforme de demain",
            description:
                "Rejoindre EduPro, c'est participer à la transformation de la formation professionnelle en Afrique. Nous recherchons des talents passionnés qui partagent notre vision et veulent avoir un impact mesurable.",
            benefits: [
                "Mission inspirante avec impact social direct",
                "Environnement de travail stimulant et bienveillant",
                "Remote-friendly avec flexibilité",
                "Formation continue et développement des compétences",
                "Équipe multiculturelle et dynamique",
            ],
            note: "Nous recrutons régulièrement dans les domaines du développement, du design, de la pédagogie, du business development et du support client.",
            cta: "Nous contacter pour explorer les opportunités",
            ctaLink: "#contact",
        },
        {
            icon: GraduationCap,
            title: "Devenir Formateur Partenaire",
            subtitle: "Partagez votre expertise, touchez des milliers d'apprenants",
            description: "Vous êtes expert dans votre domaine et vous voulez avoir un impact à grande échelle?",
            benefits: [
                "Outils IA pour créer vos formations 40% plus vite",
                "Visibilité panafricaine auprès de milliers d'apprenants",
                "Rémunération transparente et juste",
                "Support technique complet",
                "Communauté de formateurs africains d'excellence",
            ],
            note: "Domaines recherchés: Tech, Business, Leadership, Construction, Santé, Agriculture, Finance",
            cta: "Rejoindre la communauté de formateurs",
            ctaLink: "/formateurs",
        },
        {
            icon: Handshake,
            title: "Devenir Partenaire",
            subtitle: "Construisons ensemble l'écosystème de demain",
            description: "Nous sommes ouverts à des partenariats stratégiques avec :",
            benefits: [
                "🏢 Entreprises - Formations sur-mesure pour vos équipes",
                "🎓 Instituts - Solution marque blanche",
                "📰 Médias - Co-création de contenus",
                "🌍 ONG & Bailleurs - Programmes d'impact social",
                "💰 Investisseurs - Rejoindre notre mission",
            ],
            note: "",
            cta: "Discuter d'un partenariat",
            ctaLink: "#contact",
        },
    ]

    return (
        <section className="bg-muted/30 py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">Vous voulez faire partie de l'histoire?</h2>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        EduPro n'est pas qu'une entreprise. C'est un mouvement pour transformer l'éducation professionnelle en
                        Afrique. Et nous cherchons des personnes passionnées pour nous rejoindre.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {opportunities.map((opportunity, index) => {
                        const Icon = opportunity.icon
                        return (
                            <div
                                key={index}
                                className="flex flex-col rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg"
                            >
                                <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-4">
                                    <Icon className="h-8 w-8 text-primary" />
                                </div>

                                <h3 className="mb-2 text-xl font-bold">{opportunity.title}</h3>
                                <p className="mb-4 text-sm font-medium text-muted-foreground">{opportunity.subtitle}</p>

                                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{opportunity.description}</p>

                                <div className="mb-6 space-y-2">
                                    <p className="text-sm font-semibold text-foreground">
                                        {index === 0 ? "Ce que nous offrons:" : index === 1 ? "Ce que nous proposons:" : ""}
                                    </p>
                                    <ul className="space-y-2">
                                        {opportunity.benefits.map((benefit, idx) => (
                                            <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                                                <span className="text-primary">•</span>
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {opportunity.note && (
                                    <p className="mb-6 text-sm text-muted-foreground">
                                        <strong className="text-foreground">
                                            {index === 0 ? "Profils recherchés: " : index === 1 ? "Domaines recherchés: " : ""}
                                        </strong>
                                        {opportunity.note.replace(/^(Profils recherchés:|Domaines recherchés:)\s*/, "")}
                                    </p>
                                )}

                                <div className="mt-auto">
                                    <Button asChild variant="outline" className="w-full bg-transparent">
                                        <Link href={opportunity.ctaLink}>
                                            {opportunity.cta}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Container>
        </section>
    )
}
