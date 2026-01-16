"use client"

import { Container } from "@/components/marketing/layout/container"
import { useState } from "react"
import { ChevronDown, Clock, Video, FileText, Users } from "lucide-react"

export function ParcoursCurriculum() {
  const [openModule, setOpenModule] = useState<number | null>(0)

  const curriculum = [
    {
      number: 1,
      title: "Comprendre et structurer son business de mode",
      duration: "12h",
      objective:
        "Maîtriser les fondamentaux du marché, définir son client cible et poser les bases solides de son entreprise",
      sections: [
        {
          name: "Les tendances du marché africain et mondial de la mode",
          format: "Vidéo + fiche synthèse",
          duration: "1h",
        },
        {
          name: "Les nouveaux comportements d'achat et les attentes des consommateurs",
          format: "Étude de cas",
          duration: "1h",
        },
        {
          name: "Déterminer sa cible : personae, besoins, attentes, comportements",
          format: "Atelier + canevas",
          duration: "2h",
        },
        {
          name: "Définir sa proposition de valeur, son USP et trouver son market-product fit",
          format: "Atelier + feedback",
          duration: "4h",
        },
        {
          name: "Structuration légale et immatriculation d'une marque de mode",
          format: "Tutoriel + checklist",
          duration: "2h",
        },
        {
          name: "Introduction aux sources de financement et dispositifs d'appui",
          format: "Présentation + modèle",
          duration: "2h",
        },
      ],
      result:
        "Une entreprise structurée, positionnée sur un marché clair, avec une identité et un modèle économique alignés sur son client idéal",
    },
    {
      number: 2,
      title: "Branding, storytelling et image de marque",
      duration: "8h",
      objective: "Construire une marque forte, cohérente et authentique sur tous les canaux",
      sections: [
        {
          name: "Construire son identité de marque (valeurs, mission, ADN visuel)",
          format: "Atelier pratique",
          duration: "2h",
        },
        { name: "Storytelling culturel et narration de marque", format: "Étude de cas + exercice", duration: "2h" },
        { name: "Créer une charte visuelle et un univers cohérent", format: "Tutoriel + modèle Canva", duration: "2h" },
        { name: "Déployer sa marque sur les réseaux sociaux", format: "Vidéo + quiz", duration: "2h" },
      ],
      result: "Une marque différenciante, prête à être déclinée sur les supports physiques et digitaux",
    },
    {
      number: 3,
      title: "Gestion, durabilité et rentabilité",
      duration: "7h",
      objective: "Comprendre les mécanismes économiques et organisationnels d'une marque de mode durable et rentable",
      sections: [
        {
          name: "Calculer ses coûts, marges et fixer ses prix de manière stratégique",
          format: "Simulation Excel + quiz",
          duration: "2h",
        },
        {
          name: "Gestion simplifiée des stocks et approvisionnements",
          format: "E-learning interactif",
          duration: "1.5h",
        },
        { name: "Planifier ses collections et son budget annuel", format: "Atelier + modèle Excel", duration: "2h" },
        {
          name: "Intégrer la durabilité et l'éthique dans la gestion quotidienne",
          format: "Étude de cas",
          duration: "1.5h",
        },
      ],
      result: "Un business structuré, durable et rentable, prêt à croître sans déséquilibre financier",
    },
    {
      number: 4,
      title: "Stratégies de vente et canaux de distribution",
      duration: "13h",
      objective: "Apprendre à vendre efficacement sur tous les canaux (boutique, e-commerce, réseaux sociaux)",
      sections: [
        {
          name: "Les canaux de vente : boutique physique, e-commerce, social selling",
          format: "Cours interactif",
          duration: "2h",
        },
        { name: "Créer et gérer une boutique physique rentable", format: "Atelier + plan", duration: "3h" },
        { name: "Merchandising & expérience client en boutique", format: "Étude de cas + mini-projet", duration: "3h" },
        {
          name: "Vendre en ligne : site web, marketplaces, réseaux sociaux",
          format: "Tutoriel + plan d'action",
          duration: "3h",
        },
        { name: "Service client et expérience après-vente", format: "Jeux de rôle + checklist", duration: "2h" },
      ],
      result: "Savoir vendre sur plusieurs canaux, créer une expérience d'achat fluide et fidéliser les clients",
    },
    {
      number: 5,
      title: "Marketing digital et création de contenu",
      duration: "9h",
      objective: "Développer sa visibilité et son attractivité grâce à des outils et stratégies numériques simples",
      sections: [
        {
          name: "Les piliers du marketing de mode : contenu, influence et communauté",
          format: "Vidéo + quiz",
          duration: "2h",
        },
        { name: "Créer du contenu engageant avec un smartphone", format: "Atelier pratique", duration: "3h" },
        { name: "Utiliser l'IA pour la création de contenu", format: "Démonstration + cas pratique", duration: "2h" },
        { name: "Planifier et automatiser sa communication digitale", format: "Exercice + modèle", duration: "2h" },
      ],
      result: "Une marque visible, inspirante et régulière dans sa communication digitale",
    },
    {
      number: 6,
      title: "Projet final : Mon plan de marque",
      duration: "5h",
      objective: "Consolider toutes les notions dans un plan de développement concret",
      sections: [
        { name: "Élaborer son plan de marque complet", format: "Coaching individuel", duration: "3h" },
        {
          name: "Présentation du projet final devant un jury professionnel",
          format: "Session en ligne",
          duration: "2h",
        },
      ],
      result: "Un plan d'action complet et prêt à exécution pour développer sa marque",
    },
  ]

  return (
    <section className="border-b border-slate-200 bg-white py-20 lg:py-24">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl">Programme de formation détaillé</h2>
          <p className="mx-auto max-w-3xl text-lg text-slate-600">
            6 cours complets pour maîtriser tous les aspects du business de la mode africaine
          </p>
        </div>

        <div className="space-y-4">
          {curriculum.map((module) => (
            <div
              key={module.number}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md"
            >
              {/* Module header */}
              <button
                onClick={() => setOpenModule(openModule === module.number ? null : module.number)}
                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-slate-100"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 font-bold text-white shadow-lg">
                    {module.number}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{module.title}</h3>
                    <div className="mt-1 flex items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {module.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {module.sections.length} sections
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={`h-6 w-6 text-slate-600 transition-transform ${
                    openModule === module.number ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Module content */}
              {openModule === module.number && (
                <div className="border-t border-slate-200 bg-white p-6">
                  <p className="mb-6 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm leading-relaxed text-slate-700">
                    <span className="font-semibold text-indigo-700">Objectif : </span>
                    {module.objective}
                  </p>

                  <div className="space-y-3">
                    {module.sections.map((section, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-sm font-semibold text-slate-700">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{section.name}</p>
                          <div className="mt-1 flex items-center gap-3 text-sm text-slate-600">
                            <span>{section.format}</span>
                            <span>•</span>
                            <span>{section.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-sm font-semibold text-emerald-700">✓ Résultat attendu</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">{module.result}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Total duration summary */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6 text-center shadow-sm">
            <Video className="mx-auto mb-3 h-8 w-8 text-indigo-600" />
            <p className="text-3xl font-bold text-slate-900">20h</p>
            <p className="text-sm text-slate-600">Cours e-learning</p>
          </div>
          <div className="rounded-2xl border border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 to-white p-6 text-center shadow-sm">
            <Users className="mx-auto mb-3 h-8 w-8 text-fuchsia-600" />
            <p className="text-3xl font-bold text-slate-900">20h</p>
            <p className="text-sm text-slate-600">Ateliers et exercices</p>
          </div>
          <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6 text-center shadow-sm">
            <Clock className="mx-auto mb-3 h-8 w-8 text-purple-600" />
            <p className="text-3xl font-bold text-slate-900">10-15h</p>
            <p className="text-sm text-slate-600">Coaching et projet final</p>
          </div>
        </div>
      </Container>
    </section>
  )
}
