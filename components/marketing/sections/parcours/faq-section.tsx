"use client"

import { Container } from "@/components/marketing/layout/container"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { LearningPath } from "@/lib/supabase/types"

interface ParcoursFAQProps {
  learningPath: LearningPath
}

// V1: pas de table learning_path_faq exposée — on rend une FAQ générique adaptée au parcours.
// TODO: brancher sur un champ `faq` ou une table dédiée quand disponible.
export function ParcoursFAQ({ learningPath }: ParcoursFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "Ai-je besoin d'expérience préalable ?",
      answer: learningPath.prerequisites && learningPath.prerequisites.length > 0
        ? `Prérequis : ${learningPath.prerequisites.join(', ')}.`
        : "Aucun prérequis particulier. Le parcours est conçu pour être accessible à tous niveaux et progresse étape par étape.",
    },
    {
      question: "Comment se déroule le parcours ?",
      answer: learningPath.format === 'session'
        ? "Le parcours se déroule en sessions cohorte avec accompagnement, dates fixes et coaching personnalisé."
        : "Le parcours est en auto-formation : vous progressez à votre rythme depuis votre espace apprenant, accessible 24/7.",
    },
    {
      question: "Combien de temps consacrer à la formation ?",
      answer: learningPath.hours > 0
        ? `Le parcours représente environ ${learningPath.hours}h de formation au total. Vous pouvez le compléter à votre rythme.`
        : "La durée dépend de votre rythme. Le contenu reste accessible aussi longtemps que vous en avez besoin.",
    },
    {
      question: "Le certificat est-il reconnu ?",
      answer: learningPath.enable_certificate || learningPath.certificate_template_id
        ? "Oui, à la complétion du parcours vous recevez un certificat professionnel vérifiable en ligne et partageable sur LinkedIn et votre CV."
        : "Vous recevrez une attestation de réussite à la fin du parcours.",
    },
    {
      question: "Quelles sont les modalités de paiement ?",
      answer: "Vous pouvez payer par Mobile Money (Orange Money, Wave, MTN, Moov), carte bancaire ou virement. L'achat groupé est également disponible pour les organisations.",
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
                  className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${openIndex === index ? "rotate-180" : ""}`}
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
