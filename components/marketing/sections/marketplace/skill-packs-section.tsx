"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { LearningPath } from "@/lib/supabase/types"

interface SkillPacksSectionProps {
  locale?: string
  skillPacks?: LearningPath[]
}

export function SkillPacksSection({ locale = 'fr', skillPacks = [] }: SkillPacksSectionProps) {
  const showSkeleton = !skillPacks || skillPacks.length === 0;

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
          {showSkeleton ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={`skeleton-pack-${index}`} className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-3/4 rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-2/3 rounded" />
                </div>
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="space-y-2 flex-grow">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="pt-4 border-t border-border">
                  <Skeleton className="h-8 w-1/3 mb-2" />
                  <Skeleton className="h-10 w-full rounded" />
                </div>
              </div>
            ))
          ) : (
            skillPacks.map((pack) => (
              <div key={pack.slug} className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col">
                <div className="mb-4">
                  <h3 className="mb-2 text-2xl font-bold">{pack.title}</h3>
                  <p className="text-muted-foreground line-clamp-2">{pack.description}</p>
                </div>

                <div className="mb-4 flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="font-semibold">{pack.courses_count}</span> formations
                  </div>
                  <div>
                    <span className="font-semibold">{pack.hours}h</span> de contenu
                  </div>
                  <div>
                    <span className="font-semibold">{pack.projects_count}</span> projets
                  </div>
                </div>

                <div className="mb-4 space-y-2 flex-grow">
                  {pack.highlights?.slice(0, 4).map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="line-clamp-1">{highlight}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-4 border-t border-border pt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{pack.price.toLocaleString()} FCFA</span>
                    {pack.original_price && pack.original_price > pack.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        {pack.original_price.toLocaleString()} FCFA
                      </span>
                    )}
                  </div>
                  {pack.original_price && pack.original_price > pack.price && (
                    <p className="text-xs text-muted-foreground">
                      Économisez {Math.round(((pack.original_price - pack.price) / pack.original_price) * 100)}%
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
            ))
          )}
        </div>
      </div>
    </section>
  )
}
