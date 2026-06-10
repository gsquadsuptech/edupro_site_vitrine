import { Globe, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Course } from "@/lib/supabase/types"

interface InstitutTabProps {
  course: Course
}

/**
 * Onglet « Institut » — toujours affiché. Présente l'institut (organisation)
 * propriétaire du cours/parcours.
 */
export function InstitutTab({ course }: InstitutTabProps) {
  // L'institut est l'organisation propriétaire ; fallback sur l'institut résolu
  // côté instructor (même valeur) si l'embed organisation est absent.
  const org = course.organization
  const name = org?.name || course.instructor?.institute || null

  if (!name) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center text-muted-foreground">
        Les informations sur l'institut ne sont pas encore disponibles.
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex flex-col gap-6 md:flex-row">
        {org?.logo_url ? (
          <img src={org.logo_url} alt={name} className="h-32 w-32 rounded-2xl object-cover" />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Building2 className="h-12 w-12" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="mb-2 text-2xl font-bold">{name}</h3>
          <p className="mb-3 text-muted-foreground">Institut de formation</p>
        </div>
      </div>

      <div className="space-y-4">
        {org?.description && (
          <div>
            <h4 className="mb-2 font-semibold">À propos de l'institut</h4>
            <p className="whitespace-pre-line text-sm text-muted-foreground">{org.description}</p>
          </div>
        )}

        {org?.website_url && (
          <div>
            <h4 className="mb-2 font-semibold">Site web</h4>
            <Button size="sm" variant="outline" asChild>
              <a href={org.website_url} target="_blank" rel="noopener noreferrer">
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
