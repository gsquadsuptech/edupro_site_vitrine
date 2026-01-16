"use client"

import Link from "next/link"
import { Code } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Category } from "@/lib/supabase/types"

interface CategoriesGridProps {
  locale?: string
  categories: Category[]
}

export function CategoriesGrid({ locale = 'fr', categories }: CategoriesGridProps) {
  const displayCategories = categories || [];
  const showSkeleton = displayCategories.length === 0;

  return (
    <section className="py-16 md:py-20" id="categories-grid">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold md:text-4xl">Explorez par Catégorie</h2>
          <p className="text-lg text-muted-foreground">Trouvez la formation qui correspond à vos objectifs</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {showSkeleton ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="flex items-center space-x-4 rounded-xl border p-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </div>
            ))
          ) : (
            displayCategories.map((category, index) => {
              // Fallback/Mapping for icons and colors
              const colors = [
                "from-blue-500 to-cyan-500", "from-purple-500 to-pink-500", "from-green-500 to-emerald-500",
                "from-orange-500 to-red-500", "from-red-500 to-pink-500", "from-yellow-500 to-orange-500",
                "from-pink-500 to-purple-500", "from-indigo-500 to-blue-500"
              ];
              const color = colors[index % colors.length];
              const Icon = Code;

              return (
                <Link key={`${category.slug}-${index}`} href={`/${locale}/catalogue/all?category=${category.slug}`}>
                  <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg">
                    <div className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${color} p-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold group-hover:text-primary">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.courses_count || 0} cours</p>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}
