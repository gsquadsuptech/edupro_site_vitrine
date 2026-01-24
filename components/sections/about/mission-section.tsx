import { Container } from "@/components/marketing/layout/container"

export function MissionSection() {
    return (
        <section className="py-20 md:py-32">
            <Container>
                <div className="mx-auto max-w-4xl">
                    <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl lg:text-5xl">
                        Notre mission : Accélérer la transformation des compétences en Afrique
                    </h2>

                    <div className="space-y-8 text-lg leading-relaxed text-muted-foreground">
                        <div>
                            <h3 className="mb-4 text-xl font-semibold text-foreground">Le Constat</h3>
                            <p>
                                Chaque année, des millions de professionnels africains voient leur potentiel inexploité. Non pas par
                                manque de talent ou d'ambition, mais par <strong className="text-foreground">manque d'accès</strong> à
                                la formation continue de qualité. Les solutions internationales? Trop chères, trop éloignées de nos
                                réalités. Les solutions locales? Souvent limitées en portée et en impact.
                            </p>
                        </div>

                        <div>
                            <h3 className="mb-4 text-xl font-semibold text-foreground">Notre Approche</h3>
                            <p className="mb-4">Nous créons une plateforme qui répond à trois enjeux majeurs :</p>
                            <ul className="space-y-3">
                                <li className="flex gap-3">
                                    <span className="text-primary">•</span>
                                    <span>
                                        <strong className="text-foreground">Accessibilité</strong> : Formation de qualité à prix abordable,
                                        optimisée pour mobile et faible bande passante
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary">•</span>
                                    <span>
                                        <strong className="text-foreground">Interactivité</strong> : Expériences d'apprentissage engageantes
                                        qui favorisent la rétention et l'application pratique
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary">•</span>
                                    <span>
                                        <strong className="text-foreground">Mesurabilité</strong> : Suivi précis des progrès et de l'impact
                                        réel sur les performances professionnelles
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="mb-4 text-xl font-semibold text-foreground">L'Écosystème</h3>
                            <p>
                                Nous ne créons pas seulement une plateforme. Nous construisons un{" "}
                                <strong className="text-foreground">écosystème</strong> où entreprises, formateurs, apprenants et
                                investisseurs collaborent pour élever le niveau de compétences du continent. Chaque acteur trouve sa
                                valeur, chaque interaction crée de l'impact. Parce que quand l'Afrique excelle, le monde entier en
                                profite.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 rounded-2xl border-l-4 border-primary bg-primary/5 p-8">
                        <blockquote className="text-lg italic leading-relaxed">
                            "J'ai grandi en voyant des talents extraordinaires limités par le manque d'opportunités de formation.
                            EduPro est ma réponse à cette injustice. Nous ne cherchons pas à copier ce qui existe ailleurs - nous
                            créons ce qui devrait exister ici."
                        </blockquote>
                        <p className="mt-4 font-semibold text-foreground">— Fondateur, CEO & Co-fondateur EduPro</p>
                    </div>
                </div>
            </Container>
        </section>
    )
}
