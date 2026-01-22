"use client"

import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

export function FormateursFAQSection() {
    const [openIndex, setOpenIndex] = useState(0)

    const faqs = [
        {
            question: "Ai-je besoin de compétences techniques pour créer mes formations?",
            answer:
                "Absolument pas! Notre interface est conçue pour être intuitive. Si vous savez utiliser PowerPoint ou Word, vous saurez utiliser EduPro. De plus, notre assistant IA vous guide à chaque étape, et notre équipe support est toujours disponible pour vous aider.",
        },
        {
            question: "Combien de temps faut-il pour créer une formation?",
            answer:
                "Grâce à nos outils IA, vous pouvez structurer une formation complète en 2-3 jours au lieu de 2-3 semaines. Nos formateurs créent en moyenne leur premier module en 4-6 heures.",
        },
        {
            question: "Comment suis-je payé?",
            answer:
                "Les commissions sont calculées automatiquement et versées à la fin du mois (sous 30 jours) via Mobile Money, virement bancaire, ou tout autre moyen de paiement disponible dans votre pays. Pour les auto-formations: versement en moins de 30 jours après l'achat. Pour les sessions: versement à la fin de la session ou par échelon au fur et à mesure. Vous recevez une facture détaillée par email.",
        },
        {
            question: "Puis-je fixer mes propres prix?",
            answer:
                "Oui! Vous définissez le prix de vos formations en toute liberté. Nous vous conseillons sur les prix de marché, mais la décision finale vous appartient.",
        },
        {
            question: "Que se passe-t-il si un apprenant demande un remboursement?",
            answer:
                "Nous appliquons une politique de remboursement de 7 jours. Si un apprenant demande un remboursement dans les 7 jours suivant l'achat et n'a pas dépassé les seuils d'utilisation, le remboursement est accepté. Après 7 jours, les commissions sont considérées comme acquises.",
        },
        {
            question: "Puis-je utiliser mes formations existantes?",
            answer:
                "Absolument! Vous pouvez importer vos contenus existants (PowerPoint, PDF, vidéos). Notre équipe peut même vous aider à les restructurer au format digital pour une meilleure expérience apprenant.",
        },
        {
            question: "Comment ma formation est-elle promue?",
            answer:
                "EduPro investit dans le marketing pour attirer des apprenants sur la plateforme. Vos formations sont mises en avant selon leur qualité, les évaluations apprenants, et votre niveau d'abonnement. Vous pouvez aussi promouvoir vos formations sur vos propres canaux.",
        },
    ]

    return (
        <section className="py-20 md:py-32 bg-muted/30">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Questions fréquentes</h2>
                </div>

                <div className="mx-auto max-w-3xl space-y-4">
                    {faqs.map((faq, index) => (
                        <button
                            key={index}
                            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                            className="w-full text-left"
                        >
                            <div className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-center justify-between gap-4">
                                    <h3 className="font-bold">{faq.question}</h3>
                                    <ChevronDown
                                        className={`h-5 w-5 text-primary transition-transform flex-shrink-0 ${openIndex === index ? "rotate-180" : ""}`}
                                    />
                                </div>
                                {openIndex === index && (
                                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="mb-6 text-muted-foreground">Une autre question?</p>
                    <Button variant="outline">Contacter notre équipe formateurs</Button>
                </div>
            </Container>
        </section>
    )
}
