import { Star, Users, BookOpen, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Course } from "@/lib/supabase/types"

interface FormateurTabProps {
  course: Course
}

/**
 * Onglet « Formateur(s) » — affiché uniquement lorsqu'un formateur réel est
 * assigné (instructor non-institut). Jamais de valeur vide / "Instructeur".
 */
export function FormateurTab({ course }: FormateurTabProps) {
  const instructor = course.instructor
  // Garde : ne rien rendre si aucun formateur réel (l'onglet ne devrait pas
  // être affiché dans ce cas).
  if (!instructor || instructor.is_institute) return null

  const expertise = instructor.specialization
    ? instructor.specialization.split(/[,;]/).map(s => s.trim()).filter(Boolean)
    : []

  const hasStats =
    (instructor.rating || 0) > 0 ||
    (instructor.students_count || 0) > 0 ||
    (instructor.courses_count || 0) > 0

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex flex-col gap-6 md:flex-row">
        {instructor.avatar_url ? (
          <img src={instructor.avatar_url} alt={instructor.name} className="h-32 w-32 rounded-full object-cover" />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Users className="h-12 w-12" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="mb-2 text-2xl font-bold">{instructor.name}</h3>
          {instructor.specialization && (
            <p className="mb-3 text-muted-foreground">{instructor.specialization}</p>
          )}

          {hasStats && (
            <div className="mb-4 flex flex-wrap gap-4 text-sm">
              {(instructor.rating || 0) > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{instructor.rating}</span>
                  <span className="text-muted-foreground">note moyenne</span>
                </div>
              )}
              {(instructor.students_count || 0) > 0 && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{instructor.students_count?.toLocaleString()}</span>
                  <span className="text-muted-foreground">étudiants</span>
                </div>
              )}
              {(instructor.courses_count || 0) > 0 && (
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{instructor.courses_count}</span>
                  <span className="text-muted-foreground">formations</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {instructor.bio && (
          <div>
            <h4 className="mb-2 font-semibold">Biographie</h4>
            <p className="whitespace-pre-line text-sm text-muted-foreground">{instructor.bio}</p>
          </div>
        )}

        {expertise.length > 0 && (
          <div>
            <h4 className="mb-2 font-semibold">Expertise & Domaines</h4>
            <div className="flex flex-wrap gap-2">
              {expertise.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        )}

        {instructor.website_url && (
          <div>
            <h4 className="mb-2 font-semibold">Site web</h4>
            <Button size="sm" variant="outline" asChild>
              <a href={instructor.website_url} target="_blank" rel="noopener noreferrer">
                <Globe className="mr-2 h-4 w-4" />
                Visiter le site
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
