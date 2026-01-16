"use client"

import { Container } from "@/components/marketing/layout/container"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

export function ParcoursFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "Ai-je besoin d'expérience préalable en gestion d'entreprise ?",
      answer:
        "Non, cette formation est conçue pour les créatrices et entrepreneures de tous niveaux. Nous partons des bases et construisons progressivement les compétences nécessaires pour gérer une marque de mode professionnelle.",
    },
    {
      question: "Comment se déroule le parcours ?",
      answer:
        "Le parcours combine 70% d'e-learning (vidéos, études de cas, exercices) que vous suivez à votre rythme, et 30% d'ateliers en ligne interactifs et de coaching individuel avec les formateurs. Vous avez accès à une plateforme dédiée 24/7.",
    },
    {
      question: "Combien de temps par semaine dois-je consacrer à la formation ?",
      answer:
        "Nous recommandons 8 à 10 heures par semaine pour compléter le parcours en 6-8 semaines. La flexibilité du format e-learning vous permet d'adapter le rythme à vos contraintes personnelles et professionnelles.",
    },
    {
      question: "Le certificat est-il reconnu ?",
      answer:
        "Oui, le certificat EDUPRO × SO'FATOO est reconnu par plusieurs organisations internationales dont GIZ/BMZ, AFD et ONU Femmes. Il est vérifiable en ligne par QR code et peut être partagé sur LinkedIn et votre CV.",
    },
    {
      question: "Puis-je suivre la formation depuis n'importe quel pays ?",
      answer:
        "Absolument ! La formation est 100% en ligne et accessible depuis n'importe où en Afrique ou ailleurs. Les ateliers en direct sont enregistrés si vous ne pouvez pas être présente en temps réel.",
    },
    {
      question: "Proposez-vous un accompagnement après la formation ?",
      answer:
        "Oui, vous gardez l'accès à vie à la plateforme et au contenu mis à jour. Vous rejoignez également la communauté privée des alumni où vous pouvez continuer à échanger avec les formateurs et les autres entrepreneures.",
    },
    {
      question: "Quelles sont les modalités de paiement ?",
      answer:
        "Vous pouvez payer par Mobile Money (Orange Money, Wave, MTN, Moov), carte bancaire ou virement. Un paiement en 3 fois sans frais est disponible. Pour les groupes de 3+ personnes, nous offrons -20% sur chaque inscription.",
    },
  ]

  return (
    <section className="border-b border-slate-200 bg-slate-50 py-20 lg:py-24">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl">Questions fréquentes</h2>
          <p className="mx-auto max-w-3xl text-lg text-slate-600">Tout ce que vous devez savoir avant de vous lancer</p>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-slate-50"
              >
                <span className="pr-8 font-semibold text-slate-900">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="border-t border-slate-200 bg-slate-50 p-6">
                  <p className="leading-relaxed text-slate-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
