import { Code, Search, Globe, Briefcase, Building2, Users, Heart, TrendingUp, Palette, Languages, Monitor, Lightbulb, GraduationCap } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface CategoryHeroProps {
  categoryName?: string
  courseCount?: number
  categorySlug?: string
  categoryIcon?: string
  backgroundImage?: string | null
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

export function CategoryHero({ categoryName, courseCount, categorySlug, categoryIcon, backgroundImage }: CategoryHeroProps) {
  let Icon = Globe
  if (categorySlug && iconMapping[categorySlug]) {
    Icon = iconMapping[categorySlug]
  } else if (categoryIcon && iconMapping[categoryIcon]) {
    Icon = iconMapping[categoryIcon]
  }

  const hasImage = !!backgroundImage

  return (
    <section className={`relative overflow-hidden border-b border-border py-12 ${hasImage ? 'text-white' : 'bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-blue-600/10'}`}>
      {hasImage && (
        <div className="absolute inset-0 -z-10">
          <img src={backgroundImage!} alt={categoryName || "Catégorie"} className="h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-slate-900/40" />
        </div>
      )}
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 p-4">
            <Icon className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-3 text-4xl font-bold md:text-5xl">{categoryName || "Catégorie"}</h1>
          <p className={`mb-6 text-lg ${hasImage ? 'text-white/80' : 'text-muted-foreground'}`}>
            {courseCount !== undefined ? `${courseCount} formations disponibles` : "Explorez nos formations"} pour maîtriser les compétences demandées
          </p>

          {/* Search in Category */}
          <div className="relative mx-auto max-w-2xl">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-2">
              <Search className="ml-2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={`Rechercher dans ${categoryName || "cette catégorie"}...`}
                className="flex-1 border-0 bg-transparent text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button className="bg-gradient-to-r from-primary to-chart-2">Rechercher</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
