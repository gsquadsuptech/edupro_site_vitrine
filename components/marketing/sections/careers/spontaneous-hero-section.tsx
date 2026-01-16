"use client"

import { Container } from "@/components/marketing/layout/container"
import { useTranslations } from "next-intl"

export function SpontaneousHeroSection() {
  const t = useTranslations("careers.spontaneous")

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-balance text-4xl font-bold md:text-5xl lg:text-6xl">
            Candidature{" "}
            <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">spontanée</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            {t("form.subtitle")}
          </p>
        </div>
      </Container>
    </section>
  )
}

