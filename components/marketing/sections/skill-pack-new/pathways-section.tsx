"use client"

import { Container } from "@/components/marketing/layout/container"
import { useState } from "react"
import { ChevronRight, Clock, BookOpen, Award } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SkillPackPathways() {
  const [expandedPath, setExpandedPath] = useState<number>(0)

  const pathways = [
    {
      title: "Utiliser l'IA pour booster ses ventes et sa prospection commerciale",
      duration: "2 semaines",
      level: "Débutant",
      description: "Apprenez à automatiser la prospection, la rédaction et la segmentation client avec l'IA",
      skills: ["Prospection automatisée", "Rédaction assistée par IA", "Segmentation intelligente", "CRM + IA"],
      gradient: "from-cyan-600 to-blue-600",
    },
    {
      title: "ChatGPT et copilotes IA pour la productivité bureautique",
      duration: "2 semaines",
      level: "Débutant",
      description: "Gagnez du temps sur les tâches répétitives et améliorez vos rapports et synthèses",
      skills: ["Prompts efficaces", "Résumés automatiques", "Traduction professionnelle", "Recherche intelligente"],
      gradient: "from-indigo-600 to-purple-600",
    },
    {
      title: "IA pour la création de contenu marketing",
      duration: "3 semaines",
      level: "Intermédiaire",
      description: "Créez du contenu professionnel à l'aide d'outils IA visuels et textuels",
      skills: ["Midjourney", "DALL-E", "Runway ML", "Copy.ai", "Jasper"],
      gradient: "from-fuchsia-600 to-pink-600",
    },
    {
      title: "Automatiser ses processus avec N8N, Make, Zapier et Notion AI",
      duration: "3 semaines",
      level: "Intermédiaire",
      description: "Connectez vos outils et automatisez vos flux de travail sans coder",
      skills: ["Workflows automatiques", "Intégrations API", "No-code automation", "Productivité 10x"],
      gradient: "from-violet-600 to-purple-600",
    },
    {
      title: "Manager une équipe hybride avec l'IA et les outils collaboratifs",
      duration: "2 semaines",
      level: "Avancé",
      description: "Optimisez la communication et le suivi de projet grâce à l'IA",
      skills: ["Management hybride", "Outils collaboratifs IA", "Suivi de productivité", "Communication asynchrone"],
      gradient: "from-rose-600 to-pink-600",
    },
  ]

  return (
    <section className="relative border-b border-slate-800 py-20 lg:py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-transparent to-transparent" />

      <Container className="relative">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-black text-white lg:text-5xl">5 parcours pour maîtriser l'IA au travail</h2>
          <p className="mx-auto max-w-3xl text-xl text-slate-400">
            Un cursus progressif de 10-12 semaines conçu pour transformer votre façon de travailler
          </p>
        </div>

        <div className="space-y-4">
          {pathways.map((pathway, index) => (
            <div
              key={index}
              className={`group overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                expandedPath === index
                  ? "border-indigo-500 bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 shadow-2xl shadow-indigo-500/20"
                  : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
              }`}
            >
              {/* Header */}
              <button
                onClick={() => setExpandedPath(expandedPath === index ? -1 : index)}
                className="flex w-full items-center justify-between p-6 text-left lg:p-8"
              >
                <div className="flex items-center gap-6">
                  {/* Number badge */}
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${pathway.gradient} font-black text-white text-2xl shadow-lg`}
                  >
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-bold text-white lg:text-2xl">{pathway.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {pathway.duration}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {pathway.level}
                      </span>
                    </div>
                  </div>
                </div>

                <ChevronRight
                  className={`h-8 w-8 shrink-0 text-slate-400 transition-transform ${
                    expandedPath === index ? "rotate-90" : ""
                  }`}
                />
              </button>

              {/* Expanded content */}
              {expandedPath === index && (
                <div className="border-t border-slate-800 bg-slate-950/50 p-6 lg:p-8">
                  <p className="mb-6 text-lg leading-relaxed text-slate-300">{pathway.description}</p>

                  <div className="mb-6">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
                      Compétences acquises
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {pathway.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className={`rounded-full border bg-gradient-to-r ${pathway.gradient} border-transparent px-4 py-2 text-sm font-semibold text-white shadow-lg`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    className={`bg-gradient-to-r ${pathway.gradient} font-semibold shadow-lg transition-all hover:scale-105`}
                  >
                    Voir le programme détaillé
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Total package info */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-cyan-950/30 to-slate-950 p-8 text-center">
            <Clock className="mx-auto mb-4 h-12 w-12 text-cyan-400" />
            <p className="mb-2 text-4xl font-black text-white">10-12</p>
            <p className="text-slate-400">semaines au total</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-indigo-950/30 to-slate-950 p-8 text-center">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-indigo-400" />
            <p className="mb-2 text-4xl font-black text-white">80-100h</p>
            <p className="text-slate-400">de formation pratique</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-fuchsia-950/30 to-slate-950 p-8 text-center">
            <Award className="mx-auto mb-4 h-12 w-12 text-fuchsia-400" />
            <p className="mb-2 text-4xl font-black text-white">1</p>
            <p className="text-slate-400">certificat professionnel</p>
          </div>
        </div>
      </Container>
    </section>
  )
}
