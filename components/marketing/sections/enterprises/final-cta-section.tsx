"use client"

import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, TrendingUp, Users } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams } from "next/navigation"

export function FinalCTASection() {
  const t = useTranslations("enterprises.finalCta")
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'

  return (
    <section className="bg-gradient-to-br from-primary/5 to-chart-2/5 py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mb-12 flex justify-center">
          <div className="w-full max-w-md rounded-xl border-2 border-primary bg-card p-8 text-center">
            <h3 className="mb-6 text-xl font-bold">{t("demo.title")}</h3>
            <ul className="mb-8 space-y-3 text-sm text-muted-foreground">
              {(t.raw("demo.items") as string[]).map((item, idx) => (
                <li key={idx} className="flex items-center justify-center gap-2">
                  <span className="text-primary">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Button size="lg" className="w-full bg-gradient-to-r from-primary to-chart-2 text-primary-foreground" asChild>
              <Link href={`/${locale}/demande-demo`}>
                {t("demo.cta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-primary/10 p-6 text-center">
            <Zap className="mx-auto mb-3 h-8 w-8 text-primary" />
            <h4 className="mb-2 font-semibold">{t("benefits.deployment.title")}</h4>
            <p className="text-sm text-muted-foreground">{t("benefits.deployment.description")}</p>
          </div>
          <div className="rounded-lg bg-primary/10 p-6 text-center">
            <TrendingUp className="mx-auto mb-3 h-8 w-8 text-primary" />
            <h4 className="mb-2 font-semibold">{t("benefits.roi.title")}</h4>
            <p className="text-sm text-muted-foreground">{t("benefits.roi.description")}</p>
          </div>
          <div className="rounded-lg bg-primary/10 p-6 text-center">
            <Users className="mx-auto mb-3 h-8 w-8 text-primary" />
            <h4 className="mb-2 font-semibold">{t("benefits.support.title")}</h4>
            <p className="text-sm text-muted-foreground">{t("benefits.support.description")}</p>
          </div>
        </div>

        <div className="rounded-xl border-2 border-primary bg-primary/10 p-8 text-center">
          <h3 className="mb-4 text-xl font-bold">{t("launch.title")}</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            {t("launch.description")}
          </p>
          <ul className="mb-6 space-y-2 text-sm">
            {(t.raw("launch.items") as string[]).map((item, idx) => (
              <li key={idx} className="flex items-center justify-center gap-2">
                <span className="text-primary">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="font-semibold text-primary">{t("launch.remaining")}</p>
        </div>
      </Container>
    </section>
  )
}
