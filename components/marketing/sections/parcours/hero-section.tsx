import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Award, Star } from "lucide-react"
import Image from "next/image"

export function ParcoursHero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50 py-20 lg:py-32">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-indigo-200 blur-3xl" />
        <div
          className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-fuchsia-200 blur-3xl"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column - Content */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <Badge className="w-fit border-indigo-300 bg-indigo-100 text-indigo-700">
                Co-certifié EDUPRO × SO'FATOO
              </Badge>

              <h1 className="text-balance text-4xl font-bold leading-tight text-slate-900 lg:text-5xl xl:text-6xl">
                Business of Fashion Essentials
              </h1>

              <p className="text-pretty text-xl leading-relaxed text-slate-700">
                Faire de sa passion une marque rentable, durable et reconnue
              </p>
            </div>

            {/* Stats pills */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 shadow-sm">
                <Clock className="h-5 w-5 text-indigo-600" />
                <span className="text-sm font-medium text-slate-900">6-8 semaines</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 shadow-sm">
                <Users className="h-5 w-5 text-fuchsia-600" />
                <span className="text-sm font-medium text-slate-900">120+ apprenantes</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 shadow-sm">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-slate-900">4.9/5 (48 avis)</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 shadow-sm">
                <Award className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-slate-900">Certifiant</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-lg font-semibold shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/40"
              >
                S'inscrire maintenant
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-300 bg-white text-lg font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
              >
                Télécharger le programme
              </Button>
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <Award className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Certification professionnelle</p>
                <p className="text-sm text-slate-600">Reconnue par GIZ, AFD, ONU Femmes</p>
              </div>
            </div>
          </div>

          {/* Right column - Visual */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-2xl">
              <Image
                src="/african-fashion-designer-working-on-collection.jpg"
                alt="Fashion Business"
                width={800}
                height={600}
                className="rounded-xl"
              />

              {/* Floating cards */}
              <div className="absolute -right-4 top-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                <p className="text-sm font-semibold text-slate-900">50-60 heures</p>
                <p className="text-xs text-slate-600">de formation</p>
              </div>

              <div className="absolute -left-4 bottom-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                <p className="text-sm font-semibold text-slate-900">70% e-learning</p>
                <p className="text-xs text-slate-600">30% ateliers pratiques</p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-200 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-fuchsia-200 blur-2xl" />
          </div>
        </div>
      </Container>
    </section>
  )
}
