import { Container } from "@/components/marketing/layout/container"

export function SeedRoundSection() {
    const fundUses = [
        {
            percentage: "40%",
            title: "Acquisition & Marketing",
            items: [
                "Campagnes digitales multi-pays",
                "Content marketing et SEO",
                "Partenariats stratégiques",
                "Community management",
            ],
        },
        {
            percentage: "30%",
            title: "Produit & Technologie",
            items: [
                "Amélioration mobile app",
                "Fonctionnalités avancées (live classes, mentorat)",
                "Infrastructure scalable",
                "Recrutement +3 développeurs",
            ],
        },
        {
            percentage: "20%",
            title: "Opérations & Talent",
            items: [
                "Recrutement équipe clé (CMO, Head of Sales B2B)",
                "Support client multilingue",
                "Outils et logiciels",
                "Bureaux (Dakar + Abidjan)",
            ],
        },
        {
            percentage: "10%",
            title: "Expansion Géographique",
            items: ["Préparation lancement Côte d'Ivoire & Rwanda", "Localisation contenus", "Partenariats locaux"],
        },
    ]

    return (
        <section className="py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">La Levée SEED</h2>
                    <p className="text-lg text-muted-foreground">Nous cherchons nos premiers investisseurs</p>
                </div>

                <div className="mb-12 rounded-xl border border-border bg-card p-8 md:p-12">
                    <div className="text-center">
                        <h3 className="mb-4 text-2xl font-bold">Structure de la Levée</h3>
                        <div className="mb-4 text-lg text-muted-foreground">
                            <div>Montant recherché: À définir avec les investisseurs</div>
                            <div className="mt-2 font-semibold text-foreground">(selon besoins validés post-lancement)</div>
                        </div>
                        <div className="mt-6 flex flex-col gap-2 text-sm">
                            <div>
                                <span className="font-semibold">Stage:</span> Pre-revenue / Early traction
                            </div>
                            <div>
                                <span className="font-semibold">Closing prévu:</span> Q4 2025 - Q1 2026
                            </div>
                        </div>
                    </div>
                </div>

                <h3 className="mb-8 text-center text-2xl font-bold">Utilisation Prévue des Fonds</h3>
                <div className="grid gap-6 md:grid-cols-2">
                    {fundUses.map((use, index) => (
                        <div key={index} className="rounded-lg border border-border bg-card p-6">
                            <div className="mb-4">
                                <div className="mb-1 text-3xl font-bold text-primary">{use.percentage}</div>
                                <div className="font-bold text-foreground">{use.title}</div>
                            </div>
                            <ul className="space-y-2">
                                {use.items.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    )
}
