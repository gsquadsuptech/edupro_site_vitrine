import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, Clock, CreditCard, Users } from "lucide-react"

export function ParcoursPricing() {
  const included = [
    "6 cours complets avec 50-60h de contenu",
    "Vidéos, études de cas et ateliers pratiques",
    "Accès illimité à vie à tous les modules",
    "Coaching individuel (3h)",
    "Certificat professionnel co-signé",
    "Templates et outils (Excel, Canva, etc.)",
    "Accès à la communauté privée",
    "Support formateur par email",
    "Mise à jour gratuite du contenu",
  ]

  const paymentMethods = [
    { name: "Orange Money", available: true },
    { name: "Wave", available: true },
    { name: "MTN Mobile Money", available: true },
    { name: "Moov Money", available: true },
    { name: "Carte bancaire", available: true },
    { name: "Virement bancaire", available: true },
  ]

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white py-20 lg:py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/30 to-transparent" />

      <Container className="relative">
        <div className="mb-16 text-center">
          <Badge className="mb-4 border-fuchsia-500/50 bg-fuchsia-50 text-fuchsia-700">Tarifs</Badge>
          <h2 className="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl">Investissez dans votre réussite</h2>
          <p className="mx-auto max-w-3xl text-lg text-slate-600">
            Un parcours complet avec accompagnement personnalisé
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
          {/* Main pricing card */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-200 bg-white p-8 shadow-xl">
            {/* Sparkle badge */}
            <div className="absolute right-4 top-4">
              <div className="flex items-center gap-2 rounded-full border border-yellow-300 bg-yellow-50 px-3 py-1 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-yellow-600" />
                <span className="text-xs font-semibold text-yellow-700">Offre de lancement</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900">Business of Fashion Essentials</h3>
              <p className="mt-2 text-slate-600">Parcours complet avec certification</p>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold text-slate-900">149 000</span>
                <div>
                  <span className="text-xl text-slate-600">FCFA</span>
                  <p className="text-sm text-slate-500">≈ 230 EUR</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-500">ou 3 × 55 000 FCFA (sans frais)</p>
            </div>

            {/* CTA */}
            <Button
              size="lg"
              className="mb-8 w-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-lg font-semibold shadow-lg shadow-indigo-500/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/50"
            >
              S'inscrire maintenant
            </Button>

            {/* Included features */}
            <div className="space-y-3">
              <p className="font-semibold text-slate-900">Ce qui est inclus :</p>
              {included.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-emerald-500" />
                  <span className="text-sm text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & guarantees */}
          <div className="space-y-6">
            {/* Payment methods */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">Modalités de paiement</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                  >
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm text-slate-700">{method.name}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-slate-500">Paiement sécurisé • Option paiement en 3 fois sans frais</p>
            </div>

            {/* Guarantee */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <Check className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Garantie satisfait ou remboursé</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-700">
                Essayez le parcours pendant 14 jours. Si vous n'êtes pas satisfaite, nous vous remboursons
                intégralement, sans question.
              </p>
            </div>

            {/* Group discount */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <Users className="h-6 w-6 text-fuchsia-600" />
                <h3 className="text-lg font-bold text-slate-900">Tarif de groupe</h3>
              </div>
              <p className="mb-3 text-sm text-slate-700">
                Inscrivez-vous à 3 ou plus et bénéficiez de -20% sur chaque inscription.
              </p>
              <p className="text-xs text-slate-500">Idéal pour les coopératives, associations et incubateurs</p>
            </div>

            {/* Urgency */}
            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
              <div className="mb-3 flex items-center gap-3">
                <Clock className="h-6 w-6 text-yellow-600" />
                <p className="font-semibold text-yellow-800">Prochaine session : 15 janvier 2025</p>
              </div>
              <p className="text-sm text-slate-700">
                Places limitées à 30 participantes pour garantir un accompagnement personnalisé
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
