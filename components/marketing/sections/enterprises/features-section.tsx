"use client"

import { Container } from "@/components/marketing/layout/container"
import { Zap, Users, Brain, Globe, CheckCircle, BarChart3 } from "lucide-react"
import { useTranslations } from "next-intl"

export function FeaturesSection() {
  const t = useTranslations("enterprises.features")

  const features = [
    {
      icon: Zap,
      key: "onboarding",
    },
    {
      icon: Globe,
      key: "marketplace",
    },
    {
      icon: Brain,
      key: "aiCreation",
    },
    {
      icon: Users,
      key: "multiSites",
    },
    {
      icon: CheckCircle,
      key: "certifications",
    },
    {
      icon: BarChart3,
      key: "analytics",
    },
  ]

  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-1 text-lg font-bold">{t(`features.${feature.key}.title`)}</h3>
                <p className="mb-3 text-sm font-semibold text-primary">{t(`features.${feature.key}.subtitle`)}</p>
                <p className="mb-4 text-sm text-muted-foreground">{t(`features.${feature.key}.description`)}</p>
                <div className="rounded-lg bg-primary/10 p-3">
                  <p className="text-xs font-semibold text-primary">{t(`features.${feature.key}.benefit`)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
