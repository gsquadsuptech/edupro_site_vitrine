"use client"

import { Container } from "@/components/marketing/layout/container"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

export function InvestorFAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const faqs = [
        {
            question: "Vous n'avez pas encore de revenus, pourquoi investir maintenant?",
            answer:
                "Parce que c'est le moment où vous pouvez entrer à la meilleure valorisation, avec une équipe prouvée qui exécute. Dans 6 mois avec de la traction, les termes seront différents.",
        },
        {
            question: "Quelle est votre valorisation?",
            answer:
                "Nous discutons de la valorisation avec chaque investisseur en fonction de ce qu'il apporte (capital + réseau + expertise). Contactez-nous pour en parler.",
        },
        {
            question: "Quel est le ticket minimum?",
            answer:
                "Nous sommes flexibles sur le ticket minimum pour le SEED. L'important est l'alignement vision et ce que vous apportez au-delà du capital.",
        },
        {
            question: "Vous cherchez un lead investor?",
            answer:
                "Idéalement oui, quelqu'un qui prend le leadership de la levée et mobilise son réseau. Mais nous sommes ouverts à plusieurs investisseurs alignés.",
        },
        {
            question: "Quand prévoyez-vous d'être rentable?",
            answer:
                "Objectif de breakeven : 18-24 mois post-lancement. Mais l'objectif intermédiaire est la croissance et validation du product-market fit.",
        },
        {
            question: "Pourquoi pas Série A directement?",
            answer:
                "Nous voulons valider notre traction avec le bon partenaire SEED d'abord. La Série A viendra naturellement dans 12-18 mois avec les bonnes métriques.",
        },
    ]

    return (
        <section className="bg-muted/30 py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">FAQ Investisseurs</h2>
                    <p className="text-lg text-muted-foreground">Questions Fréquentes</p>
                </div>

                <div className="mx-auto max-w-3xl space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="rounded-lg border border-border bg-card overflow-hidden">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-muted/50 transition-colors"
                            >
                                <h3 className="font-semibold text-foreground">{faq.question}</h3>
                                <ChevronDown
                                    className={`h-5 w-5 flex-shrink-0 transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                                />
                            </button>

                            {openIndex === index && (
                                <div className="border-t border-border px-6 py-4 text-muted-foreground">
                                    <p>{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    )
}
