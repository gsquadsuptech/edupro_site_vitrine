import { Container } from "@/components/marketing/layout/container"
import { Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LearningPath } from "@/lib/supabase/types"

interface SkillPackPricingNewProps {
  skillPack: LearningPath
}

export function SkillPackPricingNew({ skillPack }: SkillPackPricingNewProps) {
  const pricingOptions = [
    {
      name: "Paiement unique",
      price: skillPack.price.toLocaleString('fr-FR'),
      currency: "FCFA",
      description: "Accès à vie au Skill Pack complet",
      isPopular: false,
      features: [
        `${skillPack.courses_count} parcours inclus`,
        "Accès à vie aux contenus",
        "Mises à jour gratuites",
        "Certificats co-signés",
        "Support communautaire",
        `${skillPack.projects_count} projets pratiques`,
      ],
    },
    {
      name: "Paiement mensuel",
      price: Math.round(skillPack.price / 10).toLocaleString('fr-FR'), // Mock logic for monthly
      currency: "FCFA/mois",
      description: "Pendant 12 mois - Flexibilité maximale",
      isPopular: true,
      features: [
        `${skillPack.courses_count} parcours inclus`,
        "Accès pendant 12 mois",
        "Mises à jour gratuites",
        "Certificats co-signés",
        "Support prioritaire",
        `${skillPack.projects_count} projets pratiques`,
        "Sessions de coaching mensuelles",
        "Accès au réseau alumni",
      ],
    },
  ]

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-violet-950/20 to-slate-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/20 rounded-full blur-3xl" />

      <Container>
        <div className="relative">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 text-violet-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Tarifs transparents
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-pretty">
              Investissez dans votre avenir
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto text-balance">
              Choisissez la formule qui vous convient le mieux
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {pricingOptions.map((option, index) => (
              <div key={index} className="relative group">
                {/* Popular badge */}
                {option.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Le plus populaire
                    </div>
                  </div>
                )}

                {/* Card */}
                <div
                  className={`relative h-full bg-slate-800/50 backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 ${option.isPopular
                      ? "border-violet-500/50 shadow-2xl shadow-violet-500/20 scale-105"
                      : "border-slate-700/50 hover:border-violet-500/30"
                    }`}
                >
                  {/* Header */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{option.name}</h3>
                    <p className="text-slate-400 mb-6">{option.description}</p>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                        {option.price}
                      </span>
                      <span className="text-slate-400">{option.currency}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {option.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className="h-5 w-5 rounded-full bg-violet-500/20 flex items-center justify-center">
                            <Check className="h-3 w-3 text-violet-400" />
                          </div>
                        </div>
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    className={`w-full text-base py-6 ${option.isPopular
                        ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white"
                        : "bg-slate-700 hover:bg-slate-600 text-white"
                      }`}
                  >
                    Commencer maintenant
                  </Button>

                  {/* Reassurance */}
                  <p className="text-center text-sm text-slate-400 mt-4">Garantie satisfait ou remboursé 30 jours</p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional info */}
          <div className="text-center mt-12">
            <p className="text-slate-400 mb-4">Paiements sécurisés via Mobile Money, Carte bancaire ou Virement</p>
            <p className="text-sm text-slate-500">Entreprises : Contactez-nous pour des tarifs de groupe</p>
          </div>
        </div>
      </Container>
    </section>
  )
}
