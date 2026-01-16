"use client"

import { Container } from "@/components/marketing/layout/container"
import { Award, Heart, UsersIcon, Zap } from "lucide-react"
import { useTranslations } from "next-intl"

export function ValuesSection() {
  const t = useTranslations("about.values")

  const values = [
    {
      icon: Award,
      key: "excellence",
    },
    {
      icon: Heart,
      key: "impact",
    },
    {
      icon: UsersIcon,
      key: "userOriented",
    },
    {
      icon: Zap,
      key: "agility",
    },
  ]

  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">{t("title")}</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <div key={index} className="rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-chart-2/10">
                  <Icon className="h-8 w-8 text-primary" />
                </div>

                <h3 className="mb-2 text-2xl font-bold">{t(`values.${value.key}.title`)}</h3>
                <p className="mb-4 text-lg font-medium text-muted-foreground">{t(`values.${value.key}.subtitle`)}</p>

                <p className="mb-6 leading-relaxed text-muted-foreground">{t(`values.${value.key}.description`)}</p>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-foreground">En pratique:</p>
                  <ul className="space-y-2">
                    {(t.raw(`values.${value.key}.practices`) as string[]).map((practice, idx) => (
                      <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="text-primary">✓</span>
                        <span>{practice}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
