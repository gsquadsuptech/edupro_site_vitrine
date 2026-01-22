import { Container } from "@/components/marketing/layout/container"
import { CreditCard, Banknote, Smartphone } from "lucide-react"

export function PaymentSection() {
    return (
        <section className="bg-muted/30 py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                        Modalités de paiement flexibles
                    </h2>
                    <p className="text-lg text-muted-foreground">Nous nous adaptons à vos contraintes</p>
                </div>

                <div className="mb-12 grid gap-8 md:grid-cols-2">
                    <div className="rounded-xl border-2 border-border bg-card p-8">
                        <h3 className="mb-4 text-xl font-bold">Modes de paiement</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <CreditCard className="h-6 w-6 flex-shrink-0 text-primary" />
                                <div>
                                    <p className="font-semibold">Carte bancaire</p>
                                    <p className="text-sm text-muted-foreground">Visa, Mastercard</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Banknote className="h-6 w-6 flex-shrink-0 text-primary" />
                                <div>
                                    <p className="font-semibold">Virement bancaire</p>
                                    <p className="text-sm text-muted-foreground">Comptes locaux disponibles</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Smartphone className="h-6 w-6 flex-shrink-0 text-primary" />
                                <div>
                                    <p className="font-semibold">Mobile Money</p>
                                    <p className="text-sm text-muted-foreground">Orange Money, Wave, MTN Money</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border-2 border-primary bg-primary/5 p-8">
                        <h3 className="mb-4 text-xl font-bold">Fréquences de facturation</h3>
                        <div className="space-y-6">
                            <div>
                                <h4 className="mb-2 font-semibold">💳 Paiement mensuel</h4>
                                <p className="mb-2 text-sm text-muted-foreground">Facturation automatique chaque mois</p>
                                <p className="text-xs text-muted-foreground">Flexibilité et sérénité. Idéal pour commencer.</p>
                            </div>
                            <div>
                                <h4 className="mb-2 font-semibold">🏦 Paiement trimestriel/annuel</h4>
                                <p className="mb-2 text-sm text-muted-foreground">Remises attractives sur engagement long terme</p>
                                <p className="text-xs text-muted-foreground">Meilleure visibilité budgétaire. Économies garanties.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-8 text-center">
                    <p className="text-muted-foreground">
                        Secteur public, ONG? Nous acceptons également les mandats administratifs. Contactez-nous pour les modalités
                        spécifiques.
                    </p>
                </div>
            </Container>
        </section>
    )
}
