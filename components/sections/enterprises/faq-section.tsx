import { Container } from "@/components/marketing/layout/container"

export function FAQSection() {
    const faqs = [
        {
            category: "Onboarding & Déploiement",
            questions: [
                {
                    q: "Combien de temps pour déployer EduPro dans mon entreprise?",
                    a: "48h en moyenne du paiement à l'accès de vos premiers collaborateurs. Jour 1: configuration et formation des admins. Jour 2: tests et déploiement général. Pour les formules Enterprise avec intégrations SIRH complexes, prévoir 1-2 semaines.",
                },
                {
                    q: "Qui s'occupe de la création des contenus?",
                    a: "3 options: 1) Marketplace existante - accès à nos formations créées par des experts africains 2) Création autonome - vous créez avec nos outils IA 3) Création accompagnée - nos learning designers créent pour vous (service add-on).",
                },
                {
                    q: "Faut-il former nos collaborateurs à utiliser la plateforme?",
                    a: "Non. EduPro est pensé pour être intuitif. Vos collaborateurs reçoivent un email de bienvenue et c'est parti. Nous formons toujours vos admins/RH pour maîtriser le back-office (formation 2 à 4h selon la formule).",
                },
            ],
        },
        {
            category: "Technique & Intégrations",
            questions: [
                {
                    q: "EduPro fonctionne-t-il hors ligne?",
                    a: "EduPro est une PWA accessible depuis n'importe quel navigateur. Les vidéos uploadées peuvent être téléchargées pour consultation hors ligne. Pour vos collaborateurs en zone à faible connectivité, privilégiez les contenus uploadés directement.",
                },
                {
                    q: "Peut-on intégrer EduPro à notre SIRH existant?",
                    a: "Oui, mais cela nécessite une étude préalable. Les intégrations SIRH sont proposées en option et font l'objet d'un devis spécifique après étude de votre infrastructure.",
                },
            ],
        },
        {
            category: "Contenus & Pédagogie",
            questions: [
                {
                    q: "Comment garantissez-vous la qualité pédagogique?",
                    a: "Tous nos formateurs suivent notre Bootcamp des Formateurs les certifiant à la création de contenu e-learning professionnel. Chaque formation suit les principes du microlearning: modules courts (10-20min), vidéos dynamiques, exercices interactifs, cas pratiques contextualisés.",
                },
                {
                    q: "Peut-on ajouter nos propres formateurs internes?",
                    a: "Oui! Vos experts métiers peuvent devenir formateurs sur la plateforme. Vous leur créez un compte formateur, ils accèdent aux outils de création simples et assistés par IA, créent leurs cours, vous validez et puis publication auprès de vos collaborateurs.",
                },
            ],
        },
        {
            category: "ROI & Résultats",
            questions: [
                {
                    q: "Quel ROI puis-je espérer?",
                    a: "Nos clients constatent généralement un retour positif dès les premiers mois provenant de: réduction des coûts formation (-40 à 60% vs présentiel), time-to-productivity (-30 à 50%), réduction du turnover (-10 à 20%), gains de productivité (+15 à 25%).",
                },
                {
                    q: "Combien de temps avant de voir des résultats?",
                    a: "Résultats immédiats (Mois 1): réduction logistique. Court terme (Mois 3-6): amélioration time-to-productivity mesurable. Moyen terme (12 mois): impact sur turnover et culture de learning continu installée.",
                },
            ],
        },
    ]

    return (
        <section className="py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                        Les questions que se posent les DRH
                    </h2>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    {faqs.map((category, catIdx) => (
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
