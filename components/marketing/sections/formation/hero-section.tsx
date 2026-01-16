import { Star, Users, CheckCircle2, Heart, Bookmark, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface FormationHeroProps {
  course: any
}

export function FormationHero({ course }: FormationHeroProps) {
  // Safe access
  const marketplace = course?.marketplace_courses || {}
  const instructor = course?.instructors || {}
  const category = course?.categories?.name || "Général"
  const price = course?.price || 0
  const monthlyPrice = course?.monthly_price
  const rating = parseFloat(marketplace.rating) || 0
  const reviewCount = marketplace.review_count || 0

  return (
    <section className="py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Video & Info */}
          <div className="lg:col-span-2">
            {/* Video Preview */}
            <div className="mb-6 aspect-video overflow-hidden rounded-xl border border-border bg-black">
              {course?.preview_video ? (
                <video controls className="h-full w-full object-cover">
                  <source src={course.preview_video} type="video/mp4" />
                  Votre navigateur ne supporte pas la vidéo.
                </video>
              ) : (
                <div className="relative flex h-full items-center justify-center bg-muted">
                  {course?.thumbnail && <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover opacity-50" />}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button size="lg" className="h-16 w-16 rounded-full" variant="secondary">
                      <svg className="h-8 w-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Title & Meta */}
            <div className="mb-4">
              <h1 className="mb-3 text-3xl font-bold leading-tight md:text-4xl">
                {course?.title || "Titre de la formation"}
              </h1>

              <div className="mb-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{instructor.name || "Instructeur"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">({reviewCount} avis)</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{category}</Badge>
                <Badge variant="outline">{course?.level || "Tous niveaux"}</Badge>
              </div>
            </div>
          </div>

          {/* Right Column - Purchase Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-lg">
              <div className="mb-4">
                <div className="mb-1 text-3xl font-bold">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(price)}
                </div>
                {monthlyPrice > 0 && (
                  <div className="text-sm text-muted-foreground">ou {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(monthlyPrice)}/mois</div>
                )}
              </div>

              <Link href={`/fr/checkout/${course?.id || 'course-1'}`}>
                <Button className="mb-4 w-full bg-gradient-to-r from-primary to-chart-2 text-lg text-primary-foreground hover:opacity-90">
                  S'inscrire maintenant
                </Button>
              </Link>

              <div className="mb-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Heart className="mr-2 h-4 w-4" />
                  Favoris
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Sauvegarder
                </Button>
              </div>

              <Button variant="ghost" size="sm" className="mb-4 w-full">
                <Share2 className="mr-2 h-4 w-4" />
                Partager cette formation
              </Button>

              <div className="border-t border-border pt-4">
                <h4 className="mb-3 font-semibold">Cette formation inclut :</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>{course?.duration ? `${Math.ceil(course.duration / 60)}h de vidéo` : "Durée flexible"}</span>
                  </div>
                  {/* Sections count usage if available, else static placeholders */}
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>{course?.sections?.length || 0} sections</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Accès mobile & desktop</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Certificat de fin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Accès à vie</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-border pt-4">
                <Button variant="outline" size="sm" className="mb-2 w-full bg-transparent">
                  Offrir en cadeau
                </Button>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Acheter pour mon équipe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
