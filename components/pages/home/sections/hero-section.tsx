"use client"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/marketing/container"
import Image from "next/image"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams } from "next/navigation"

import eduproHome3 from "@/assets/images/edupro-home3.png"

export function HeroSection() {
  const t = useTranslations("landing.hero")
  const params = useParams()
  const locale = params?.locale || 'fr'

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 md:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            <h1 className="mb-6 text-balance text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              {t("title")}{" "}
              <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                {t("titleHighlight")}
              </span>
            </h1>
            <p className="mb-8 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
              {t("subtitle")}
            </p>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-primary to-chart-2 text-primary-foreground hover:opacity-90"
              >
                <Link href={`/${locale}/inscription`}>
                  {t("cta.primary")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={`/${locale}/entreprises`}>
                  Découvrir nos solutions
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {t("features.trial")}
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {t("features.noCard")}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-chart-2/10">
              <img
                src={eduproHome3.src}
                alt="African professionals learning"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">+30%</div>
            <div className="text-sm text-muted-foreground">{t("stats.growth")}</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">500+</div>
            <div className="text-sm text-muted-foreground">{t("stats.learners")}</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">25+</div>
            <div className="text-sm text-muted-foreground">{t("stats.companies")}</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">3</div>
            <div className="text-sm text-muted-foreground">{t("stats.countries")}</div>
          </div>
        </div>
      </Container>
    </section>
  )
}
