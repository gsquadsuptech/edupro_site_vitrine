import { Container } from "@/components/marketing/layout/container"
import { Mail, Phone, MapPin } from "lucide-react"

export function ContactHeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h1 className="mb-6 text-balance text-4xl font-bold md:text-5xl lg:text-6xl">
                        Entrons en{" "}
                        <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">contact</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Une question, un projet, une collaboration ? Notre équipe est là pour vous accompagner.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-xl border border-border bg-card p-6 text-center hover:shadow-lg transition-shadow">
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="mb-2 font-bold">Email</h3>
                        <p className="text-sm text-muted-foreground mb-2">Pour toute demande générale</p>
                        <a href="mailto:contact@edupro.africa" className="text-sm font-medium text-primary hover:underline">
                            contact@edupro.africa
                        </a>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 text-center hover:shadow-lg transition-shadow">
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                            <Phone className="h-6 w-6 text-chart-2" />
                        </div>
                        <h3 className="mb-2 font-bold">Téléphone</h3>
                        <p className="text-sm text-muted-foreground mb-2">Du lundi au vendredi, 9h-18h</p>
                        <a href="tel:+221123456789" className="text-sm font-medium text-primary hover:underline">
                            +221 12 345 67 89
                        </a>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 text-center hover:shadow-lg transition-shadow">
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/10">
                            <MapPin className="h-6 w-6 text-chart-1" />
                        </div>
                        <h3 className="mb-2 font-bold">Adresse</h3>
                        <p className="text-sm text-muted-foreground mb-2">Siège social</p>
                        <p className="text-sm font-medium">Dakar, Sénégal</p>
                    </div>
                </div>
            </Container>
        </section>
    )
}
