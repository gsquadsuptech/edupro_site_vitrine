

import { FormationCard } from "@/components/marketing/marketplace/formation-card"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

import { Course } from "@/lib/supabase/types"

interface SearchResultsProps {
  courses?: Course[]
}

export function SearchResults({ courses = [] }: SearchResultsProps) {
  // Static courses removed


  return (
    <div className="flex-1">
      {courses.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <FormationCard key={course.id} course={course} />
            ))}
          </div>

          {/* Load More */}
          <div className="mt-8 text-center">
            <Button size="lg" variant="outline">
              Charger plus de formations
            </Button>
          </div>
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Search className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-xl font-semibold">Aucune formation trouvée</h3>
      <p className="mb-6 text-muted-foreground">
        Essayez d'élargir vos critères de recherche ou explorez nos catégories
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <span className="text-sm text-muted-foreground">Suggestions:</span>
        <Button variant="outline" size="sm">
          Tech & Digital
        </Button>
        <Button variant="outline" size="sm">
          Business
        </Button>
        <Button variant="outline" size="sm">
          Santé
        </Button>
      </div>
    </div>
  )
}
