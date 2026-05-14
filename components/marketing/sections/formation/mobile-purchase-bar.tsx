"use client"

import { Course, Cohort } from "@/lib/supabase/types"
import { getCohortAvailability } from "@/services/course-service"
import { pickDisplayCohort } from "@/lib/pricing"
import { WaitlistDialog } from "./waitlist-dialog"
import { EnrollCTA } from "./enroll-cta"
import { CoursePriceDisplay } from "./course-price-display"

interface MobilePurchaseBarProps {
  course: Course
  cohorts: Cohort[]
}

export function MobilePurchaseBar({ course, cohorts }: MobilePurchaseBarProps) {
  const isAutoFormation = course.format === 'auto-formation' || !course.format
  const hasOpenCohort = cohorts.some(c => getCohortAvailability(c).isOpen)
  const showEnrollButton = isAutoFormation || hasOpenCohort
  const displayCohort = pickDisplayCohort(cohorts)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 p-4 backdrop-blur-lg lg:hidden shadow-[0_-8px_30px_rgb(0,0,0,0.12)]">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <CoursePriceDisplay course={course} cohort={displayCohort} variant="compact" className="shrink-0" />
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
