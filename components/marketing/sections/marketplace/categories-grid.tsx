"use client"

import Link from "next/link"
import { Code, Briefcase, Building2, Users, Heart, TrendingUp, Palette, Languages, Globe, Monitor, GraduationCap, Lightbulb } from "lucide-react"

interface CategoriesGridProps {
  locale?: string
}

const staticCategories = [
  { name: "Tech & Digital", icon: Code, count: 120, slug: "tech-digital", color: "from-blue-500 to-cyan-500" },
  { name: "Business & Management", icon: Briefcase, count: 85, slug: "business-management", color: "from-purple-500 to-pink-500" },
  { name: "Construction Durable", icon: Building2, count: 45, slug: "construction-durable", color: "from-green-500 to-emerald-500" },
  { name: "Soft Skills", icon: Users, count: 90, slug: "soft-skills", color: "from-orange-500 to-red-500" },
  { name: "Santé", icon: Heart, count: 30, slug: "sante", color: "from-red-500 to-pink-500" },
  { name: "Finance", icon: TrendingUp, count: 40, slug: "finance", color: "from-yellow-500 to-orange-500" },
  { name: "Design", icon: Palette, count: 50, slug: "design", color: "from-pink-500 to-purple-500" },
  { name: "Langues", icon: Languages, count: 60, slug: "langues", color: "from-indigo-500 to-blue-500" }
]

export function CategoriesGrid({ locale = 'fr' }: CategoriesGridProps) {

  return (
    <section className="py-16 md:py-20" id="categories-grid">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold md:text-4xl">Explorez par Catégorie</h2>
          <p className="text-lg text-muted-foreground">Trouvez la formation qui correspond à vos objectifs</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {staticCategories.map((category, index) => (
            <Link key={`${category.slug}-${index}`} href={`/${locale}/catalogue/all?category=${category.slug}`}>
              <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg">
                <div className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${category.color} p-3`}>
                  <category.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold group-hover:text-primary">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count} cours</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
