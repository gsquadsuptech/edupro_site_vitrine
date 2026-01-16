"use client"

import { Container } from "@/components/marketing/layout/container"
import Image from "next/image"
import { useTranslations } from "next-intl"

export function HeroSection() {
  const t = useTranslations("about.hero")

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-chart-2/5 py-20 md:py-32">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-balance text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            {t("title")}
          </h1>

          <p className="mx-auto mb-12 max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            {t("subtitle")}
          </p>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            <div className="rounded-xl bg-card p-6 shadow-sm">
              <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">500+</div>
              <div className="text-sm text-muted-foreground">{t("stats.learners")}</div>
            </div>
            <div className="rounded-xl bg-card p-6 shadow-sm">
              <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">25+</div>
              <div className="text-sm text-muted-foreground">{t("stats.companies")}</div>
            </div>
            <div className="rounded-xl bg-card p-6 shadow-sm">
              <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">3</div>
              <div className="text-sm text-muted-foreground">{t("stats.countries")}</div>
            </div>
            <div className="rounded-xl bg-card p-6 shadow-sm">
              <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">42+</div>
              <div className="text-sm text-muted-foreground">{t("stats.trainings")}</div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto mt-16 max-w-5xl overflow-hidden rounded-2xl">
          <Image
            src="/images/edupro-home2.png"
            alt="L'équipe EduPro"
            width={1200}
            height={600}
            className="h-auto w-full"
          />
        </div>
      </Container>
    </section>
  )
}
