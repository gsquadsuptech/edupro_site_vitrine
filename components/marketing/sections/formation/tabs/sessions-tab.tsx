"use client"

import { Calendar, Users, ArrowRight, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Cohort, Course } from "@/lib/supabase/types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface SessionsTabProps {
  course: Course
  cohorts: Cohort[]
}

export function SessionsTab({ course, cohorts }: SessionsTabProps) {
  if (!cohorts || cohorts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-3xl border-2 border-dashed border-muted">
        <div className="mb-6 rounded-2xl bg-background p-5 shadow-sm">
          <Calendar className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-bold tracking-tight">Aucune session disponible</h3>
        <p className="mt-3 text-muted-foreground max-w-sm mx-auto">
          Nous préparons de nouvelles dates. Inscrivez-vous à la liste d'attente pour être informé en priorité.
        </p>
        <Button variant="outline" className="mt-8 rounded-full px-8">
          M'avertir des prochaines sessions
        </Button>
      </div>
    )
  }

  // Sort cohorts by start date
  const sortedCohorts = [...cohorts].sort((a, b) => {
    if (!a.start_date) return 1;
    if (!b.start_date) return -1;
    return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-3">
        <h3 className="text-2xl font-bold tracking-tight text-foreground">
          Sessions & Cohortes
        </h3>
        <p className="text-muted-foreground text-lg">
          Sélectionnez la session qui vous convient le mieux pour commencer votre apprentissage.
        </p>
      </div>

      <div className="grid gap-6">
        {sortedCohorts.map((cohort) => {
          const price = cohort.use_course_price 
            ? (course.one_time_price || course.price || 0)
            : (cohort.one_time_price || 0);

          return (
            <div 
              key={cohort.id} 
              className="group relative flex flex-col md:flex-row items-stretch gap-0 overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20"
            >
              {/* Left side: Date Focus */}
              <div className="flex flex-col items-center justify-center p-6 bg-muted/30 md:w-48 border-b md:border-b-0 md:border-r border-border group-hover:bg-primary/5 transition-colors">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Début</div>
                <div className="text-3xl font-black text-foreground">
                  {cohort.start_date ? format(new Date(cohort.start_date), 'dd') : "--"}
                </div>
                <div className="text-sm font-bold text-primary text-center">
                  {cohort.start_date ? format(new Date(cohort.start_date), 'MMMM yyyy', { locale: fr }) : "À venir"}
                </div>
              </div>

              {/* Middle: Details */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-center gap-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1 font-semibold dark:bg-emerald-900/30 dark:text-emerald-400">
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                    Inscriptions ouvertes
                  </Badge>
                  {cohort.name && (
                    <span className="text-sm font-medium text-muted-foreground border-l border-border pl-3">
                      {cohort.name}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-tight">Fin prévue</div>
                      <div className="font-bold">
                        {cohort.end_date ? format(new Date(cohort.end_date), 'dd MMMM yyyy', { locale: fr }) : "À définir"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-tight">Places disponibles</div>
                      <div className="font-bold">
                        {cohort.max_students ? (
                          <>
                            <span className="text-primary">{cohort.max_students}</span> places <span className="text-muted-foreground font-normal text-sm">/ session</span>
                          </>
                        ) : (
                          "Places limitées"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side: Pricing & Action */}
              <div className="p-6 md:p-8 md:w-72 bg-muted/10 flex flex-col items-center justify-center gap-4 border-t md:border-t-0 md:border-l border-border">
                <div className="text-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Investissement</span>
                  <div className="text-3xl font-black text-foreground">
                    {price >= 1
                      ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(price).replace('XOF', 'FCFA')
                      : "Gratuit"}
                  </div>
                </div>

                <Link href={`/checkout/${course.id}?cohort=${cohort.id}`} className="w-full">
                  <Button className="w-full rounded-xl py-6 font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                    S'inscrire <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

