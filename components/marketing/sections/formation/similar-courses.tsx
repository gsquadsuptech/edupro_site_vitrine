import { Course } from "@/lib/supabase/types"
import { FormationCard } from "@/components/marketing/sections/marketplace/formation-card"
import { Skeleton } from "@/components/ui/skeleton"

interface SimilarCoursesProps {
  courses?: Course[]
}

export function SimilarCourses({ courses = [] }: SimilarCoursesProps) {
  // If no courses (or empty array), show skeletons as requested
  const showSkeletons = courses.length === 0
  const displayCourses = showSkeletons ? Array(4).fill(null) : courses

  return (
    <section className="border-t border-border py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-bold md:text-3xl">Formations similaires</h2>
        <p className="mb-8 text-muted-foreground">Les apprenants ont aussi aimé</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {showSkeletons
            ? displayCourses.map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))
            : courses.map((course) => (
              <FormationCard key={course.id || 'skeleton'} course={course} />
            ))
          }
        </div>
      </div>
    </section>
  )
}
