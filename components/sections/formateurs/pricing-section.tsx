import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export function FormateursPricingSection() {
    return (
        <section className="py-20 md:py-32 bg-muted/30">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                        Des revenus attractifs et transparents
                    </h2>
                    <p className="text-lg text-muted-foreground">Monétisez votre expertise à votre juste valeur</p>
                </div>

                <div className="grid gap-8 md:grid-cols-3 mb-12">
                    {/* Gratuit */}
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <h3 className="mb-2 text-2xl font-bold">GRATUIT</h3>
                        <p className="mb-4 text-sm text-muted-foreground">Parfait pour démarrer</p>
                        <div className="mb-6 border-t border-border pt-6">
                            <p className="text-3xl font-bold">0 FCFA</p>
                            <p className="text-xs text-muted-foreground">/mois</p>
                        </div>
                        <ul className="mb-8 space-y-3">
                            {[
                                "1 formation publiée",
                                "Outils IA de base",
                                "50% de commission",
                                "Support communautaire",
                                "Analytics basiques",
                                "Max 100 apprenants/formation",
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <Button variant="outline" className="w-full bg-transparent">
                            Commencer gratuitement
                        </Button>
                    </div>

                    {/* Standard */}
                    <div className="rounded-2xl border-2 border-primary bg-gradient-to-br from-primary/10 to-chart-2/10 p-8 relative">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                            ⭐ LE PLUS POPULAIRE
                        </div>
                        <h3 className="mb-2 text-2xl font-bold">STANDARD</h3>
                        <p className="mb-4 text-sm text-muted-foreground">Libérez votre potentiel</p>
                        <div className="mb-6 border-t border-border pt-6">
                            <p className="text-3xl font-bold">15 000 FCFA</p>
                            <p className="text-xs text-muted-foreground">/mois</p>
                        </div>
                        <ul className="mb-8 space-y-3">
                            {[
                                "Formations illimitées",
                                "65% de commission",
                                "Outils IA avancés",
                                "Support prioritaire (24h)",
                                "Analytics avancées",
                                "Apprenants illimités",
                                "Sessions live intégrées",
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <Button className="w-full bg-primary hover:bg-primary/90">Passer à Standard</Button>
                    </div>

                    {/* Premium */}
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <h3 className="mb-2 text-2xl font-bold">PREMIUM</h3>
                        <p className="mb-4 text-sm text-muted-foreground">Pour les experts reconnus</p>
                        <div className="mb-6 border-t border-border pt-6">
                            <p className="text-3xl font-bold">30 000 FCFA</p>
                            <p className="text-xs text-muted-foreground">/mois</p>
                        </div>
                        <ul className="mb-8 space-y-3">
                            {[
                                "70% de commission",
                                "Account manager dédié",
                                "Promotion prioritaire",
                                "White-label partiel",
                                "Intégrations avancées",
                                "Support VIP (2h)",
                                "Formations sponsorisées",
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <Button variant="outline" className="w-full bg-transparent">
                            Devenir Premium
                        </Button>
                    </div>
                </div>

                {/* Instituts Solution */}
                <div className="rounded-2xl border border-border bg-card p-8 text-center">
                    <h3 className="mb-2 text-2xl font-bold">MARQUE BLANCHE COMPLÈTE</h3>
                    <p className="mb-4 text-muted-foreground">Votre académie digitale personnalisée</p>
                    <p className="mb-6 text-3xl font-bold">
                        À partir de <span className="text-primary">500 000 FCFA</span>/mois
                    </p>
                    <p className="mb-4 text-sm text-muted-foreground">Mise en place: 48-72h après validation</p>
                    <Button>Demander un devis personnalisé</Button>
                </div>

                <div className="mt-8 rounded-lg bg-primary/5 border border-primary/20 p-4 text-center text-sm text-muted-foreground">
                    <p>
                        Pas de frais cachés · Commissions versées en moins de 30 jours · Paiements sécurisés · Factures automatiques
                    </p>
                </div>
            </Container>
        </section>
    )
}
