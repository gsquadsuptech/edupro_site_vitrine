import { CheckCircle2 } from "lucide-react"
import { Course } from "@/lib/supabase/types"

interface OverviewTabProps {
  course: Course
}

export function OverviewTab({ course }: OverviewTabProps) {
  // Données réelles du cours (saisies par le formateur à la création) :
  //  - objectives  → « Objectifs » de l'admin
  //  - highlights  → « Résultats attendus » (mappé depuis expected_results)
  //  - prerequisites → « Prérequis »
  // Auparavant ces listes étaient codées en dur (contenu IA/ML identique pour
  // tous les cours) ; on affiche désormais le contenu propre à chaque cours.
  const objectives = course.objectives ?? []
  const outcomes = course.highlights ?? []
  const prerequisites = course.prerequisites ?? []
  const hasDescription = !!course.description?.trim()

  return (
    <div className="space-y-8">
      {/* Ce que vous allez apprendre (objectifs) */}
      {objectives.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-xl font-bold">Ce que vous allez apprendre</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {objectives.map((point, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <span className="text-sm">{point}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description détaillée */}
      {hasDescription && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-xl font-bold">Description détaillée</h3>
          <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
            {course.description}
          </div>
        </div>
      )}

      {/* Résultats attendus */}
      {outcomes.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-xl font-bold">Résultats attendus</h3>
          <ul className="space-y-2">
            {outcomes.map((outcome, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Prérequis */}
      {prerequisites.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-xl font-bold">Prérequis</h3>
          <ul className="space-y-2">
            {prerequisites.map((prerequisite, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                <span>{prerequisite}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
