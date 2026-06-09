"use client"

import { Calendar, Users, CheckCircle2, XCircle, AlertTriangle, GraduationCap } from "lucide-react"
import { Cohort, Course } from "@/lib/supabase/types"
import { getCohortAvailability } from "@/services/course-service"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { WaitlistDialog } from "../waitlist-dialog"
import { EnrollCTA } from "../enroll-cta"

interface SessionsTabProps {
  course: Course
  cohorts: Cohort[]
}

export function SessionsTab({ course, cohorts }: SessionsTabProps) {
  if (!cohorts || cohorts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-xl border border-dashed border-muted">
        <Calendar className="h-8 w-8 text-muted-foreground mb-3" />
        <h3 className="text-lg font-bold">Aucune session disponible</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
          Inscrivez-vous à la liste d'attente pour être informé en priorité.
        </p>
        <div className="mt-4">
          <WaitlistDialog
            courseId={course.id}
            courseSlug={course.slug}
            courseTitle={course.title}
          />
        </div>
      </div>
    )
  }

  const sortedCohorts = [...cohorts].sort((a, b) => {
    if (!a.start_date) return 1;
    if (!b.start_date) return -1;
    return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
  });

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-bold text-foreground">Sessions & Cohortes</h3>
        <p className="text-muted-foreground text-base mt-1">
          Sélectionnez la session qui vous convient le mieux pour commencer votre apprentissage.
        </p>
      </div>

      <div className="space-y-3">
        {sortedCohorts.map((cohort) => {
          const price = course.access_type === 'free'
            ? 0
            : cohort.use_course_price
              ? (course.one_time_price || course.price || 0)
              : (cohort.one_time_price || 0);

          const { isOpen, isFull, isDeadlinePassed, remainingPlaces } = getCohortAvailability(cohort);

          return (
            <div
              key={cohort.id}
              className={`rounded-xl border overflow-hidden transition-all ${
                isOpen
                  ? 'border-border bg-card hover:shadow-md hover:border-primary/20'
                  : 'border-dashed border-muted-foreground/30 bg-muted/30 opacity-75 grayscale-[30%]'
              }`}
            >
              {/* Top row: status + cohort name + price */}
              <div className={`flex items-center justify-between gap-3 px-4 py-3 border-b ${isOpen ? 'border-border/50 bg-muted/20' : 'border-muted-foreground/20 bg-muted/40'}`}>
                <div className="flex items-center gap-2 min-w-0">
                  {isOpen ? (
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-2 py-0.5 text-xs font-semibold dark:bg-emerald-900/30 dark:text-emerald-400 shrink-0">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Ouvert
                    </Badge>
                  ) : isFull ? (
                    <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100 border-none px-2 py-0.5 text-xs font-semibold dark:bg-red-900/30 dark:text-red-400 shrink-0">
                      <XCircle className="mr-1 h-3 w-3" />
                      Complet
                    </Badge>
                  ) : isDeadlinePassed ? (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-none px-2 py-0.5 text-xs font-semibold dark:bg-gray-800 dark:text-gray-400 shrink-0">
                      <XCircle className="mr-1 h-3 w-3" />
                      Fermé
                    </Badge>
                  ) : null}
                  {cohort.name && (
                    <span className="text-base font-semibold text-foreground truncate">
                      {cohort.name}
                    </span>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xl font-black text-foreground">
                    {price >= 1
                      ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(price).replace('XOF', 'FCFA')
                      : "Gratuit"}
                  </span>
                </div>
              </div>

              {/* Bottom row: dates + places + action */}
              <div className="px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 flex-1 text-sm text-foreground/80">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary shrink-0" />
                    <span>
                      {cohort.start_date
                        ? format(new Date(cohort.start_date), 'dd MMM yyyy', { locale: fr })
                        : "À venir"}
                      {cohort.end_date && (
                        <> → {format(new Date(cohort.end_date), 'dd MMM yyyy', { locale: fr })}</>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className={`h-4 w-4 shrink-0 ${isFull ? 'text-red-500' : 'text-orange-500'}`} />
                    <span>
                      <span className={`font-semibold ${isFull ? 'text-red-600' : 'text-foreground'}`}>
                        {cohort.current_students_count}
                      </span>
                      {cohort.max_students != null && <> / {cohort.max_students}</>}
                      {" "}inscrits
                    </span>
                  </div>

                  {cohort.instructors && cohort.instructors.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {cohort.instructors.slice(0, 3).map((ins, i) => (
                          ins.avatar_url ? (
                            <img
                              key={i}
                              src={ins.avatar_url}
                              alt={ins.name}
                              className="h-6 w-6 rounded-full border-2 border-card object-cover"
                            />
                          ) : (
                            <div key={i} className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-primary/10 text-[10px] font-semibold text-primary">
                              {ins.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                          )
                        ))}
                      </div>
                      <span className="text-foreground/80">
                        {cohort.instructors.map(i => i.name).filter(Boolean).join(', ')}
                      </span>
                    </div>
                  ) : course.instructor && (
                    <div className="flex items-center gap-2 text-foreground/70">
                      <GraduationCap className="h-4 w-4 shrink-0 text-primary" />
                      <span>
                        {course.instructor.is_institute
                          ? (course.instructor.institute || course.instructor.name)
                          : course.instructor.name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="shrink-0 sm:w-auto">
                  {isOpen ? (
                    <EnrollCTA
                      courseId={course.id}
                      cohortId={cohort.id}
                      enrollLabel="S'inscrire"
                      buttonClassName="font-semibold"
                      showArrow
                    />
                  ) : (
                    <WaitlistDialog
                      courseId={course.id}
                      courseSlug={course.slug}
                      courseTitle={course.title}
                      cohortId={isFull && cohort.enable_waitlist ? cohort.id : undefined}
                    />
                  )}
                </div>
              </div>

              {/* Alert only for full sessions */}
              {isFull && (
                <div className="px-4 pb-3">
                  <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    {cohort.enable_waitlist
                      ? "Session complète — inscrivez-vous sur la liste d'attente."
                      : "Session complète."}
                  </p>
                </div>
              )}
              {isDeadlinePassed && !isFull && (
                <div className="px-4 pb-3">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    Date limite d'inscription dépassée.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  )
}
