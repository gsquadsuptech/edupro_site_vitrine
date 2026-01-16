"use client"

import { Container } from "@/components/marketing/layout/container"
import { DollarSign, TrendingUp, Target } from "lucide-react"
import { useTranslations } from "next-intl"

export function OpportunitySection() {
  const t = useTranslations("investors.opportunity")

  const opportunities = [
    {
      icon: DollarSign,
      key: "market",
    },
    {
      icon: TrendingUp,
      key: "growth",
    },
    {
      icon: Target,
      key: "leader",
    },
  ]

  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t("title")}</h2>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {opportunities.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-8 transition-all hover:shadow-lg hover:shadow-primary/10"
              >
                <Icon className="mb-4 h-10 w-10 text-primary" />
                <div className="mb-2 text-3xl font-bold text-primary">{t(`opportunities.${item.key}.number`)}</div>
                <div className="mb-3 font-semibold text-foreground">{t(`opportunities.${item.key}.title`)}</div>
                <p className="text-sm text-muted-foreground">{t(`opportunities.${item.key}.description`)}</p>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
