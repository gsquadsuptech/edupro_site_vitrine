import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function InvestorsHeroSection() {
    const badges = [
        { label: "Y Combinator Africa", icon: "🏆" },
        { label: "Soutenu par des angels EdTech", icon: "🤝" },
        { label: "Smart Africa Alliance", icon: "🌍" },
        { label: "Partenariat Ministère (Sénégal)", icon: "🏛️" },
    ]

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-chart-2/5 to-accent/5 py-20 md:py-32">
            <Container>
                <div className="mx-auto max-w-4xl">
                    <div className="mb-8 flex flex-wrap gap-2">
                        {badges.map((badge, index) => (
                            <div
                                key={index}
                                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary"
                            >
                                <span>{badge.icon}</span>
                                {badge.label}
                            </div>
                        ))}
                    </div>

                    <h1 className="mb-6 text-balance text-4xl font-bold md:text-5xl lg:text-6xl">
                        40 milliards de FCFA de marché.
                        <br />
                        Zéro acteur dominant.
                        <br />
                        <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                            Nous lançons dans 30 jours.
                        </span>
                    </h1>

                    <p className="mb-8 text-balance text-lg text-muted-foreground md:text-xl">
                        EduPro est la première plateforme qui connecte <strong>entreprises</strong>, <strong>professionnels</strong>
                        ,<strong> formateurs</strong> et <strong>investisseurs</strong> autour de la formation professionnelle en
                        Afrique. Nous ouvrons notre <strong>levée SEED</strong> à des investisseurs visionnaires.
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-primary to-chart-2 text-primary-foreground hover:opacity-90"
                        >
                            Remplir le formulaire investisseur
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button size="lg" variant="outline">
                            Planifier un appel
                        </Button>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-3">
                        <div className="rounded-lg border border-border bg-card/50 p-6">
                            <div className="text-sm font-medium text-muted-foreground">Formateurs Actifs</div>
                            <div className="mt-2 text-3xl font-bold">45+</div>
                            <div className="text-xs text-muted-foreground">Prêts à former</div>
                        </div>
                        <div className="rounded-lg border border-border bg-card/50 p-6">
                            <div className="text-sm font-medium text-muted-foreground">Formations Disponibles</div>
                            <div className="mt-2 text-3xl font-bold">180+</div>
                            <div className="text-xs text-muted-foreground">Prêtes au lancement</div>
                        </div>
                        <div className="rounded-lg border border-border bg-card/50 p-6">
                            <div className="text-sm font-medium text-muted-foreground">Lancement Public</div>
                            <div className="mt-2 text-3xl font-bold">Nov 2025</div>
                            <div className="text-xs text-muted-foreground">30 jours</div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}
