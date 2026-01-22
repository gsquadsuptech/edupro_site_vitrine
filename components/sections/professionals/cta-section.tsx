import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageCircle } from "lucide-react"

export function ProfessionalsCTASection() {
    return (
        <section className="py-20 md:py-32 bg-gradient-to-b from-primary/5 to-chart-2/5">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                        Votre prochaine opportunité commence ici
                    </h2>
                    <p className="text-lg text-muted-foreground">Prêt à transformer votre carrière?</p>
                </div>

                {/* CTA Options */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12 max-w-5xl mx-auto">
                    <div className="rounded-xl border border-border bg-card p-6 text-center hover:shadow-lg transition-shadow">
                        <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                            <span className="text-2xl">🎓</span>
                        </div>
                        <h3 className="mb-2 font-bold">Vous démarrez</h3>
                        <p className="text-sm text-muted-foreground mb-4">Explorez nos Skill Packs et formations</p>
                        <Button asChild variant="outline" className="w-full gap-2 bg-transparent">
                            <a href="#skill-packs">
                                Découvrir
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </Button>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 text-center hover:shadow-lg transition-shadow">
                        <div className="mb-4 inline-flex rounded-lg bg-chart-2/10 p-3">
                            <span className="text-2xl">💼</span>
                        </div>
                        <h3 className="mb-2 font-bold">Vous progressez</h3>
                        <p className="text-sm text-muted-foreground mb-4">Achat à la carte · Mobile Money accepté</p>
                        <Button asChild variant="outline" className="w-full gap-2 bg-transparent">
                            <a href="#skill-packs">
                                Voir formations
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </Button>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 text-center hover:shadow-lg transition-shadow">
                        <div className="mb-4 inline-flex rounded-lg bg-accent/10 p-3">
                            <span className="text-2xl">🚀</span>
                        </div>
                        <h3 className="mb-2 font-bold">Vous visez l'excellence</h3>
                        <p className="text-sm text-muted-foreground mb-4">Formations complètes · Certifications</p>
                        <Button asChild variant="outline" className="w-full gap-2 bg-transparent">
                            <a href="#skill-packs">
                                Explorer
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </Button>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 text-center hover:shadow-lg transition-shadow">
                        <div className="mb-4 inline-flex rounded-lg bg-chart-4/10 p-3">
                            <span className="text-2xl">🎯</span>
                        </div>
                        <h3 className="mb-2 font-bold">Vous avez questions</h3>
                        <p className="text-sm text-muted-foreground mb-4">Chat, email, téléphone · Réponse rapide</p>
                        <Button asChild variant="outline" className="w-full gap-2 bg-transparent">
                            <a href="mailto:support@edupro.com">
                                Contacter
                                <MessageCircle className="h-4 w-4" />
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Launch Offer */}
                <div className="max-w-2xl mx-auto mb-12 rounded-2xl border-2 border-primary/50 bg-gradient-to-r from-primary/10 to-chart-2/10 p-8 text-center">
                    <div className="mb-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wide">
                            Offre de lancement
                        </span>
                    </div>
                    <h3 className="mb-4 text-2xl font-bold">Les premiers inscrits ce mois bénéficient de:</h3>
                    <ul className="space-y-2 mb-6 text-sm">
                        <li className="flex items-center justify-center gap-2">
                            <span className="text-primary">✓</span>
                            Accès aux webinaires exclusifs
                        </li>
                        <li className="flex items-center justify-center gap-2">
                            <span className="text-primary">✓</span>
                            Badge "Early Adopter" sur votre profil
                        </li>
                        <li className="flex items-center justify-center gap-2">
                            <span className="text-primary">✓</span>
                            Support prioritaire pendant 30 jours
                        </li>
                    </ul>
                    <p className="text-sm font-semibold text-primary mb-6">Offre limitée - Ne manquez pas cette chance</p>
                    <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white gap-2">
                        <a href="#signup">
                            Créer mon compte maintenant
                            <ArrowRight className="h-5 w-5" />
                        </a>
                    </Button>
                </div>

                {/* Final Reassurance */}
                <div className="grid gap-6 md:grid-cols-3 max-w-3xl mx-auto">
                    <div className="text-center">
                        <div className="mb-2 text-3xl">✅</div>
                        <h4 className="mb-2 font-bold">Garantie Qualité</h4>
                        <p className="text-sm text-muted-foreground">
                            Contenus créés par des experts africains certifiés. Mis à jour régulièrement.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="mb-2 text-3xl">✅</div>
                        <h4 className="mb-2 font-bold">Support Réactif</h4>
                        <p className="text-sm text-muted-foreground">
                            Assistance en français et anglais. Communauté active. Vous n'êtes jamais seul.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="mb-2 text-3xl">✅</div>
                        <h4 className="mb-2 font-bold">Sans Risque</h4>
                        <p className="text-sm text-muted-foreground">
                            Informations détaillées sur chaque formation. Paiement sécurisé. Support inclus.
                        </p>
                    </div>
                </div>
            </Container>
        </section>
    )
}
