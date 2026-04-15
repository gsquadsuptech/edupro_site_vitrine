"use client"

import { Course, Cohort } from "@/lib/supabase/types"
import { getCohortAvailability } from "@/services/course-service"
import { WaitlistDialog } from "./waitlist-dialog"
import { EnrollCTA } from "./enroll-cta"

interface MobilePurchaseBarProps {
  course: Course
  cohorts: Cohort[]
}

export function MobilePurchaseBar({ course, cohorts }: MobilePurchaseBarProps) {
  const price = course.price || 0
  const isAutoFormation = course.format === 'auto-formation' || !course.format
  const hasOpenCohort = cohorts.some(c => getCohortAvailability(c).isOpen)
  const showEnrollButton = isAutoFormation || hasOpenCohort

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 p-4 backdrop-blur-lg lg:hidden shadow-[0_-8px_30px_rgb(0,0,0,0.12)]">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Prix</span>
          <span className="text-xl font-extrabold text-foreground">
            {price >= 1
              ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(Math.round(price))
              : "Gratuit"}
          </span>
        </div>
        {showEnrollButton ? (
          <div className="flex-1 sm:max-w-xs">
            <EnrollCTA
              courseId={course.id}
              enrollLabel="S'inscrire"
              buttonClassName="bg-gradient-to-r from-primary to-chart-2 text-base font-bold text-primary-foreground shadow-lg h-12"
            />
          </div>
        ) : (
          <div className="flex-1 sm:max-w-xs">
            <WaitlistDialog
              courseId={course.id}
              courseSlug={course.slug}
              courseTitle={course.title}
            />
          </div>
        )}
      </div>
    </div>
  )
}
