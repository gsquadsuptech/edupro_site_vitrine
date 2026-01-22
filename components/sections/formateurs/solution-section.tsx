import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function FormateursSolutionSection() {
    return (
        <section className="py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                        EduPro : Votre partenaire pour digitaliser et rayonner
                    </h2>
                    <p className="text-lg text-muted-foreground">Créez une fois, impactez des milliers</p>
                </div>

                <div className="mb-12 rounded-xl border border-border bg-card/50 p-8 text-center">
                    <p className="text-lg leading-relaxed">
                        EduPro est <strong>bien plus qu'une plateforme</strong> : c'est votre partenaire technologique pour
                        digitaliser votre expertise, toucher une audience panafricaine, et vous concentrer sur ce que vous faites de
                        mieux : transmettre votre savoir-faire. Que vous soyez formateur indépendant ou institut de formation, nous
                        avons la solution adaptée à vos ambitions.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* Formateurs Indépendants */}
                    <div className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-chart-2/5 p-8">
                        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                            <span className="text-xl">🎓</span>
                        </div>
                        <h3 className="mb-2 text-xl font-bold">FORMATEURS INDÉPENDANTS</h3>
                        <p className="mb-6 text-sm text-muted-foreground">
                            Partagez votre expertise avec une audience panafricaine
                        </p>

                        <ul className="mb-8 space-y-3">
                            {[
                                "Outils IA pour créer vos cours",
                                "Zéro frais de démarrage",
                                "Commissions jusqu'à 70%",
                                "Support technique complet",
                                "Communauté d'experts",
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                    <span className="mt-0.5 text-primary font-bold">✓</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mb-6 rounded-lg bg-muted/50 p-3 text-center">
                            <p className="text-xs font-semibold uppercase text-muted-foreground">Exemples d'expertise:</p>
                            <p className="text-sm font-medium">Management • Tech • Soft Skills • Métiers</p>
                        </div>

                        <Button className="w-full bg-primary hover:bg-primary/90">
                            Devenir formateur
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                    {/* Instituts de Formation */}
                    <div className="rounded-2xl border-2 border-chart-2/30 bg-gradient-to-br from-chart-2/5 to-accent/5 p-8">
                        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/20">
                            <span className="text-xl">🏢</span>
                        </div>
                        <h3 className="mb-2 text-xl font-bold">INSTITUTS DE FORMATION</h3>
                        <p className="mb-6 text-sm text-muted-foreground">Votre académie digitale en marque blanche en 48h</p>

                        <ul className="mb-8 space-y-3">
                            {[
                                "Plateforme personnalisée à vos couleurs",
                                "Votre nom de domaine",
                                "Gestion complète des apprenants",
                                "Analytics et reporting avancés",
                                "Migration de vos contenus existants",
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                    <span className="mt-0.5 text-chart-2 font-bold">✓</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mb-6 rounded-lg bg-muted/50 p-3 text-center">
                            <p className="text-xs font-semibold uppercase text-muted-foreground">Idéal pour:</p>
                            <p className="text-sm font-medium">Cabinets de formation • Universités • Centres</p>
                        </div>

                        <Button variant="outline" className="w-full bg-transparent">
                            Demander une démo institut
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Container>
        </section>
    )
}
