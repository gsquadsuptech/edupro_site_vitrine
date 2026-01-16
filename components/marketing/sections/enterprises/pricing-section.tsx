"use client"

import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Sparkles, Building2, Crown } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams } from "next/navigation"

export function PricingSection() {
  const t = useTranslations("enterprises.pricing")
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'

  const plans = [
    {
      key: "essentials",
      icon: Sparkles,
      highlight: false,
    },
    {
      key: "professional",
      icon: Building2,
      highlight: true,
    },
    {
      key: "enterprise",
      icon: Crown,
      highlight: false,
    },
  ]

  return (
    <section id="pricing" className="bg-muted/30 py-12 md:py-16">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <div
                key={index}
                className={`rounded-2xl border p-8 flex flex-col ${
                  plan.highlight
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{t(`plans.${plan.key}.name`)}</h3>
                <p className="mb-2 text-sm font-semibold text-primary">{t(`plans.${plan.key}.subtitle`)}</p>
                <p className="mb-6 text-xs text-muted-foreground">Positionnement : {t(`plans.${plan.key}.position`)}</p>
                
                <div className="mb-6 border-t border-border pt-6">
                  <p className="mb-4 text-sm font-semibold text-primary">{t(`plans.${plan.key}.components`)}</p>
                </div>

                <ul className="mb-8 space-y-3 text-sm flex-grow">
                  {(t.raw(`plans.${plan.key}.features`) as string[]).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  variant={plan.highlight ? "default" : "outline"}
                  className={`w-full mt-auto ${
                    plan.highlight
                      ? "bg-gradient-to-r from-primary to-chart-2 text-primary-foreground"
                      : ""
                  }`}
                  asChild
                >
                  <Link href={`/${locale}/demande-demo`}>
                    {t(`plans.${plan.key}.cta`)}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
