"use client"

import { Container } from "@/components/marketing/layout/container"
import { Zap, Globe, TrendingUp, Headphones, BarChart3, DollarSign } from "lucide-react"
import { useTranslations } from "next-intl"

export function FormateursWhySection() {
  const t = useTranslations("trainers.why")

  const reasons = [
    {
      icon: Zap,
      key: "simplified",
    },
    {
      icon: Globe,
      key: "audience",
    },
    {
      icon: TrendingUp,
      key: "revenue",
    },
    {
      icon: Headphones,
      key: "support",
    },
    {
      icon: BarChart3,
      key: "pilotage",
    },
    {
      icon: DollarSign,
      key: "zeroInvestment",
    },
  ]

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => {
            const Icon = reason.icon
            return (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-8 hover:shadow-lg transition-shadow"
              >
                <Icon className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 text-lg font-bold">{t(`reasons.${reason.key}.title`)}</h3>
                <p className="mb-4 text-sm font-semibold text-primary">{t(`reasons.${reason.key}.highlight`)}</p>
                <p className="mb-4 text-sm text-muted-foreground">{t(`reasons.${reason.key}.description`)}</p>
                <p className="text-xs italic text-chart-5">{t(`reasons.${reason.key}.cta`)}</p>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
