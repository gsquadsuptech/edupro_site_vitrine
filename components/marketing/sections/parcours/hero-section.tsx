import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Award, Star } from "lucide-react"
import { LearningPath } from "@/lib/supabase/types"
import { EnrollButton } from "@/components/payment/enroll-button"
import { ParcoursHeroMedia } from "@/components/marketing/sections/parcours/hero-media"

interface ParcoursHeroProps {
  learningPath: LearningPath
  locale: string
}

export function ParcoursHero({ learningPath, locale }: ParcoursHeroProps) {
  const totalHours = learningPath.hours
  const enrolled = learningPath.enrolled_count || 0
  const rating = learningPath.rating || 0
  const reviewCount = learningPath.reviewCount || 0
  const hasCertificate = !!(learningPath.enable_certificate || learningPath.certificate_template_id)

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50 py-20 lg:py-32">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-indigo-200 blur-3xl" />
        <div
          className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-fuchsia-200 blur-3xl"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="w-fit border-indigo-300 bg-indigo-100 text-indigo-700">Parcours</Badge>
                {learningPath.categories?.map((category) => (
                  <Badge
                    key={category.id}
                    variant="outline"
                    className="w-fit border-slate-300 bg-white/70 text-slate-700"
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>

              <h1 className="text-balance text-4xl font-bold leading-tight text-slate-900 lg:text-5xl xl:text-6xl">
                {learningPath.title}
              </h1>

              {(learningPath.short_description || learningPath.description) && (
                <p className="text-pretty text-xl leading-relaxed text-slate-700">
                  {learningPath.short_description || learningPath.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              {totalHours > 0 && (
                <div className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 shadow-sm">
                  <Clock className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm font-medium text-slate-900">{totalHours}h de formation</span>
                </div>
              )}
              {enrolled > 0 && (
                <div className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 shadow-sm">
                  <Users className="h-5 w-5 text-fuchsia-600" />
                  <span className="text-sm font-medium text-slate-900">{enrolled.toLocaleString('fr-FR')} apprenants</span>
                </div>
              )}
              {reviewCount > 0 && (
                <div className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 shadow-sm">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium text-slate-900">
                    {rating.toFixed(1)}/5 ({reviewCount} avis)
                  </span>
                </div>
              )}
              {hasCertificate && (
                <div className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 shadow-sm">
                  <Award className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-medium text-slate-900">Certifiant</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <EnrollButton
                target={{ kind: "learning_path", id: learningPath.id, slug: learningPath.slug }}
                locale={locale}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-lg font-semibold shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/40"
                >
                  S'inscrire maintenant
                </Button>
              </EnrollButton>
              <a href="#curriculum">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-300 bg-white text-lg font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                >
                  Voir le programme
                </Button>
              </a>
            </div>

            {hasCertificate && (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <Award className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Certification professionnelle</p>
                  <p className="text-sm text-slate-600">Délivrée à la complétion du parcours</p>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-2xl">
              <ParcoursHeroMedia
                imageUrl={learningPath.image_url || "/placeholder.svg"}
                title={learningPath.title}
                previewVideo={learningPath.preview_video}
              />

              {totalHours > 0 && (
                <div className="absolute -right-4 top-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                  <p className="text-sm font-semibold text-slate-900">{totalHours} heures</p>
                  <p className="text-xs text-slate-600">de formation</p>
                </div>
              )}

              {learningPath.courses_count > 0 && (
                <div className="absolute -left-4 bottom-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                  <p className="text-sm font-semibold text-slate-900">{learningPath.courses_count} cours</p>
                  <p className="text-xs text-slate-600">composent ce parcours</p>
                </div>
              )}
            </div>

            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-200 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-fuchsia-200 blur-2xl" />
          </div>
        </div>
      </Container>
    </section>
  )
}
