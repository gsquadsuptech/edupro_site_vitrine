"use client"

import { Container } from "@/components/marketing/container"
import { DollarSign, Sparkles, Smartphone } from "lucide-react"
import Image from "next/image"
import { CheckCircle2, Zap, Trophy, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import homePremium from "@/assets/images/home-Premium-Accessible.png"
import homeIa from "@/assets/images/home-IA-Integre.jpg"
import homeMobile from "@/assets/images/african-student-learning-on-mobile-phone.jpg"
import { useTranslations } from "next-intl"

export function SolutionSection() {
  const t = useTranslations("landing.solution")

  const differentiators = [
    {
      icon: DollarSign,
      title: t("differentiators.premiumAccessible.title"),
      subtitle: t("differentiators.premiumAccessible.subtitle"),
      description: t("differentiators.premiumAccessible.description"),
      example: t("differentiators.premiumAccessible.example"),
      image: homePremium,
    },
    {
      icon: Sparkles,
      title: t("differentiators.aiIntegrated.title"),
      subtitle: t("differentiators.aiIntegrated.subtitle"),
      description: t("differentiators.aiIntegrated.description"),
      example: t("differentiators.aiIntegrated.example"),
      image: homeIa,
    },
    {
      icon: Smartphone,
      title: t("differentiators.mobileFirst.title"),
      subtitle: t("differentiators.mobileFirst.subtitle"),
      description: t("differentiators.mobileFirst.description"),
      example: t("differentiators.mobileFirst.example"),
      image: homeMobile,
    },
  ]

  return (
    <section className="bg-muted/30 py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {differentiators.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:scale-105 hover:shadow-xl"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    width={600}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-8">
                  <div className="mb-4 inline-flex rounded-lg bg-gradient-to-br from-primary/10 to-chart-2/10 p-3">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold">{item.title}</h3>
                  <p className="mb-4 text-sm font-semibold text-primary">{item.subtitle}</p>
                  <p className="mb-4 leading-relaxed text-muted-foreground">{item.description}</p>
                  <p className="text-sm italic text-muted-foreground">{item.example}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

