"use client"

import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams } from "next/navigation"

export function EnterprisesHeroSection() {
  const t = useTranslations("enterprises.hero")
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'

  return (
    <section className="relative py-20 md:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="mb-6 text-balance text-4xl font-bold md:text-5xl lg:text-6xl">
              {t("title")}{" "}
              <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">{t("titleHighlight")}</span>
            </h1>
            <p className="mb-8 text-balance text-lg text-muted-foreground md:text-xl">
              {t("subtitle")} {t("trust")}
            </p>

            <div className="mb-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-chart-2 text-primary-foreground hover:opacity-90"
                asChild
              >
                <Link href={`/${locale}/demande-demo`}>
                  {t("cta.primary")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#pricing">
                  {t("cta.secondary")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="mb-8 flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                {t("features.demo")}
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                {t("features.proposal")}
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                {t("features.deployment")}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <div className="text-2xl font-bold text-primary">-50%</div>
                <div className="text-xs text-muted-foreground">{t("stats.productivity")}</div>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <div className="text-2xl font-bold text-primary">48h</div>
                <div className="text-xs text-muted-foreground">{t("stats.deployment")}</div>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-xs text-muted-foreground">{t("stats.roi")}</div>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <div className="text-2xl font-bold text-primary">-60%</div>
                <div className="text-xs text-muted-foreground">{t("stats.costs")}</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src="/images/edupro-entreprise2.png"
                alt="Équipe africaine en formation"
                width={500}
                height={500}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
