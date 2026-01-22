import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function InvestorCTASection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary to-chart-2 py-20 md:py-32">
            <Container>
                <div className="mx-auto max-w-3xl text-center text-white">
                    <h2 className="mb-6 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                        Les meilleures opportunités se prennent tôt
                    </h2>

                    <p className="mb-8 text-lg text-white/90">
                        Dans 6 mois, nous aurons des chiffres. Aujourd'hui, vous avez l'opportunité d'entrer aux meilleures
                        conditions, avec une équipe qui exécute et un marché massif devant nous.
                    </p>

                    <p className="mb-12 text-lg font-semibold text-white/95">
                        Les investisseurs qui construisent l'Afrique de demain investissent aujourd'hui.
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Button size="lg" variant="secondary" className="text-base">
                            Remplir le formulaire
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                            Planifier un appel
                        </Button>
                    </div>

                    <div className="mt-12 grid gap-4 text-left md:grid-cols-3">
                        <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                            <div className="font-semibold">Questions urgentes?</div>
                            <div className="text-sm text-white/80">contact@edupro.africa</div>
                        </div>
                        <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                            <div className="font-semibold">Téléphone</div>
                            <div className="text-sm text-white/80">+221 77 XXX XX XX</div>
                        </div>
                        <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                            <div className="font-semibold">Suivez-nous</div>
                            <div className="text-sm text-white/80">LinkedIn, Twitter, Instagram</div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}
