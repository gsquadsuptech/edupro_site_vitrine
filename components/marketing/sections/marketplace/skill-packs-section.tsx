"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, ArrowRight } from "lucide-react"

interface SkillPacksSectionProps {
  locale?: string
}

export function SkillPacksSection({ locale = 'fr' }: SkillPacksSectionProps) {
  // Static Data
  const displayPacks = [
    {
      name: "Tech & Digital",
      slug: "tech-digital",
      description: "Maîtrisez les compétences digitales les plus demandées",
      courses: 15,
      hours: 80,
      projects: 3,
      price: 49000,
      originalPrice: 75000,
      highlights: ["IA & Machine Learning", "Data Science", "Développement Web", "Cloud Computing"],
      discount: 35
    },
    {
      name: "Business & Leadership",
      slug: "business-leadership",
      description: "Développez vos compétences en management et leadership",
      courses: 12,
      hours: 60,
      projects: 2,
      price: 39000,
      originalPrice: 60000,
      highlights: ["Leadership Stratégique", "Gestion d'Équipe", "Finance d'Entreprise", "Marketing"],
      discount: 35
    },
    {
      name: "Construction Durable",
      slug: "construction-durable",
      description: "Expertise en construction écologique et durable",
      courses: 10,
      hours: 50,
      projects: 3,
      price: 35000,
      originalPrice: 55000,
      highlights: ["Éco-construction", "Énergies Renouvelables", "Gestion de Projet", "Normes ISO"],
      discount: 36
    },
  ]

  return (
    <section className="bg-muted/30 py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <Badge className="mb-4 bg-accent text-accent-foreground">Parcours Complets</Badge>
          <h2 className="mb-3 text-3xl font-bold md:text-4xl">Skill Packs Disponibles</h2>
          <p className="text-lg text-muted-foreground">
            Des parcours structurés pour une montée en compétences complète
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayPacks.map((pack) => (
            <div key={pack.slug} className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col">
              <div className="mb-4">
                <h3 className="mb-2 text-2xl font-bold">{pack.name}</h3>
                <p className="text-muted-foreground line-clamp-2">{pack.description}</p>
              </div>

              <div className="mb-4 flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="font-semibold">{pack.courses}</span> formations
                </div>
                <div>
                  <span className="font-semibold">{pack.hours}h</span> de contenu
                </div>
                <div>
                  <span className="font-semibold">{pack.projects}</span> projets
                </div>
              </div>

              <div className="mb-4 space-y-2 flex-grow">
                {pack.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="line-clamp-1">{highlight}</span>
                  </div>
                ))}
              </div>

              <div className="mb-4 border-t border-border pt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{pack.price.toLocaleString()} FCFA</span>
                  {pack.discount > 0 && (
                    <span className="text-sm text-muted-foreground line-through">
                      {pack.originalPrice.toLocaleString()} FCFA
                    </span>
                  )}
                </div>
                {pack.discount > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Économisez {pack.discount}%
                  </p>
                )}
              </div>

              <Link href={`/${locale}/skill-pack/${pack.slug}`} className="mt-auto">
                <Button className="w-full bg-gradient-to-r from-primary to-chart-2 text-primary-foreground hover:opacity-90">
                  Découvrir le parcours
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
