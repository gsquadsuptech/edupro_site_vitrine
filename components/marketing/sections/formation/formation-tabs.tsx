"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewTab } from "./tabs/overview-tab"
import { CurriculumTab } from "./tabs/curriculum-tab"
import { InstitutTab } from "./tabs/institut-tab"
import { FormateurTab } from "./tabs/formateur-tab"
import { ReviewsTab } from "./tabs/reviews-tab"
import { SessionsTab } from "./tabs/sessions-tab"
import { Course, Cohort } from "@/lib/supabase/types"

interface FormationTabsProps {
  course: Course & { rating?: number; reviewCount?: number }
  cohorts?: Cohort[]
}

const GRID_COLS: Record<number, string> = {
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
}

export function FormationTabs({ course, cohorts = [] }: FormationTabsProps) {
  const hasCohorts = cohorts && cohorts.length > 0
  // Onglet "Formateur(s)" pour les cours à sessions/cohortes dès qu'il existe
  // un formateur réel : soit assigné directement au cours, soit rattaché à au
  // moins une cohorte/session. Pour l'auto-formation (autonome), on n'affiche
  // que l'onglet "Institut" (toujours présent).
  const isSessionCourse = course.format === 'session'
  const hasDirectFormateur = !!course.instructor && !course.instructor.is_institute
  const hasCohortFormateurs = cohorts.some(c => (c.instructors?.length ?? 0) > 0)
  const hasFormateur = isSessionCourse && (hasDirectFormateur || hasCohortFormateurs)

  // Onglet "Sessions" pour tout cours au format session — y compris quand aucune
  // session n'est encore créée : SessionsTab affiche alors l'état vide avec la
  // liste d'attente. L'auto-formation n'a pas cet onglet.
  const showSessionsTab = isSessionCourse || hasCohorts

  const tabCount = 4 + (showSessionsTab ? 1 : 0) + (hasFormateur ? 1 : 0)
  const gridCols = GRID_COLS[tabCount] || "grid-cols-4"

  return (
    <section className="py-12">
      <Tabs defaultValue="apercu" className="w-full">
        <div className="sticky top-[88px] z-20 bg-background/95 backdrop-blur-md pb-4 pt-2 -mx-2 px-2 border-b border-border/50">
          <TabsList className={`grid w-full ${gridCols} lg:w-max bg-muted/50 p-1 rounded-xl`}>
            <TabsTrigger value="apercu" className="rounded-lg text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">Aperçu</TabsTrigger>
            {showSessionsTab && <TabsTrigger value="sessions" className="rounded-lg text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">Sessions</TabsTrigger>}
            <TabsTrigger value="programme" className="rounded-lg text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">Programme</TabsTrigger>
            <TabsTrigger value="institut" className="rounded-lg text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">Institut</TabsTrigger>
            {hasFormateur && <TabsTrigger value="formateur" className="rounded-lg text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">Formateur(s)</TabsTrigger>}
            <TabsTrigger value="avis" className="rounded-lg text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">Avis</TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <TabsContent value="apercu" className="focus-visible:outline-none">
            <OverviewTab course={course} />
          </TabsContent>

          {showSessionsTab && (
            <TabsContent value="sessions" className="focus-visible:outline-none">
              <SessionsTab course={course} cohorts={cohorts} />
            </TabsContent>
          )}

          <TabsContent value="programme" className="focus-visible:outline-none">
            <CurriculumTab course={course} />
          </TabsContent>

          <TabsContent value="institut" className="focus-visible:outline-none">
            <InstitutTab course={course} />
          </TabsContent>

          {hasFormateur && (
            <TabsContent value="formateur" className="focus-visible:outline-none">
              <FormateurTab course={course} cohorts={cohorts} />
            </TabsContent>
          )}

          <TabsContent value="avis" className="focus-visible:outline-none">
            <ReviewsTab reviews={course.reviews as any} />
          </TabsContent>
        </div>
      </Tabs>
    </section>
  )
}
