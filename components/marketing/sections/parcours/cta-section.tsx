import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { ArrowRight, Download, MessageCircle } from "lucide-react"

export function ParcoursCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-fuchsia-50 to-purple-50 py-20 lg:py-32">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/3 top-1/3 h-96 w-96 animate-pulse rounded-full bg-indigo-200/30 blur-3xl" />
        <div
          className="absolute right-1/3 bottom-1/3 h-96 w-96 animate-pulse rounded-full bg-fuchsia-200/30 blur-3xl"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <Container className="relative">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-balance text-4xl font-bold text-slate-900 lg:text-5xl">
            Prête à transformer votre passion en business rentable ?
          </h2>
          <p className="mb-12 text-pretty text-xl text-slate-700">
            Rejoignez les 120+ entrepreneures qui ont déjà développé leur marque grâce à ce parcours
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-lg font-semibold shadow-lg shadow-indigo-500/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/50"
            >
              S'inscrire maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-300 bg-white text-lg font-semibold text-slate-900 hover:bg-slate-50"
            >
              <Download className="mr-2 h-5 w-5" />
              Télécharger le programme
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-300 bg-white text-lg font-semibold text-slate-900 hover:bg-slate-50"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Parler à un conseiller
            </Button>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 backdrop-blur-sm shadow-sm">
              <p className="mb-2 text-3xl font-bold text-slate-900">30</p>
              <p className="text-sm text-slate-600">Places disponibles</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 backdrop-blur-sm shadow-sm">
              <p className="mb-2 text-3xl font-bold text-slate-900">15 jan</p>
              <p className="text-sm text-slate-600">Début de la session</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 backdrop-blur-sm shadow-sm">
              <p className="mb-2 text-3xl font-bold text-slate-900">14 jours</p>
              <p className="text-sm text-slate-600">Garantie remboursement</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
