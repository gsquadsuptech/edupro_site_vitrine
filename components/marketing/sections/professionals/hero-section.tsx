"use client"

import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Link from "next/link"

export function ProfessionalsHeroSection() {
  const t = useTranslations("professionals.hero")
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 pt-20 md:pt-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-bold md:text-5xl lg:text-6xl leading-tight">
                {t("title")}{" "}
                <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">{t("titleHighlight")}</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t("subtitle")}
              </p>
            </div>

            {/* CTAs and Selectors */}
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  <Link href={`/${locale}/inscription?tab=apprenant`}>
                    {t("cta.primary")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={`/${locale}/catalogue`}>
                    {t("cta.secondary")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 pt-4">
              <div className="space-y-1">
                <div className="text-2xl md:text-3xl font-bold text-primary">500+</div>
                <p className="text-sm text-muted-foreground">{t("stats.learners")}</p>
              </div>
              <div className="space-y-1">
                <div className="text-2xl md:text-3xl font-bold text-chart-2">92%</div>
                <p className="text-sm text-muted-foreground">{t("stats.completion")}</p>
              </div>
              <div className="space-y-1">
                <div className="text-2xl md:text-3xl font-bold text-chart-4">24/7</div>
                <p className="text-sm text-muted-foreground">{t("stats.accessible")}</p>
              </div>
              <div className="space-y-1">
                <div className="text-2xl md:text-3xl font-bold text-chart-5">100%</div>
                <p className="text-sm text-muted-foreground">{t("stats.mobile")}</p>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative aspect-square overflow-hidden rounded-2xl lg:aspect-auto lg:h-[500px]">
            <Image
              src="/images/edupro-entreprise3.png"
              alt="Professionnels apprenant avec EduPro"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
