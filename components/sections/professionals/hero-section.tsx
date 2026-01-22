import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export function ProfessionalsHeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 pt-20 md:pt-32">
            <Container>
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
                    {/* Content */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-balance text-4xl font-bold md:text-5xl lg:text-6xl leading-tight">
                                Transformez vos ambitions en succès concrets
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Formations certifiantes <span className="font-semibold text-foreground">100% en ligne</span>,
                                accessibles <span className="font-semibold text-foreground">24/7 depuis votre mobile</span>, et pensées
                                pour les <span className="font-semibold text-foreground">réalités africaines</span>. Rejoignez les{" "}
                                <span className="font-semibold text-foreground">500+ professionnels</span> qui montent en compétences
                                avec EduPro au Sénégal, en Côte d'Ivoire et au Rwanda.
                            </p>
                        </div>

                        {/* CTAs and Selectors */}
                        <div className="space-y-4">
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white">
                                    <a href="#signup">
                                        Créer mon compte gratuit
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </a>
                                </Button>
                                <Button asChild variant="outline" size="lg">
                                    <a href="#skill-packs">
                                        Explorer le catalogue
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </a>
                                </Button>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">Je veux apprendre:</span>
                                <div className="flex gap-2 flex-wrap">
                                    <button className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition">
                                        Tech
                                    </button>
                                    <button className="px-3 py-1.5 rounded-full bg-chart-2/10 text-chart-2 font-medium hover:bg-chart-2/20 transition">
                                        Business
                                    </button>
                                    <button className="px-3 py-1.5 rounded-full bg-accent/10 text-accent font-medium hover:bg-accent/20 transition">
                                        Construction
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 pt-4">
                            <div className="space-y-1">
                                <div className="text-2xl md:text-3xl font-bold text-primary">500+</div>
                                <p className="text-sm text-muted-foreground">Apprenants actifs</p>
                            </div>
                            <div className="space-y-1">
                                <div className="text-2xl md:text-3xl font-bold text-chart-2">92%</div>
                                <p className="text-sm text-muted-foreground">Taux de complétion</p>
                            </div>
                            <div className="space-y-1">
                                <div className="text-2xl md:text-3xl font-bold text-chart-4">24/7</div>
                                <p className="text-sm text-muted-foreground">Accessible</p>
                            </div>
                            <div className="space-y-1">
                                <div className="text-2xl md:text-3xl font-bold text-chart-5">100%</div>
                                <p className="text-sm text-muted-foreground">Mobile optimisé</p>
                            </div>
                        </div>
                    </div>

                    {/* Visual */}
                    <div className="relative aspect-square overflow-hidden rounded-2xl lg:aspect-auto lg:h-[500px]">
                        <Image
                            src="/young-african-professionals-learning-online-with-m.jpg"
                            alt="Professionnels apprenant avec EduPro"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            </Container>
        </section>
    )
}
