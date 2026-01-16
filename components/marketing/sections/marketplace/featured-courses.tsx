"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FormationCard } from "@/components/marketing/marketplace/formation-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Course } from "@/lib/supabase/types"

interface FeaturedCoursesProps {
  locale?: string
  courses: Course[]
  isLoading?: boolean
}

export function FeaturedCourses({ locale, courses, isLoading = false }: FeaturedCoursesProps) {
  const displayCourses = courses || [];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Formations à la une</h2>
            <p className="text-muted-foreground text-lg">
              Découvrez nos formations les plus populaires, plébiscitées par la communauté pour leur qualité et leur impact professionnel.
            </p>
          </div>
          <Link href={`/${locale || 'fr'}/catalogue/all`}>
            <Button variant="outline" size="lg">Voir tout le catalogue</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="flex flex-col space-y-3">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : displayCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucune formation en vedette pour le moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {displayCourses.map((course) => (
              <FormationCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
