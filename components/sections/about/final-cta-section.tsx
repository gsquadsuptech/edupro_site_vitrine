import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function FinalCTASection() {
    return (
        <section className="bg-gradient-to-br from-primary via-chart-2 to-primary py-20 text-primary-foreground md:py-32">
            <Container>
                <div className="mx-auto max-w-4xl text-center">
                    <div className="mb-6 text-5xl">🌟</div>
                    <h2 className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">Prêt·e à transformer l'Afrique?</h2>
                    <p className="mb-12 text-lg leading-relaxed opacity-90 md:text-xl">
                        Que vous soyez entreprise, formateur, talent ou investisseur, il y a une place pour vous dans l'aventure
                        EduPro.
                    </p>

                    <div className="mb-12 flex flex-wrap justify-center gap-4">
                        <Button asChild size="lg" variant="secondary">
                            <Link href="/entreprises">Découvrir nos solutions</Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="border-white bg-transparent text-white hover:bg-white hover:text-primary"
                        >
                            <Link href="#contact">Rejoindre l'équipe</Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="border-white bg-transparent text-white hover:bg-white hover:text-primary"
                        >
                            <Link href="/formateurs">Devenir formateur</Link>
                        </Button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 text-sm opacity-90">
                        <div className="flex items-center gap-2">
                            <span>✓</span>
                            <span>Réponse sous 24h</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>✓</span>
                            <span>Support en FR/EN</span>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}
