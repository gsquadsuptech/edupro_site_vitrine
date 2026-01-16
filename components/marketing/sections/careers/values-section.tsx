"use client"

import { Lightbulb, Target, Users, TrendingUp } from "lucide-react"
import { Container } from "@/components/marketing/layout/container"
import { useTranslations } from "next-intl"

export function CareersValuesSection() {
  const t = useTranslations('careers.values')

  const values = [
    {
      icon: Lightbulb,
      title: t('innovation.title'),
      description: t('innovation.description'),
    },
    {
      icon: Target,
      title: t('impact.title'),
      description: t('impact.description'),
    },
    {
      icon: Users,
      title: t('community.title'),
      description: t('community.description'),
    },
    {
      icon: TrendingUp,
      title: t('excellence.title'),
      description: t('excellence.description'),
    },
  ]

  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">{t('title')}</h2>
          <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

