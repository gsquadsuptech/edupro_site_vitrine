"use client"

import { Container } from "@/components/marketing/layout/container"
import { useTranslations } from "next-intl"

export function BlogHeroSection() {
  const t = useTranslations("blog")

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background to-primary/5 py-20 lg:py-32">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-primary/20 blur-3xl" />
        <div
          className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-chart-2/20 blur-3xl"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-bold leading-tight text-foreground lg:text-5xl xl:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mt-6 text-pretty text-xl leading-relaxed text-muted-foreground">
            {t("hero.subtitle")}
          </p>
        </div>
      </Container>
    </section>
  )
}

