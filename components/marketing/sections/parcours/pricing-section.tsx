import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, ShieldCheck } from "lucide-react"
import { LearningPath } from "@/lib/supabase/types"
import { EnrollButton } from "@/components/payment/enroll-button"

interface ParcoursPricingProps {
  learningPath: LearningPath
  locale: string
}

const formatXOF = (n: number) => `${Math.round(n).toLocaleString('fr-FR')} FCFA`

export function ParcoursPricing({ learningPath, locale }: ParcoursPricingProps) {
  const oneTimePrice = learningPath.one_time_price ?? learningPath.price ?? 0
  const monthlyPrice = learningPath.monthly_price ?? null
  const installments = (learningPath.installments && learningPath.installments.length > 0)
    ? learningPath.installments
    : null
  const modes = learningPath.pricing_modes ?? null
  const hasOneTime = !modes || modes.one_time !== false

  const included = [
    learningPath.courses_count > 0
      ? `${learningPath.courses_count} cours complets${learningPath.hours > 0 ? ` (${learningPath.hours}h de contenu)` : ''}`
      : 'Tous les modules du parcours',
    'Accès illimité au contenu',
    learningPath.enable_certificate || learningPath.certificate_template_id
      ? 'Certificat professionnel à la complétion'
      : 'Attestation de réussite',
    'Support pédagogique',
    'Mise à jour continue du contenu',
  ]

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white py-20 lg:py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/30 to-transparent" />

      <Container className="relative">
        <div className="mb-16 text-center">
          <Badge className="mb-4 border-fuchsia-500/50 bg-fuchsia-50 text-fuchsia-700">Tarifs</Badge>
          <h2 className="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl">Investissez dans votre réussite</h2>
          <p className="mx-auto max-w-3xl text-lg text-slate-600">
            Un parcours complet avec accompagnement
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-200 bg-white p-8 shadow-xl">
            {learningPath.is_featured && (
              <div className="absolute right-4 top-4">
                <div className="flex items-center gap-2 rounded-full border border-yellow-300 bg-yellow-50 px-3 py-1 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 text-yellow-600" />
                  <span className="text-xs font-semibold text-yellow-700">Mis en avant</span>
                </div>
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900">{learningPath.title}</h3>
              <p className="mt-2 text-slate-600">Parcours complet</p>
            </div>

            <div className="mb-8">
              {hasOneTime && oneTimePrice > 0 ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-bold text-slate-900">
                    {Math.round(oneTimePrice).toLocaleString('fr-FR')}
                  </span>
                  <span className="text-xl text-slate-600">FCFA</span>
                </div>
              ) : monthlyPrice ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-bold text-slate-900">
                    {Math.round(monthlyPrice).toLocaleString('fr-FR')}
                  </span>
                  <span className="text-xl text-slate-600">FCFA/mois</span>
                </div>
              ) : (
                <div className="text-3xl font-bold text-slate-900">Gratuit</div>
              )}
              {installments && installments.length > 0 && (
                <p className="mt-2 text-sm text-slate-500">
                  ou {installments.length} × {formatXOF(installments[0].amount || 0)}
                </p>
              )}
            </div>

            <EnrollButton
              target={{ kind: "learning_path", id: learningPath.id, slug: learningPath.slug }}
              locale={locale}
            >
              <Button
                size="lg"
                className="mb-8 w-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-lg font-semibold shadow-lg shadow-indigo-500/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/50"
              >
                S'inscrire maintenant
              </Button>
            </EnrollButton>

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

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">Paiement sécurisé</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-700">
                Mobile Money, carte bancaire et virement disponibles selon les modalités configurées
                par EduPro pour ce parcours.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <Check className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Accès immédiat</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-700">
                Dès la confirmation du paiement, vous accédez à l'ensemble des cours du parcours.
              </p>
            </div>

          </div>
        </div>
      </Container>
    </section>
  )
}
