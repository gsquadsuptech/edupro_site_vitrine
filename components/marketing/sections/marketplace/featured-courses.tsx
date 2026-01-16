"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FormationCard } from "@/components/marketing/marketplace/formation-card"

export function FeaturedCourses({ locale }: { locale?: string }) {
  // Mock Data
  const formattedCourses = Array(4).fill(null).map((_, i) => ({
    id: `feat-${i}`,
    slug: `cours-vedette-${i}`,
    title: `Formation Vedette ${i + 1}`,
    thumbnail: '/placeholder.svg',
    level: 'Avancé',
    price: 35000 + (i * 1000),
    monthlyPrice: 0,
    duration: '12h',
    category: 'Business',
    instructor: 'Expert Pro',
    rating: 4.8,
    reviewCount: 42,
    enrolledCount: 120
  }));

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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {formattedCourses.map((course: any) => (
            <FormationCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  )
}
