import { Container } from "@/components/marketing/layout/container"
import { MapPin, Mail, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ContactSection() {
    return (
        <section id="contact" className="py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">Entrons en contact</h2>
                    <p className="text-lg text-muted-foreground">On répond à tous vos messages (promis!)</p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-4">
                            <MapPin className="h-6 w-6 text-primary" />
                        </div>

                        <h3 className="mb-6 text-xl font-bold">Nos Bureaux</h3>

                        <div className="space-y-6">
                            <div>
                                <p className="mb-2 font-semibold text-foreground">🇸🇳 Dakar, Sénégal (Siège)</p>
                                <p className="text-sm text-muted-foreground">Immeuble Antalya, 6e étage</p>
                                <p className="text-sm text-muted-foreground">Dakar, Sénégal</p>
                                <p className="mt-2 text-sm text-primary">contact@edupro.africa</p>
                                <p className="text-sm text-muted-foreground">+221 XX XXX XX XX</p>
                            </div>

                            <div>
                                <p className="mb-2 font-semibold text-foreground">🇨🇮 Abidjan, Côte d'Ivoire</p>
                                <p className="text-sm text-muted-foreground">Plateau, Immeuble SCIAM</p>
                                <p className="text-sm text-muted-foreground">Abidjan, Côte d'Ivoire</p>
                                <p className="mt-2 text-sm text-primary">ci@edupro.africa</p>
                                <p className="text-sm text-muted-foreground">+225 XX XXX XX XX</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8">
                        <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-4">
                            <Mail className="h-6 w-6 text-primary" />
                        </div>

                        <h3 className="mb-6 text-xl font-bold">Nous Écrire</h3>

                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="font-semibold text-foreground">Pour les entreprises:</p>
                                <p className="text-primary">entreprises@edupro.africa</p>
                            </div>

                            <div>
                                <p className="font-semibold text-foreground">Pour les formateurs ou instituts:</p>
                                <p className="text-primary">formateurs@edupro.africa</p>
                            </div>

                            <div>
                                <p className="font-semibold text-foreground">Pour les apprenants:</p>
                                <p className="text-primary">contact@edupro.africa</p>
                            </div>

                            <div>
                                <p className="font-semibold text-foreground">Pour les investisseurs:</p>
                                <p className="text-primary">contact@edupro.africa</p>
                            </div>

                            <div>
                                <p className="font-semibold text-foreground">Presse & Partenaires:</p>
                                <p className="text-primary">partenariats@edupro.africa</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-8">
                        <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-4">
                            <Globe className="h-6 w-6 text-primary" />
                        </div>

                        <h3 className="mb-6 text-xl font-bold">Réseaux Sociaux</h3>

                        <p className="mb-4 text-sm text-muted-foreground">Suivez notre aventure au quotidien :</p>

                        <div className="mb-6 space-y-2 text-sm">
                            <p>
                                <a href="#" className="text-primary hover:underline">
                                    LinkedIn
                                </a>{" "}
                                - Actualités entreprise & insights
                            </p>
                            <p>
                                <a href="#" className="text-primary hover:underline">
                                    Twitter/X
                                </a>{" "}
                                - News & conversations
                            </p>
                            <p>
                                <a href="#" className="text-primary hover:underline">
                                    Instagram
                                </a>{" "}
                                - Coulisses & communauté
                            </p>
                            <p>
                                <a href="#" className="text-primary hover:underline">
                                    Facebook
                                </a>{" "}
                                - Événements & success stories
                            </p>
                            <p>
                                <a href="#" className="text-primary hover:underline">
                                    YouTube
                                </a>{" "}
                                - Tutoriels & témoignages
                            </p>
                        </div>

                        <div>
                            <p className="mb-3 text-sm font-semibold text-foreground">Newsletter mensuelle:</p>
                            <div className="flex gap-2">
                                <Input type="email" placeholder="Votre email" className="flex-1" />
                                <Button size="sm">OK</Button>
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">Un email par mois, zéro spam, 100% valeur ajoutée</p>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}
