import { Container } from "@/components/marketing/layout/container"

export function VisionSection() {
    return (
        <section className="bg-muted/30 py-20 md:py-32">
            <Container>
                <div className="mx-auto max-w-4xl">
                    <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl lg:text-5xl">
                        Notre vision : Bâtir la prochaine génération de talents africains
                    </h2>

                    <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                        <p>
                            <strong className="text-foreground">
                                Bâtir la prochaine génération de talents africains grâce à la digitalisation de la formation
                                professionnelle et à l'accès équitable au savoir.
                            </strong>
                        </p>

                        <p>
                            L'Afrique regorge de talents exceptionnels. Notre vision est de leur donner les outils digitaux pour
                            développer leurs compétences, peu importe leur localisation géographique ou leur situation économique.
                        </p>

                        <div className="my-8 space-y-4">
                            <p className="font-semibold text-foreground">Nous croyons en un futur où :</p>
                            <ul className="space-y-3">
                                <li className="flex gap-3">
                                    <span className="text-primary">✓</span>
                                    <span>
                                        <strong className="text-foreground">Chaque professionnel africain</strong> a accès aux mêmes
                                        opportunités de formation que ses pairs internationaux
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary">✓</span>
                                    <span>
                                        <strong className="text-foreground">La digitalisation</strong> élimine les barrières géographiques
                                        et financières
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary">✓</span>
                                    <span>
                                        <strong className="text-foreground">Le savoir circule librement</strong> à travers le continent
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary">✓</span>
                                    <span>
                                        <strong className="text-foreground">Les talents africains</strong> sont reconnus et valorisés à leur
                                        juste valeur sur la scène mondiale
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <p className="rounded-xl bg-primary/10 p-6 font-semibold text-foreground">
                            Notre ambition : Devenir la référence panafricaine en formation professionnelle digitale, en touchant des
                            millions d'apprenants dans les 10 prochaines années.
                        </p>
                    </div>
                </div>
            </Container>
        </section>
    )
}
