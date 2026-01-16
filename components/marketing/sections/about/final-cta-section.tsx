"use client"

import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useTranslations } from "next-intl"

export function FinalCTASection() {
  const t = useTranslations("about.finalCta")
  const params = useParams()
  const locale = params?.locale || 'fr'

  return (
    <section className="bg-gradient-to-br from-primary via-chart-2 to-primary py-20 text-primary-foreground md:py-32">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 text-5xl">🌟</div>
          <h2 className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">{t("title")}</h2>
          <p className="mb-12 text-lg leading-relaxed opacity-90 md:text-xl">
            {t("subtitle")}
          </p>

          <div className="mb-12 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link href={`/${locale}/entreprises`}>{t("ctas.solutions")}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white bg-transparent text-white hover:bg-white hover:text-primary"
            >
              <Link href={`/${locale}/carrieres`}>{t("ctas.join")}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white bg-transparent text-white hover:bg-white hover:text-primary"
            >
              <Link href={`/${locale}/formateurs`}>{t("ctas.trainer")}</Link>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>{t("reassurance.response")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>{t("reassurance.support")}</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
