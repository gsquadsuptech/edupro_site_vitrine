"use client"

import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Link from "next/link"

export function FormateursFinalCTASection() {
  const t = useTranslations("trainers.finalCta")
  const params = useParams()
  const locale = params?.locale || 'fr'

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-chart-2/10">
      <Container>
        <div className="text-center">
          <h2 className="mb-6 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">{t("subtitle")}</p>

          <p className="mb-12 max-w-2xl mx-auto text-lg">
            {t("description")}
          </p>

          <div className="mb-8 flex flex-col gap-4 sm:flex-row justify-center">
            <Button size="lg" className="group bg-gradient-to-r from-primary to-chart-2" asChild>
              <Link href={`/${locale}/formateurs/candidature`}>
                {t("ctas.starter")}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={`/${locale}/demande-demo?type=institute`}>
                {t("ctas.academy")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={`/${locale}/formateurs/candidature?bootcamp=true`}>
                {t("ctas.certified")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={`/${locale}/contact`}>
                {t("ctas.partner")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          <div className="rounded-lg bg-muted/50 border border-border p-4 max-w-md mx-auto">
            <p className="text-sm text-muted-foreground">
              {t("features")}
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
