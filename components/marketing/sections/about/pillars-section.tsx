"use client"

import { Container } from "@/components/marketing/layout/container"
import { Globe, Users, Target, Sprout } from "lucide-react"
import { useTranslations } from "next-intl"

export function PillarsSection() {
  const t = useTranslations("about.pillars")

  const pillars = [
    {
      icon: Globe,
      key: "accessibility",
    },
    {
      icon: Users,
      key: "inclusion",
    },
    {
      icon: Target,
      key: "contextualization",
    },
    {
      icon: Sprout,
      key: "sustainability",
    },
  ]

  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">{t("title")}</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon
            return (
              <div key={index} className="rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-8 w-8 text-primary" />
                </div>

                <h3 className="mb-2 text-2xl font-bold">{t(`pillars.${pillar.key}.title`)}</h3>
                <p className="mb-6 text-lg font-medium text-muted-foreground">{t(`pillars.${pillar.key}.subtitle`)}</p>

                <div className="mb-6 space-y-3">
                  <p className="text-sm font-semibold text-foreground">{t(`pillars.${pillar.key}.meaning`)}</p>
                  <ul className="space-y-2">
                    {(t.raw(`pillars.${pillar.key}.features`) as string[]).map((feature, idx) => (
                      <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="text-primary">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg bg-primary/5 p-4">
                  <p className="text-sm font-medium italic text-foreground">{t(`pillars.${pillar.key}.commitment`)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
