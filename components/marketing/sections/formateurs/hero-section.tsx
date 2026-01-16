"use client"

import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Link from "next/link"

export function FormateursHeroSection() {
  const t = useTranslations("trainers.hero")
  const params = useParams()
  const locale = params?.locale || 'fr'

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 md:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div>
            <h1 className="mb-6 text-balance text-4xl font-bold md:text-5xl lg:text-6xl">
              {t("title")}{" "}
              <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">{t("titleHighlight")}</span>
            </h1>

            <p className="mb-8 text-xl text-muted-foreground">
              {t("subtitle")}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="group bg-gradient-to-r from-primary to-chart-2" asChild>
                <Link href={`/${locale}/formateurs/candidature`}>
                  {t("cta.primary")}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={`/${locale}/inscription`}>
                  {t("cta.secondary")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                {t("features")}
              </p>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4 border-t border-border pt-8">
              <div>
                <p className="text-3xl font-bold text-primary">150+</p>
                <p className="text-xs font-medium text-muted-foreground">{t("stats.trainers")}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">10K+</p>
                <p className="text-xs font-medium text-muted-foreground">{t("stats.learners")}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">70%+</p>
                <p className="text-xs font-medium text-muted-foreground">{t("stats.satisfaction")}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">∞</p>
                <p className="text-xs font-medium text-muted-foreground">{t("stats.reach")}</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-chart-2/20">
              <Image
                src="/images/edupro-formateur.png"
                alt="Formateur africain créant du contenu digital"
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
