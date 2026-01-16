"use client"

import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { ArrowRight, GraduationCap, Building2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Link from "next/link"

export function FormateursSolutionSection() {
  const t = useTranslations("trainers.solution")
  const params = useParams()
  const locale = params?.locale || 'fr'

  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mb-12 rounded-xl border border-border bg-card/50 p-8 text-center">
          <p className="text-lg leading-relaxed">
            {t("description")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Formateurs Indépendants */}
          <div className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-chart-2/5 p-8">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-bold">{t("independent.title")}</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              {t("independent.subtitle")}
            </p>

            <ul className="mb-8 space-y-3">
              {(t.raw("independent.features") as string[]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 text-primary font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mb-6 rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-xs font-semibold uppercase text-muted-foreground">{t("independent.examples")}</p>
              <p className="text-sm font-medium">{t("independent.examplesList")}</p>
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90" asChild>
              <Link href={`/${locale}/formateurs/candidature`}>
                {t("independent.cta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Instituts de Formation */}
          <div className="rounded-2xl border-2 border-chart-2/30 bg-gradient-to-br from-chart-2/5 to-accent/5 p-8">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/20">
              <Building2 className="h-6 w-6 text-chart-2" />
            </div>
            <h3 className="mb-2 text-xl font-bold">{t("institutes.title")}</h3>
            <p className="mb-6 text-sm text-muted-foreground">{t("institutes.subtitle")}</p>

            <ul className="mb-8 space-y-3">
              {(t.raw("institutes.features") as string[]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 text-chart-2 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mb-6 rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-xs font-semibold uppercase text-muted-foreground">{t("institutes.ideal")}</p>
              <p className="text-sm font-medium">{t("institutes.idealList")}</p>
            </div>

            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href={`/${locale}/demande-demo?type=institute`}>
                {t("institutes.cta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
