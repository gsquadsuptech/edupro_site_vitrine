"use client"

import { Container } from "@/components/marketing/layout/container"
import { useState } from "react"
import { ChevronRight, Clock, BookOpen, Award } from "lucide-react"
import { Button } from "@/components/ui/button"

import { LearningPath } from "@/lib/supabase/types"

interface SkillPackPathwaysProps {
  skillPack?: LearningPath
}

export function SkillPackPathways({ skillPack }: SkillPackPathwaysProps) {
  const [expandedPath, setExpandedPath] = useState<number>(0)

  // Gradients for dynamic list
  const gradients = [
    "from-cyan-600 to-blue-600",
    "from-indigo-600 to-purple-600",
    "from-fuchsia-600 to-pink-600",
    "from-violet-600 to-purple-600",
    "from-rose-600 to-pink-600",
  ]

  const staticPathways = [
    {
      title: "Utiliser l'IA pour booster ses ventes et sa prospection commerciale",
      duration: "2 semaines",
      level: "Débutant",
      description: "Apprenez à automatiser la prospection, la rédaction et la segmentation client avec l'IA",
      skills: ["Prospection automatisée", "Rédaction assistée par IA", "Segmentation intelligente", "CRM + IA"],
      gradient: "from-cyan-600 to-blue-600",
      id: "static-1"
    },
    // ... (rest of static data kept for fallback or removed if full dynamic is preferred. Let's keep a simplified static list as fallback)
    {
      title: "ChatGPT et copilotes IA pour la productivité bureautique",
      duration: "2 semaines",
      level: "Débutant",
      description: "Gagnez du temps sur les tâches répétitives et améliorez vos rapports et synthèses",
      skills: ["Prompts efficaces", "Résumés automatiques"],
      gradient: "from-indigo-600 to-purple-600",
      id: "static-2"
    }
  ]

  // Map dynamic courses to pathway format
  const dynamicPathways = skillPack?.courses && skillPack.courses.length > 0
    ? skillPack.courses.map((course, index) => ({
      title: course.title,
      duration: course.duration || "2 semaines",
      level: course.level || "Tous niveaux",
      description: course.description || "Aucune description disponible.",
      skills: [], // We don't have skills per course in this view yet
      gradient: gradients[index % gradients.length],
      id: course.id
    }))
    : staticPathways

  return (
    <section className="relative border-b border-slate-800 py-20 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-transparent to-transparent" />

      <Container className="relative">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-black text-white lg:text-5xl">
            {skillPack ? `${dynamicPathways.length} parcours pour maîtriser ce sujet` : "5 parcours pour maîtriser l'IA au travail"}
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-slate-400">
            Un cursus progressif conçu pour transformer votre façon de travailler
          </p>
        </div>

        <div className="space-y-4">
          {dynamicPathways.map((pathway, index) => (
            <div
              key={pathway.id}
              className={`group overflow-hidden rounded-2xl border-2 transition-all duration-300 ${expandedPath === index
                ? "border-indigo-500 bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 shadow-2xl shadow-indigo-500/20"
                : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                }`}
            >
              <button
                onClick={() => setExpandedPath(expandedPath === index ? -1 : index)}
                className="flex w-full items-center justify-between p-6 text-left lg:p-8"
              >
                <div className="flex items-center gap-6">
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
                  className={`h-8 w-8 shrink-0 text-slate-400 transition-transform ${expandedPath === index ? "rotate-90" : ""
                    }`}
                />
              </button>

              {expandedPath === index && (
                <div className="border-t border-slate-800 bg-slate-950/50 p-6 lg:p-8">
                  <p className="mb-6 text-lg leading-relaxed text-slate-300">{pathway.description}</p>

                  {pathway.skills.length > 0 && (
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
                  )}

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

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-cyan-950/30 to-slate-950 p-8 text-center">
            <Clock className="mx-auto mb-4 h-12 w-12 text-cyan-400" />
            <p className="mb-2 text-4xl font-black text-white">{skillPack?.hours || '10-12'}h</p>
            <p className="text-slate-400">total estimé</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-indigo-950/30 to-slate-950 p-8 text-center">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-indigo-400" />
            <p className="mb-2 text-4xl font-black text-white">{skillPack?.courses_count || '5'}</p>
            <p className="text-slate-400">modules de formation</p>
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
