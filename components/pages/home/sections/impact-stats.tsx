"use client"

import { Container } from "@/components/marketing/container"
import { useTranslations } from "next-intl"

export function ImpactStats() {
  const t = useTranslations("landing.stats")

  const stats = [
    {
      value: "500+",
      label: t("stats.learners.label"),
      sublabel: t("stats.learners.sublabel"),
    },
    {
      value: "25+",
      label: t("stats.companies.label"),
      sublabel: t("stats.companies.sublabel"),
    },
    {
      value: "150+",
      label: t("stats.trainers.label"),
      sublabel: t("stats.trainers.sublabel"),
    },
    {
      value: "3",
      label: t("stats.countries.label"),
      sublabel: t("stats.countries.sublabel"),
    },
    {
      value: "+30%",
      label: t("stats.growth.label"),
      sublabel: t("stats.growth.sublabel"),
    },
    {
      value: "40%",
      label: t("stats.timeSavings.label"),
      sublabel: t("stats.timeSavings.sublabel"),
    },
  ]

  return (
    <section id="impact" className="bg-gradient-to-br from-primary/5 to-chart-2/5 py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-card p-8 text-center transition-all hover:scale-105 hover:shadow-xl"
            >
              <div className="mb-3 text-5xl font-bold text-primary md:text-6xl">{stat.value}</div>
              <div className="mb-2 text-sm font-bold tracking-wide text-foreground">{stat.label}</div>
              <div className="text-sm text-muted-foreground">{stat.sublabel}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

