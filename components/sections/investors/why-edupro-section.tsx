import { Container } from "@/components/marketing/layout/container"
import Image from "next/image"

export function WhyEduProSection() {
    const problems = [
        {
            title: "Pour les Entreprises",
            icon: "🏢",
            points: [
                "Turnover catastrophique (35-50% dans les BPO)",
                "Onboarding manuel, long et coûteux",
                "Aucun moyen de mesurer le ROI formation",
                "Solutions internationales inadaptées et hors de prix",
            ],
        },
        {
            title: "Pour les Professionnels",
            icon: "🎓",
            points: [
                "Formations internationales inaccessibles (500-2000 USD)",
                "Contenus déconnectés des réalités africaines",
                "Aucune flexibilité (horaires, mobile, paiement)",
                "Diplômes non reconnus localement",
            ],
        },
        {
            title: "Pour les Formateurs",
            icon: "👨‍🏫",
            points: [
                "Dépendance au présentiel = revenus instables",
                "Pas d'outils pour digitaliser leur expertise",
                "Visibilité limitée à leur zone géographique",
                "Impossible de scaler leur impact",
            ],
        },
    ]

    const differentiators = [
        {
            icon: "🤖",
            title: "IA au Service de l'Afrique",
            description:
                "Assistant IA pour créer formations 40% plus vite, contextualisation automatique et génération de contenus adaptatifs selon le niveau de l'apprenant",
        },
        {
            icon: "📱",
            title: "Mobile-First & Offline-Ready",
            description:
                "78% du trafic africain est mobile → design mobile-native, mode hors-ligne pour contenus essentiels, optimisé pour faible bande passante",
        },
        {
            icon: "🌍",
            title: "Panafricain dès le MVP",
            description:
                "3 pays de lancement, multilingue (Français + Anglais), paiement mobile intégré (Orange Money, Wave, M-Pesa)",
        },
        {
            icon: "👥",
            title: "Équipe Qui Exécute",
            description:
                "Fondateurs avec track record, connaissance intime du terrain africain, expertise complémentaire en technologie, éducation et entrepreneuriat",
        },
    ]

    return (
        <section className="bg-muted/30 py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                        Nous résolvons un problème que personne d'autre n'adresse
                    </h2>
                    <p className="text-lg text-muted-foreground">Le problème existe à 3 niveaux</p>
                </div>

                <div className="mb-16 grid gap-8 md:grid-cols-3">
                    {problems.map((problem, index) => (
                        <div key={index} className="rounded-lg border border-border bg-card p-6">
                            <div className="mb-3 text-3xl">{problem.icon}</div>
                            <h3 className="mb-4 font-bold text-foreground">{problem.title}</h3>
                            <ul className="space-y-2">
                                {problem.points.map((point, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>


                <div className="mb-16">
                  <h3 className="mb-8 text-center text-2xl font-bold">Notre Solution: Le Marketplace à 4 Faces</h3>
                  <div className="flex justify-center mb-8">
                    <Image
                      src="/marketplace-architecture-diagram.jpg"
                      alt="EduPro Marketplace Architecture"
                      width={600}
                      height={300}
                      className="rounded-lg border border-border"
                    />
                  </div>
                  <p className="text-center text-lg font-semibold text-primary">
                    Nous sommes les seuls à connecter tout l'écosystème.
                  </p>
                </div>
                        
                <div className="mb-12">
                  <h3 className="mb-8 text-center text-2xl font-bold">4 Piliers de Différenciation</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    {differentiators.map((diff, index) => (
                      <div key={index} className="rounded-lg border border-primary/20 bg-primary/5 p-6">
                        <div className="mb-3 text-3xl">{diff.icon}</div>
                        <h4 className="mb-2 font-bold text-foreground">{diff.title}</h4>
                        <p className="text-sm text-muted-foreground">{diff.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
            </Container>
        </section>
    )
}
