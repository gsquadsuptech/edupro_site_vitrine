import { Container } from "@/components/marketing/layout/container"
import { CheckCircle2 } from "lucide-react"

export function HowItWorksSection() {
    const steps = [
        {
            number: 1,
            title: "CHOISISSEZ & COMMENCEZ",
            items: [
                "Créez votre compte gratuit",
                "Explorez le catalogue",
                "Choisissez votre formation",
                "Paiement flexible (Mobile Money accepté)",
            ],
            timing: "⚡ Inscription en 2 minutes · Sans carte bancaire · Accès immédiat",
        },
        {
            number: 2,
            title: "APPRENEZ À VOTRE RYTHME",
            items: [
                "Contenus interactifs (vidéos, textes, exercices)",
                "Exercices pratiques & projets réels",
                "Quiz auto-corrigés avec feedback immédiat",
                "Mode offline disponible",
            ],
            timing: "📱 Sur mobile, tablette ou ordinateur · En ligne ou hors ligne · 24/7",
        },
        {
            number: 3,
            title: "CERTIFIEZ-VOUS & PROGRESSEZ",
            items: [
                "Certificats sécurisés et vérifiables",
                "Co-certifiés avec des experts",
                "Partagez sur LinkedIn en 1 clic",
                "Accédez à de nouvelles opportunités",
            ],
            timing: "🎓 Certificats co-certifiés · Portfolio en ligne · Reconnaissance marché",
        },
    ]

    const experience = [
        {
            title: "Contenus de Qualité",
            description:
                "Des cours en multiple formats (vidéos HD, textes, audio, infographies) avec sous-titres français/anglais. Formateurs experts qui expliquent clairement. Durée optimale: 10-15 min par module.",
            benefit: "Apprenez selon votre style préféré, à votre rythme, sans vous ennuyer.",
        },
        {
            title: "Exercices Pratiques",
            description:
                "Après chaque module, mettez en pratique avec des exercices concrets et des projets réels. Pas de théorie pure, vous construisez votre portfolio.",
            benefit: "Prouvez vos compétences aux recruteurs avec des réalisations concrètes.",
        },
        {
            title: "Quiz et Évaluations",
            description:
                "Des quiz interactifs après chaque section pour valider vos acquis. Feedback immédiat. Progression visible en temps réel.",
            benefit: "Identifiez vos points forts et axes d'amélioration.",
        },
        {
            title: "Communauté et Support",
            description:
                "Rejoignez des groupes d'apprentissage avec d'autres apprenants. Posez vos questions, partagez vos projets, aidez-vous mutuellement.",
            benefit: "Apprenez plus vite grâce à l'intelligence collective.",
        },
    ]

    return (
        <section className="py-20 md:py-32 bg-muted/30">
            <Container>
                {/* Main Timeline */}
                <div className="mb-20">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                            De l'inscription à votre certificat en 3 étapes
                        </h2>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {steps.map((step, index) => (
                            <div key={index} className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
                                        {step.number}
                                    </div>
                                    <h3 className="font-bold text-lg">{step.title}</h3>
                                </div>

                                <ul className="space-y-2">
                                    {step.items.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm">
                                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>

                                <p className="text-xs text-muted-foreground italic bg-muted/50 p-2 rounded">{step.timing}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Experience Cards */}
                <div>
                    <div className="mb-12 text-center">
                        <h3 className="text-2xl md:text-3xl font-bold mb-2">Ce que vous vivrez concrètement avec EduPro</h3>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {experience.map((exp, index) => (
                            <div key={index} className="rounded-xl border border-border bg-card p-6">
                                <h4 className="mb-2 font-bold text-lg">{exp.title}</h4>
                                <p className="mb-4 text-sm text-muted-foreground">{exp.description}</p>
                                <div className="border-t border-border pt-3">
                                    <p className="text-sm font-medium text-primary italic">→ {exp.benefit}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    )
}
