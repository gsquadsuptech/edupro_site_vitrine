import { Star, Users, BookOpen, Globe, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Course } from "@/lib/supabase/types"

interface InstructorTabProps {
  course: Course
}

export function InstructorTab({ course }: InstructorTabProps) {
  const instructor = course.instructor
  const isInstitute = !!instructor?.is_institute

  // Aucun formateur ni institut résolus : état vide propre.
  if (!instructor) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center text-muted-foreground">
        Les informations sur le formateur ne sont pas encore disponibles.
      </div>
    )
  }

  const displayName = isInstitute ? (instructor.institute || instructor.name) : instructor.name
  const roleLabel = isInstitute
    ? "Institut de formation"
    : (instructor.specialization || "Formateur")

  // Expertises depuis la spécialisation (liste séparée par virgules/points-virgules).
  const expertise = !isInstitute && instructor.specialization
    ? instructor.specialization.split(/[,;]/).map(s => s.trim()).filter(Boolean)
    : []

  const bio = instructor.bio || course.organization?.description || null
  const websiteUrl = isInstitute
    ? (course.organization?.website_url || instructor.website_url)
    : null

  const hasStats = !isInstitute && (
    (instructor.rating || 0) > 0 ||
    (instructor.students_count || 0) > 0 ||
    (instructor.courses_count || 0) > 0
  )

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-6 flex flex-col gap-6 md:flex-row">
          {instructor.avatar_url ? (
            <img
              src={instructor.avatar_url}
              alt={displayName}
              className="h-32 w-32 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary/10 text-primary">
              {isInstitute ? <Building2 className="h-12 w-12" /> : <Users className="h-12 w-12" />}
            </div>
          )}
          <div className="flex-1">
            <h3 className="mb-2 text-2xl font-bold">{displayName}</h3>
            <p className="mb-3 text-muted-foreground">{roleLabel}</p>

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
          {bio && (
            <div>
              <h4 className="mb-2 font-semibold">{isInstitute ? "À propos de l'institut" : "Biographie"}</h4>
              <p className="whitespace-pre-line text-sm text-muted-foreground">{bio}</p>
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

          {websiteUrl && (
            <div>
              <h4 className="mb-2 font-semibold">Site web</h4>
              <Button size="sm" variant="outline" asChild>
                <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                  <Globe className="mr-2 h-4 w-4" />
                  Visiter le site
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
