import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Image from "next/image"

export function FormateursHeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 md:py-32">
            <Container>
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
                    <div>
                        <h1 className="mb-6 text-balance text-4xl font-bold md:text-5xl lg:text-6xl">
                            Transformez votre savoir-faire en impact panafricain
                        </h1>

                        <p className="mb-8 text-xl text-muted-foreground">
                            Rejoignez <strong>150+ formateurs et instituts</strong> qui partagent leur savoir-faire sur EduPro. Des
                            outils IA pour créer, une audience panafricaine pour rayonner, un support complet pour réussir.
                        </p>

                        <div className="mb-8 space-y-3">
                            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                Micro-copy sous CTAs:
                            </p>
                            <p className="text-sm text-muted-foreground">
                                ✓ Gratuit pour commencer · Outils IA inclus · Commission attractive · Support dédié
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row">
                            <Button size="lg" className="group bg-gradient-to-r from-primary to-chart-2">
                                Devenir formateur partenaire
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                            <Button size="lg" variant="outline">
                                Découvrir la solution instituts
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>

                        <div className="mt-8 inline-flex items-center gap-4">
                            <div className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-3 py-1">
                                <span className="inline-flex h-2 w-2 rounded-full bg-chart-1"></span>
                                <span className="text-xs font-medium">Je suis:</span>
                            </div>
                            <select className="rounded-lg border border-border bg-background px-3 py-1 text-sm">
                                <option>Formateur indépendant</option>
                                <option>Institut de formation</option>
                            </select>
                        </div>

                        {/* Stats */}
                        <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4 border-t border-border pt-8">
                            <div>
                                <p className="text-3xl font-bold text-primary">150+</p>
                                <p className="text-xs font-medium text-muted-foreground">Formateurs actifs</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-primary">10K+</p>
                                <p className="text-xs font-medium text-muted-foreground">Apprenants formés</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-primary">70%+</p>
                                <p className="text-xs font-medium text-muted-foreground">Satisfaction formateurs</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-primary">3</p>
                                <p className="text-xs font-medium text-muted-foreground">Pays couverts</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-chart-2/20">
                            <Image
                                src="/african-instructor-teaching-digital-course.jpg"
                                alt="Formateur africain créant du contenu digital"
                                width={500}
                                height={500}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-xl transition-transform hover:scale-110">
                                <Play className="h-6 w-6 text-primary ml-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}
