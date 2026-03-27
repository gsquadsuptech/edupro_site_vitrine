"use client"

import { Calendar, Users, ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Cohort, Course } from "@/lib/supabase/types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"

interface SessionsTabProps {
  course: Course
  cohorts: Cohort[]
}

export function SessionsTab({ course, cohorts }: SessionsTabProps) {
  if (!cohorts || cohorts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <Calendar className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold">Aucune session disponible</h3>
        <p className="mt-2 text-muted-foreground">
          Inscrivez-vous à la liste d'attente pour être informé des prochaines sessions.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-bold">Sessions disponibles pour {course.title}</h3>
        <p className="text-muted-foreground">
          Choisissez la session qui vous convient le mieux et réservez votre place dès maintenant.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        {cohorts.map((cohort) => (
          <div key={cohort.id} className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md hover:border-primary/50">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* Session Info */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
                {/* Dates */}
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-lg bg-primary/10 p-2 text-primary">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Dates de formation</div>
                    <div className="font-semibold text-foreground">
                      {cohort.start_date ? format(new Date(cohort.start_date), 'dd MMMM yyyy', { locale: fr }) : "À définir"}
                      {cohort.end_date && ` — ${format(new Date(cohort.end_date), 'dd MMMM yyyy', { locale: fr })}`}
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-lg bg-accent/10 p-2 text-accent">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Disponibilité</div>
                    <div className="font-semibold text-foreground">
                      {cohort.max_students ? (
                        <>
                          <span className="text-primary">{cohort.max_students}</span> places au total
                        </>
                      ) : (
                        "Places limitées"
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="hidden lg:block">
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Inscriptions ouvertes
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between border-t border-border pt-4 lg:border-none lg:pt-0">
                <div className="lg:text-right">
                  <div className="text-sm font-medium text-muted-foreground">Tarif session</div>
                  <div className="text-2xl font-bold text-foreground">
                    {(() => {
                      const price = cohort.use_course_price 
                        ? (course.one_time_price || course.price || 0)
                        : (cohort.one_time_price || 0);
                      
                      return price >= 1
                        ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(price)
                        : "Gratuit";
                    })()}
                  </div>
                </div>
                
                <Link href={`/checkout/${course.id}?cohort=${cohort.id}`}>
                  <Button className="ml-4 bg-primary text-primary-foreground hover:bg-primary/90">
                    Réserver <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
