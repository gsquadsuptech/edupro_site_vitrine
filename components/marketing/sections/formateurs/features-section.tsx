"use client"

import { Container } from "@/components/marketing/layout/container"
import { Video, Sparkles, Users, CreditCard, Smartphone, BarChart3, Palette, Lock, Award } from "lucide-react"
import { useTranslations } from "next-intl"

export function FormateursFeaturesSection() {
  const t = useTranslations("trainers.features")

  const features = [
    {
      icon: Video,
      key: "studio",
    },
    {
      icon: Sparkles,
      key: "ai",
    },
    {
      icon: Users,
      key: "learners",
    },
    {
      icon: CreditCard,
      key: "monetization",
    },
    {
      icon: Smartphone,
      key: "multiPlatform",
    },
    {
      icon: BarChart3,
      key: "analytics",
    },
    {
      icon: Palette,
      key: "personalization",
    },
    {
      icon: Lock,
      key: "security",
    },
    {
      icon: Award,
      key: "certifications",
    },
  ]

  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const featureData = t.raw(`features.${feature.key}`) as any
            return (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow"
              >
                <Icon className="mb-4 h-7 w-7 text-primary" />
                <h3 className="mb-4 font-bold">{featureData.title}</h3>
                <ul className="space-y-2">
                  {(featureData.items as string[]).map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-0.5 text-primary">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
