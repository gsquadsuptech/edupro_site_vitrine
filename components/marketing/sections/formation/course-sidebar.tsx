"use client"

import { CheckCircle2, Heart, Bookmark, Share2, Smartphone, Monitor, Trophy, Clock, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Course, Cohort } from "@/lib/supabase/types"
import { getCohortAvailability } from "@/services/course-service"
import { WaitlistDialog } from "./waitlist-dialog"
import { EnrollCTA } from "./enroll-cta"
import { CoursePriceDisplay } from "./course-price-display"

interface CourseSidebarProps {
  course: Course
  cohorts?: Cohort[]
}

export function CourseSidebar({ course, cohorts = [] }: CourseSidebarProps) {
  const isAutoFormation = course.format === 'auto-formation' || !course.format
  const hasOpenCohort = cohorts.some(c => getCohortAvailability(c).isOpen)
  const hasAnyCohort = cohorts.length > 0
  const showEnrollButton = isAutoFormation || hasOpenCohort
  const showWaitlist = !isAutoFormation && !hasOpenCohort

  // Count total lessons from sections
  const totalLessons = course.sections?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) || 0

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xl transition-all duration-300 hover:shadow-2xl">
      <CoursePriceDisplay course={course} variant="sidebar" className="mb-6" />

      <div className="space-y-4">
        {showWaitlist ? (
          <WaitlistDialog
            courseId={course.id}
            courseSlug={course.slug}
            courseTitle={course.title}
          />
        ) : (
          <EnrollCTA
            courseId={course.id}
            enrollLabel="S'inscrire maintenant"
            buttonClassName="h-14 bg-gradient-to-r from-primary to-chart-2 text-lg font-bold text-primary-foreground shadow-lg hover:opacity-90 transition-all duration-300 hover:translate-y-[-2px]"
          />
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 min-w-0 bg-transparent border-gray-200 hover:bg-muted/50 transition-colors text-xs sm:text-sm">
            <Heart className="mr-1.5 h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Favoris</span>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 min-w-0 bg-transparent border-gray-200 hover:bg-muted/50 transition-colors text-xs sm:text-sm">
            <Bookmark className="mr-1.5 h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Sauvegarder</span>
          </Button>
        </div>

        <Button variant="ghost" className="w-full text-muted-foreground hover:text-primary transition-colors">
          <Share2 className="mr-2 h-4 w-4" />
          Partager cette formation
        </Button>
      </div>

      <div className="mt-8 pt-6 border-t border-border/50">
        <h4 className="mb-4 font-bold text-foreground">Cette formation inclut :</h4>
        <div className="grid gap-3">
          <div className="flex items-center gap-3 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
              <Clock className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-foreground/80">{course.duration || "Durée flexible"}</span>
          </div>
          <div className="flex items-center gap-3 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
              <Globe className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-foreground/80">{course.sections?.length || 0} modules</span>
          </div>
          {totalLessons > 0 && (
            <div className="flex items-center gap-3 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-foreground/80">{totalLessons} leçons</span>
            </div>
          )}
          <div className="flex items-center gap-3 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
              <Smartphone className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-foreground/80">Accès mobile & desktop</span>
          </div>
          <div className="flex items-center gap-3 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
              <Trophy className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-foreground/80">Certificat de fin</span>
          </div>
          <div className="flex items-center gap-3 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
              <Monitor className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-foreground/80">Accès à vie</span>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5 text-primary transition-all">
          Offrir en cadeau
        </Button>
        <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5 text-primary transition-all">
          Acheter pour mon équipe
        </Button>
      </div>
    </div>
  )
}
