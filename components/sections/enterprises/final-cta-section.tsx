import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, TrendingUp, Users } from "lucide-react"

export function FinalCTASection() {
    return (
        <section className="bg-gradient-to-br from-primary/5 to-chart-2/5 py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-6 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                        Rejoignez les 25+ entreprises qui transforment déjà leurs équipes
                    </h2>
                    <p className="text-lg text-muted-foreground">Votre académie digitale en 48h. Prêt?</p>
                </div>

                <div className="mb-12 grid gap-8 md:grid-cols-2">
                    <div className="rounded-xl border-2 border-primary bg-card p-8 text-center">
                        <h3 className="mb-6 text-xl font-bold">Réserver ma démo personnalisée</h3>
                        <ul className="mb-8 space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-center justify-center gap-2">
                                <span className="text-primary">✓</span>
                                Appel de 30-45 min avec un expert
                            </li>
                            <li className="flex items-center justify-center gap-2">
                                <span className="text-primary">✓</span>
                                Présentation adaptée à votre secteur
                            </li>
                            <li className="flex items-center justify-center gap-2">
                                <span className="text-primary">✓</span>
                                Estimation budgétaire indicative
                            </li>
                            <li className="flex items-center justify-center gap-2">
                                <span className="text-primary">✓</span>
                                Proposition commerciale sous 48h
                            </li>
                        </ul>
                        <Button size="lg" className="w-full bg-gradient-to-r from-primary to-chart-2 text-primary-foreground">
                            Réserver maintenant
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                    <div className="rounded-xl border-2 border-border bg-card p-8 text-center">
                        <h3 className="mb-6 text-xl font-bold">Demander un devis</h3>
                        <p className="mb-8 text-sm text-muted-foreground">
                            Décrivez-nous votre projet en quelques lignes et recevez une première estimation sous 48h
                        </p>
                        <Button size="lg" variant="outline" className="w-full bg-transparent">
                            Formulaire devis
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="mb-12 grid gap-6 md:grid-cols-3">
                    <div className="rounded-lg bg-muted/50 p-6 text-center">
                        <Zap className="mx-auto mb-3 h-8 w-8 text-primary" />
                        <h4 className="mb-2 font-semibold">Déploiement Express</h4>
                        <p className="text-sm text-muted-foreground">Opérationnel en 48h, pas de projet IT complexe</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-6 text-center">
                        <TrendingUp className="mx-auto mb-3 h-8 w-8 text-accent" />
                        <h4 className="mb-2 font-semibold">ROI Garanti</h4>
                        <p className="text-sm text-muted-foreground">180-250% sur 12 mois ou on reprend la discussion</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-6 text-center">
                        <Users className="mx-auto mb-3 h-8 w-8 text-chart-2" />
                        <h4 className="mb-2 font-semibold">Support Dédié</h4>
                        <p className="text-sm text-muted-foreground">Experts africains qui comprennent vos enjeux</p>
                    </div>
                </div>

                <div className="rounded-xl border-2 border-accent bg-accent/10 p-8 text-center">
                    <h3 className="mb-4 text-xl font-bold">Offre de lancement</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Les 10 prochaines entreprises qui signent avant fin du mois bénéficient de:
                    </p>
                    <ul className="mb-6 space-y-2 text-sm">
                        <li className="flex items-center justify-center gap-2">
                            <span className="text-accent">✓</span>
                            Setup offert (valeur 500K FCFA)
                        </li>
                        <li className="flex items-center justify-center gap-2">
                            <span className="text-accent">✓</span>
                            1er mois -50%
                        </li>
                        <li className="flex items-center justify-center gap-2">
                            <span className="text-accent">✓</span>
                            20h de consulting learning offert
                        </li>
                        <li className="flex items-center justify-center gap-2">
                            <span className="text-accent">✓</span>
                            Création d'1 parcours sur-mesure offert
                        </li>
                    </ul>
                    <p className="font-semibold text-primary">Plus que 6 places disponibles</p>
                </div>
            </Container>
        </section>
    )
}
