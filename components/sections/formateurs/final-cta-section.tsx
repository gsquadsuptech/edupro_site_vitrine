import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function FormateursFinalCTASection() {
    return (
        <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-chart-2/10">
            <Container>
                <div className="text-center">
                    <h2 className="mb-6 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                        Prêt à transformer votre expertise en impact?
                    </h2>
                    <p className="mb-8 text-lg text-muted-foreground">Rejoignez les 150+ formateurs qui changent l'Afrique</p>

                    <p className="mb-12 max-w-2xl mx-auto text-lg">
                        Des milliers d'apprenants à travers <strong>le Sénégal, la Côte d'Ivoire et le Rwanda</strong> recherchent
                        activement votre expertise. Ne laissez pas votre savoir-faire limité par les frontières du présentiel.
                    </p>

                    <div className="mb-8 flex flex-col gap-4 sm:flex-row justify-center">
                        <Button size="lg" className="group bg-gradient-to-r from-primary to-chart-2">
                            Je deviens formateur partenaire
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                        <Button size="lg" variant="outline">
                            Je découvre la solution instituts
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>

                    <div className="rounded-lg bg-muted/50 border border-border p-4 max-w-md mx-auto">
                        <p className="text-sm text-muted-foreground">
                            ✓ Inscription en 5 minutes · Validation sous 48h · Support dédié en français
                        </p>
                    </div>
                </div>
            </Container>
        </section>
    )
}
