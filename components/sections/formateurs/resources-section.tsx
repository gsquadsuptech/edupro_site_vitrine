import { Container } from "@/components/marketing/layout/container"
import { BookOpen, Users, Headphones, Share2 } from "lucide-react"

export function FormateursResourcesSection() {
    const resources = [
        {
            icon: BookOpen,
            title: "Centre de Formation",
            items: [
                "Bootcamp formateurs (6 modules)",
                "Tutoriels vidéo (50+)",
                "Guides PDF téléchargeables",
                "Best practices pédagogiques",
                "Webinaires périodiques",
            ],
        },
        {
            icon: Users,
            title: "Communauté",
            items: [
                "Groupes WhatsApp par pays",
                "Événements networking",
                "Partage d'expériences",
                "Co-création de contenus",
                "Mentorat entre pairs",
            ],
        },
        {
            icon: Headphones,
            title: "Support Technique",
            items: [
                "Chat en direct (9h-18h)",
                "Email support (24h)",
                "Vidéos de dépannage",
                "Account manager (Premium)",
                "Base de connaissances",
            ],
        },
        {
            icon: Share2,
            title: "Outils Marketing",
            items: [
                "Templates de promotion",
                "Visuels de communication",
                "Landing pages personnalisées",
                "Codes promo illimités",
                "Guides marketing",
            ],
        },
    ]

    return (
        <section className="py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                        On vous accompagne à chaque étape
                    </h2>
                    <p className="text-lg text-muted-foreground">Vous n'êtes jamais seul avec EduPro</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {resources.map((resource, index) => {
                        const Icon = resource.icon
                        return (
                            <div key={index} className="rounded-xl border border-border bg-card p-6">
                                <Icon className="mb-4 h-8 w-8 text-primary" />
                                <h3 className="mb-4 font-bold">{resource.title}</h3>
                                <ul className="space-y-2">
                                    {resource.items.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <span className="text-primary">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    })}
                </div>
            </Container>
        </section>
    )
}
