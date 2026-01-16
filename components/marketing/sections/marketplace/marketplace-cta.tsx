"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, GraduationCap } from "lucide-react"
import { useTranslations } from "next-intl"

export function MarketplaceCTA() {
  const params = useParams()
  const locale = params?.locale || 'fr'
  const t = useTranslations("marketplace")

  return (
    <section className="bg-gradient-to-br from-primary/10 via-chart-2/10 to-accent/10 py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <GraduationCap className="mx-auto mb-6 h-16 w-16 text-primary" />
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t("comingSoon.ctaSection.title")}</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            {t("comingSoon.ctaSection.subtitle")}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href={`/${locale}/catalogue`}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-chart-2 text-primary-foreground hover:opacity-90"
              >
                {t("comingSoon.ctaSection.primary")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href={`/${locale}/formateurs`}>
              <Button size="lg" variant="outline">
                {t("comingSoon.ctaSection.secondary")}
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{t("comingSoon.ctaSection.bullets.unlimited")}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{t("comingSoon.ctaSection.bullets.certificates")}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{t("comingSoon.ctaSection.bullets.trainerSupport")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
