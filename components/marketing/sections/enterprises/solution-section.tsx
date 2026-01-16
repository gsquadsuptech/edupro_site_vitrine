"use client"

import { Container } from "@/components/marketing/layout/container"
import { CheckCircle2, Zap, BarChart3 } from "lucide-react"
import { useTranslations } from "next-intl"

export function SolutionSection() {
  const t = useTranslations("enterprises.solution")

  const differentiators = [
    {
      icon: CheckCircle2,
      key: "personalization",
    },
    {
      icon: BarChart3,
      key: "roi",
    },
    {
      icon: Zap,
      key: "deployment",
    },
  ]

  return (
    <section className="bg-muted/30 py-20 md:py-32">
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
          {differentiators.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="rounded-xl border border-border bg-card p-8 transition-all hover:shadow-lg">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{t(`differentiators.${item.key}.title`)}</h3>
                <p className="mb-4 text-sm font-semibold text-primary">{t(`differentiators.${item.key}.subtitle`)}</p>
                <p className="mb-4 text-sm text-muted-foreground">{t(`differentiators.${item.key}.description`)}</p>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs italic text-muted-foreground">{t(`differentiators.${item.key}.example`)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
