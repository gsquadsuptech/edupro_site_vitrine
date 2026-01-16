"use client"

import { Container } from "@/components/marketing/layout/container"
import { BarChart3, Clock, BookOpen, DollarSign, Globe, CheckCircle2 } from "lucide-react"
import { useTranslations } from "next-intl"

export function ChallengesSection() {
  const t = useTranslations("enterprises.challenges")

  const challenges = [
    {
      icon: BarChart3,
      key: "turnover",
    },
    {
      icon: Clock,
      key: "onboarding",
    },
    {
      icon: BookOpen,
      key: "skillsGap",
    },
    {
      icon: DollarSign,
      key: "budget",
    },
    {
      icon: Globe,
      key: "multiSites",
    },
    {
      icon: CheckCircle2,
      key: "compliance",
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

        <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge, index) => {
            const Icon = challenge.icon
            return (
              <div key={index} className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{t(`challenges.${challenge.key}.title`)}</h3>
              <p className="mb-4 text-sm text-muted-foreground">{t(`challenges.${challenge.key}.description`)}</p>
              <div className="rounded-lg bg-destructive/10 p-3">
                <p className="text-xs font-semibold text-destructive">Impact:</p>
                <p className="text-xs text-muted-foreground">{t(`challenges.${challenge.key}.impact`)}</p>
              </div>
            </div>
          )
          })}
        </div>

        <div className="text-center">
          <p className="text-lg italic text-muted-foreground">
            {t("closing")}
          </p>
        </div>
      </Container>
    </section>
  )
}
