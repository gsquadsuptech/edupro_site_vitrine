import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"
import Image from "next/image"

export function EnterprisesHeroSection() {
    return (
        <section className="relative py-20 md:py-32">
            <Container>
                <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                    <div>
                        <h1 className="mb-6 text-balance text-4xl font-bold md:text-5xl lg:text-6xl">
                            Transformez votre capital humain en avantage compétitif
                        </h1>
                        <p className="mb-8 text-balance text-lg text-muted-foreground md:text-xl">
                            EduPro accompagne les <strong>entreprises africaines</strong> dans leur transformation par la formation :
                            onboarding accéléré, upskilling continu, et mesure d'impact en temps réel.{" "}
                            <strong>Plus de 25 entreprises</strong> nous font déjà confiance au Sénégal, en Côte d'Ivoire et au
                            Rwanda.
                        </p>

                        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-primary to-chart-2 text-primary-foreground hover:opacity-90"
                            >
                                Réserver une démo personnalisée
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button size="lg" variant="outline">
                                Demander un devis
                            </Button>
                        </div>

                        <div className="mb-8 flex flex-col gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                Démo gratuite 30 min
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                Proposition commerciale sous 24h
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                Déploiement en 48h
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <div className="rounded-lg bg-muted/50 p-4 text-center">
                                <div className="text-2xl font-bold text-primary">-50%</div>
                                <div className="text-xs text-muted-foreground">Time-to-productivity</div>
                            </div>
                            <div className="rounded-lg bg-muted/50 p-4 text-center">
                                <div className="text-2xl font-bold text-primary">48h</div>
                                <div className="text-xs text-muted-foreground">Déploiement moyen</div>
                            </div>
                            <div className="rounded-lg bg-muted/50 p-4 text-center">
                                <div className="text-2xl font-bold text-primary">100%</div>
                                <div className="text-xs text-muted-foreground">ROI visible en temps réel</div>
                            </div>
                            <div className="rounded-lg bg-muted/50 p-4 text-center">
                                <div className="text-2xl font-bold text-primary">-60%</div>
                                <div className="text-xs text-muted-foreground">vs coûts présentiel</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative aspect-square overflow-hidden rounded-2xl">
                            <Image
                                src="/african-team-in-modern-office-using-dashboard-anal.jpg"
                                alt="Équipe africaine en formation"
                                width={500}
                                height={500}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}
