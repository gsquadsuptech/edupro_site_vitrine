import { CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function SkillPackPricing() {
  const options = [
    {
      name: "Paiement unique",
      price: 49000,
      originalPrice: 75000,
      description: "Accès immédiat à toutes les formations",
      features: [
        "15 formations complètes",
        "80h de contenu vidéo",
        "3 projets pratiques",
        "Certificat de compétences",
        "Accès à vie",
        "Support formateur",
        "Mises à jour gratuites",
      ],
      badge: "Meilleure offre",
      highlighted: true,
    },
    {
      name: "Paiement mensuel",
      price: 10000,
      description: "Étalez vos paiements sur 5 mois",
      features: [
        "15 formations complètes",
        "80h de contenu vidéo",
        "3 projets pratiques",
        "Certificat de compétences",
        "Accès pendant 12 mois",
        "Support formateur",
      ],
      badge: null,
      highlighted: false,
    },
  ]

  return (
    <section className="border-t border-border bg-muted/30 py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold md:text-4xl">Tarifs & Options</h2>
          <p className="text-lg text-muted-foreground">Choisissez la formule qui vous convient</p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {options.map((option, index) => (
            <div
              key={index}
              className={`relative rounded-xl border-2 bg-card p-8 ${
                option.highlighted ? "border-primary shadow-lg" : "border-border"
              }`}
            >
              {option.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
                  {option.badge}
                </Badge>
              )}

              <div className="mb-6 text-center">
                <h3 className="mb-2 text-2xl font-bold">{option.name}</h3>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>

              <div className="mb-6 text-center">
                <div className="mb-2 flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold">{option.price.toLocaleString()} FCFA</span>
                  {option.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      {option.originalPrice.toLocaleString()} FCFA
                    </span>
                  )}
                </div>
                {option.name === "Paiement mensuel" && (
                  <p className="text-sm text-muted-foreground">pendant 5 mois (50 000 FCFA total)</p>
                )}
              </div>

              <div className="mb-6 space-y-3">
                {option.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className={`w-full ${
                  option.highlighted ? "bg-gradient-to-r from-primary to-chart-2 text-primary-foreground" : ""
                }`}
                size="lg"
              >
                Choisir cette formule
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Garantie satisfait ou remboursé 30 jours • Paiement sécurisé • Support 7j/7
          </p>
        </div>
      </div>
    </section>
  )
}
