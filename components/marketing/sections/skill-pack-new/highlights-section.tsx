"use client"

import { Container } from "@/components/marketing/layout/container"
import { Zap, Target, Rocket, Shield } from "lucide-react"

import { LearningPath } from "@/lib/supabase/types"

interface SkillPackHighlightsProps {
  skillPack: LearningPath
}

export function SkillPackHighlights({ skillPack }: SkillPackHighlightsProps) {
  // Static Data
  let pathTitle = "Une nouvelle façon d'apprendre"
  let pathDesc = "Des formations pensées pour les professionnels africains"

  // Dynamic Data with Static Fallback for Icons/Colors
  const dynamicHighlights = skillPack.highlights?.map((text, index) => ({
    icon: [Zap, Target, Rocket, Shield][index % 4],
    title: "Point clé du programme", // Generic title since we only have strings in highlights
    description: text,
    color: ["from-cyan-500 to-blue-500", "from-indigo-500 to-purple-500", "from-fuchsia-500 to-pink-500", "from-pink-500 to-rose-500"][index % 4],
  })) || []

  const displayHighlights = dynamicHighlights.length > 0 ? dynamicHighlights : [
    {
      icon: Zap,
      title: "Apprendre vite, apprendre utile",
      description: "Modules courts de 2-3 semaines, 100% applicables dans votre travail quotidien",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: Target,
      title: "Apprendre par la pratique",
      description: "Études de cas réels, simulations interactives et projets professionnels concrets",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Rocket,
      title: "Apprendre avec impact",
      description: "Certifications co-signées EDUPRO × GALSENAI, vérifiables par QR code",
      color: "from-fuchsia-500 to-pink-500",
    },
    {
      icon: Shield,
      title: "Formation certifiante reconnue",
      description: "Reconnue par les entreprises africaines et les organisations internationales",
      color: "from-pink-500 to-rose-500",
    },
  ]

  return (
    <section className="relative border-b border-slate-800 py-20 lg:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-black text-white lg:text-5xl">{pathTitle}</h2>
          <p className="mx-auto max-w-3xl text-xl text-slate-400">
            {pathDesc}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {displayHighlights.map((highlight, index) => {
            const Icon = highlight.icon
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-10 transition-all duration-500 hover:border-slate-700 hover:shadow-2xl hover:shadow-indigo-500/20"
              >
                {/* Gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-0 transition-opacity duration-500 group-hover:opacity-5`}
                />

                <div className="relative">
                  {/* Icon */}
                  <div className={`mb-6 inline-flex rounded-2xl bg-gradient-to-r ${highlight.color} p-5 shadow-lg`}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="mb-4 text-2xl font-bold text-white">{highlight.title}</h3>
                  <p className="text-lg leading-relaxed text-slate-400">{highlight.description}</p>
                </div>

                {/* Decorative element */}
                <div
                  className={`absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br ${highlight.color} opacity-10 blur-3xl transition-opacity group-hover:opacity-20`}
                />
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
