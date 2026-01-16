"use client"

import { Container } from "@/components/marketing/container"
import { Button } from "@/components/ui/button"
import { Building2, User, GraduationCap, TrendingUp, ArrowRight, Shield, Headphones, CreditCard, Database, Wifi } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export function FinalCTASection() {
  const params = useParams()
  const locale = params?.locale || 'fr'

  const options = [
    {
      icon: Building2,
      title: "JE SUIS UNE ENTREPRISE",
      subtitle: "Configuration en 48h · Essai gratuit 14 jours",
      cta: "Découvrir nos solutions",
      link: `/${locale}/entreprises`
    },
    {
      icon: User,
      title: "JE SUIS UN PROFESSIONNEL",
      subtitle: "Large catalogue . paiement mobile",
      cta: "Créer mon compte gratuit",
      link: `/${locale}/inscription`
    },
    {
      icon: GraduationCap,
      title: "JE SUIS FORMATEUR/INSTITUT",
      subtitle: "Outils IA inclus · Audience panafricaine",
      cta: "Rejoindre la communauté",
      link: `/${locale}/formateurs`
    },
    {
      icon: TrendingUp,
      title: "JE SUIS INVESTISSEUR",
      subtitle: "ROI 206% sur 3 ans · Marché 40-50Mds",
      cta: "Investir dans l'avenir de la formation",
      link: `/${locale}/investisseurs`
    }
  ]

  const guarantees = [
    {
      icon: Shield,
      text: "99.9% de disponibilité garantie"
    },
    {
      icon: Headphones,
      text: "Support francophone 7j/7"
    },
    {
      icon: CreditCard,
      text: "Paiements sécurisés (Mobile Money, Visa, Mastercard)"
    },
    {
      icon: Database,
      text: "Données hébergées en conformité RGPD"
    },
    {
      icon: Wifi,
      text: "Optimisé pour faible bande passante"
    }
  ]

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-chart-2/90" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('/african-professionals-in-modern-training-environme.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
      </div>

      <Container className="relative z-10">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Prêt à transformer vos talents?
          </h2>
        </div>

        {/* 4 Options Grid */}
        <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {options.map((option, index) => {
            const Icon = option.icon
            return (
              <div
                key={index}
                className="flex flex-col rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-white">
                      {option.title}
                    </h3>
                    <p className="text-xs text-white/80">{option.subtitle}</p>
                  </div>
                </div>

                <Link href={option.link} className="mt-auto">
                  <Button
                    variant="secondary"
                    className="w-full bg-white text-primary hover:bg-white/90"
                    size="sm"
                  >
                    {option.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )
          })}
        </div>

        {/* Guarantees */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {guarantees.map((guarantee, index) => {
            const Icon = guarantee.icon
            return (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm"
              >
                <Icon className="h-5 w-5 flex-shrink-0 text-white" />
                <p className="text-xs text-white">{guarantee.text}</p>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
