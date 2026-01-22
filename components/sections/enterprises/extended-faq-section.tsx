import { Container } from "@/components/marketing/layout/container"

export function ExtendedFAQSection() {
    const faqSections = [
        {
            category: "Support & Accompagnement",
            questions: [
                {
                    q: "Quel niveau de support après le déploiement?",
                    a: "Nous vous accompagnons à chaque étape avec support technique (email, chat, centre d'aide en ligne), formation continue de vos administrateurs, documentation détaillée et communauté d'entraide. Selon votre formule, option support prioritaire et Customer Success Manager dédié disponibles.",
                },
                {
                    q: "Proposez-vous des démos ou périodes d'essai?",
                    a: "Oui! Nous proposons des démos personnalisées gratuites (30-45 min) avec présentation adaptée à votre secteur, configuration d'un environnement de test, et réponses à vos questions. Vous recevez une proposition commerciale détaillée sous 48h.",
                },
            ],
        },
        {
            category: "Langues & Localisation",
            questions: [
                {
                    q: "Les formations sont-elles en français uniquement?",
                    a: "La plateforme supporte le français et l'anglais. Nos contenus de formation sont principalement disponibles en français et anglais, avec certains contenus spécifiques en langues locales (Wolof, Swahili, etc.). Quand vous créez vos formations internes, vous pouvez utiliser n'importe quelle langue.",
                },
            ],
        },
        {
            category: "Qualité & Conformité",
            questions: [
                {
                    q: "Comment garantissez-vous la qualité pédagogique?",
                    a: "Tous nos formateurs suivent notre Bootcamp des Formateurs pour créer du contenu e-learning professionnel. Chaque formation suit les principes du microlearning: modules courts (10-20min), vidéos dynamiques avec sous-titres, exercices interactifs, cas pratiques contextualisés, feedback immédiat. Sur demande, nous pouvons auditer vos contenus internes.",
                },
            ],
        },
    ]

    return (
        <section className="py-20 md:py-32">
            <Container>
                <div className="grid gap-8 md:grid-cols-2">
                    {faqSections.map((category, catIdx) => (
                        <div key={catIdx}>
                            <h3 className="mb-6 text-lg font-bold text-primary">{category.category}</h3>
                            <div className="space-y-4">
                                {category.questions.map((faq, idx) => (
                                    <details
                                        key={idx}
                                        className="group rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md"
                                    >
                                        <summary className="flex cursor-pointer items-center justify-between font-semibold text-foreground">
                                            {faq.q}
                                            <span className="transition-transform group-open:rotate-180">▼</span>
                                        </summary>
                                        <p className="mt-4 text-sm text-muted-foreground">{faq.a}</p>
                                    </details>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    )
}
