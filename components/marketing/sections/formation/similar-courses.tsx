import { Course } from "@/lib/supabase/types"
import { FormationCard } from "@/components/marketing/marketplace/formation-card"

interface SimilarCoursesProps {
  courses?: Course[]
}

export function SimilarCourses({ courses = [] }: SimilarCoursesProps) {
  // Le fetch est résolu côté serveur : aucune donnée = aucun cours similaire.
  // On masque entièrement la section plutôt que d'afficher un loader figé.
  if (!courses || courses.length === 0) {
    return null
  }

  return (
    <section className="border-t border-border py-16">
      <div className="container">
        <h2 className="mb-8 text-2xl font-bold md:text-3xl">Formations similaires</h2>
        <p className="mb-8 text-muted-foreground">Les apprenants ont aussi aimé</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => (
            <FormationCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  )
}
