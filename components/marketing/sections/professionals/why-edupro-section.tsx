"use client"

import { Container } from "@/components/marketing/layout/container"
import { BookOpen, Globe, Zap, Award, Users, TrendingUp } from "lucide-react"
import { useTranslations } from "next-intl"

export function WhyEduProSection() {
  const t = useTranslations("professionals.whyEdupro")

  const reasons = [
    {
      icon: BookOpen,
      title: t("reasons.contextualized.title"),
      description: t("reasons.contextualized.description"),
      example: t("reasons.contextualized.example"),
    },
    {
      icon: Zap,
      title: t("reasons.accessibility.title"),
      description: t("reasons.accessibility.description"),
      example: t("reasons.accessibility.example"),
    },
    {
      icon: Globe,
      title: t("reasons.flexibility.title"),
      description: t("reasons.flexibility.description"),
      example: t("reasons.flexibility.example"),
    },
    {
      icon: Award,
      title: t("reasons.certifications.title"),
      description: t("reasons.certifications.description"),
      example: t("reasons.certifications.example"),
    },
    {
      icon: Users,
      title: t("reasons.community.title"),
      description: t("reasons.community.description"),
      example: t("reasons.community.example"),
    },
    {
      icon: TrendingUp,
      title: t("reasons.results.title"),
      description: t("reasons.results.description"),
      example: t("reasons.results.example"),
    },
  ]

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => {
            const Icon = reason.icon
            return (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{reason.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{reason.description}</p>
                <div className="border-t border-border/50 pt-3">
                  <p className="text-xs italic text-chart-2 font-medium">{reason.example}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground italic">
            {t("closing")}
          </p>
        </div>
      </Container>
    </section>
  )
}
