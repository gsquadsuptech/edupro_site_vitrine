"use client"

import { Star, Users, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Course } from "@/lib/supabase/types"

interface FormationHeroProps {
  course: Course
}

export function FormationHero({ course }: FormationHeroProps) {
  // Safe access / Fallbacks
  const instructorName = course.instructor?.institute || course.instructor?.name || "Instructeur"
  const categoryName = course.category?.name || "Général"

  const reviews = course.reviews || []
  const reviewCount = reviews.length
  // Fallback rating if no reviews
  const rating = course.rating || (reviewCount > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviewCount
    : 0)

  return (
    <section className="py-8">
      {/* Video Preview */}
      <div className="mb-8 aspect-video overflow-hidden rounded-2xl border border-border bg-black shadow-2xl">
        {course.preview_video ? (
          <div className="relative flex h-full items-center justify-center bg-muted group cursor-pointer">
            {course.image_url && (
              <img 
                src={course.image_url} 
                alt={course.title} 
                className="h-full w-full object-cover opacity-70 transition-all duration-500 group-hover:opacity-40 group-hover:scale-105" 
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/40">
              <Button size="lg" className="h-20 w-20 rounded-full bg-primary/90 text-primary-foreground shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-primary" variant="secondary">
                <Play className="h-10 w-10 ml-1.5" fill="currentColor" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative h-full w-full bg-muted/50">
            {course.image_url ? (
              <img src={course.image_url} alt={course.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-muted/30">
                <div className="flex flex-col items-center gap-2">
                  <Play className="h-12 w-12 opacity-20" />
                  <span className="font-medium">Pas d'aperçu vidéo</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Title & Meta Info Card */}
      <div className="space-y-6">
        <div>
          <div className="mb-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1">
              {categoryName}
            </Badge>
            <Badge variant="outline" className="px-3 py-1 border-border bg-muted/30">
              {(() => {
                const labels: Record<string, string> = {
                  'beginner': 'Débutant',
                  'intermediate': 'Intermédiaire',
                  'high': 'Avancé'
                }
                return labels[course.level || ''] || course.level || 'Tous niveaux'
              })()}
            </Badge>
          </div>

          <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl text-foreground">
            {course.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-sm md:text-base">
            <div className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted shadow-inner group-hover:bg-primary/10 transition-colors">
                <Users className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <span className="font-medium text-foreground/80">{course.enrolled_count || 0} apprenants</span>
            </div>
            
            <div className="flex items-center gap-2 group border-l border-border/50 pl-6">
              <span className="text-muted-foreground italic">Par <strong className="text-foreground not-italic group-hover:text-primary transition-colors cursor-pointer">{instructorName}</strong></span>
            </div>

            <div className="flex items-center gap-2 border-l border-border/50 pl-6">
              <div className="flex items-center bg-yellow-400/10 px-2 py-0.5 rounded-lg">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "fill-border text-border"}`}
                  />
                ))}
                <span className="ml-2 font-bold text-yellow-600">{rating.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground text-xs font-medium">({reviewCount} avis)</span>
            </div>
          </div>
        </div>

        <p className="max-w-3xl text-lg md:text-xl text-muted-foreground leading-relaxed">
          {course.description}
        </p>
      </div>
    </section>
  )
}
