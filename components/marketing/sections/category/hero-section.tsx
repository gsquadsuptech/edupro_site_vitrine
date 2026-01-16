import { Code, Search, Globe, Briefcase, Building2, Users, Heart, TrendingUp, Palette, Languages, Monitor, Lightbulb, GraduationCap } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface CategoryHeroProps {
  categoryName?: string
  courseCount?: number
  categorySlug?: string
  categoryIcon?: string
}

const iconMapping: Record<string, any> = {
  'tech-digital': Code,
  'business-management': Briefcase,
  'construction-durable': Building2,
  'soft-skills': Users,
  'sante': Heart,
  'finance': TrendingUp,
  'design': Palette,
  'langues': Languages,
  'informatique': Monitor,
  'sciences': Lightbulb,
  'education': GraduationCap
}

export function CategoryHero({ categoryName, courseCount, categorySlug, categoryIcon }: CategoryHeroProps) {
  let Icon = Globe
  if (categorySlug && iconMapping[categorySlug]) {
    Icon = iconMapping[categorySlug]
  } else if (categoryIcon && iconMapping[categoryIcon]) {
    Icon = iconMapping[categoryIcon]
  }

  return (
    <section className="border-b border-border bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-blue-600/10 py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 p-4">
            <Icon className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-3 text-4xl font-bold md:text-5xl">{categoryName || "Catégorie"}</h1>
          <p className="mb-6 text-lg text-muted-foreground">
            {courseCount !== undefined ? `${courseCount} formations disponibles` : "Explorez nos formations"} pour maîtriser les compétences demandées
          </p>

          {/* Search in Category */}
          <div className="relative mx-auto max-w-2xl">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-2">
              <Search className="ml-2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={`Rechercher dans ${categoryName || "cette catégorie"}...`}
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button className="bg-gradient-to-r from-primary to-chart-2">Rechercher</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
