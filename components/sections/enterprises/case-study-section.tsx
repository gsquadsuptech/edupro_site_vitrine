import { Container } from "@/components/marketing/layout/container"

export function CaseStudySection() {
    return (
        <section className="py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                        Cas d'usage : BPO/Centres d'appels
                    </h2>
                    <p className="text-lg text-muted-foreground">Le secteur où l'impact d'EduPro est le plus immédiat</p>
                </div>

                <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                    <div>
                        <h3 className="mb-6 text-2xl font-bold">Le défi : Turnover massif, coûts de formation énormes</h3>

                        <div className="space-y-6">
                            <div>
                                <h4 className="mb-2 font-semibold text-primary">Avant EduPro</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• 80% de turnover annuel (recrutement constant)</li>
                                    <li>• 3-4 mois d'onboarding en présentiel coûteux</li>
                                    <li>• Formateurs dédiés à temps plein (coût élevé)</li>
                                    <li>• Qualité inégale selon le formateur</li>
                                    <li>• Zéro mesure de ROI sur les formations</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="mb-2 font-semibold text-primary">Après EduPro</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>✓ Onboarding digitalisé : 4 à 6 semaines au lieu de 3-4 mois</li>
                                    <li>✓ -50% de coûts formation (pas de présentiel)</li>
                                    <li>✓ Qualité standardisée (tous les nouveaux reçoivent le même contenu)</li>
                                    <li>✓ Les meilleurs agents deviennent formateurs (gamification)</li>
                                    <li>✓ Dashboard pour montrer l'impact au management</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="relative rounded-xl overflow-hidden">
                        <img
                            src="/bpo-call-center-team-working-with-dashboard-analyt.jpg"
                            alt="Centre d'appels BPO avec analytics"
                            className="h-full w-full object-cover rounded-xl"
                        />
                    </div>
                </div>

                <div className="mt-12 grid gap-6 rounded-xl border border-border bg-muted/30 p-8 md:grid-cols-3">
                    <div>
                        <div className="mb-2 text-3xl font-bold text-primary">-60%</div>
                        <p className="text-sm text-muted-foreground">Coûts de formation vs présentiel</p>
                    </div>
                    <div>
                        <div className="mb-2 text-3xl font-bold text-primary">6 semaines</div>
                        <p className="text-sm text-muted-foreground">Time-to-productivity au lieu de 3-4 mois</p>
                    </div>
                    <div>
                        <div className="mb-2 text-3xl font-bold text-primary">300%+</div>
                        <p className="text-sm text-muted-foreground">ROI annuel pour nos clients BPO</p>
                    </div>
                </div>
            </Container>
        </section>
    )
}
