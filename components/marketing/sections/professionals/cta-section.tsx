"use client"

import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageCircle, GraduationCap, Briefcase, Rocket, Target, CheckCircle2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Link from "next/link"

export function ProfessionalsCTASection() {
  const t = useTranslations("professionals.cta")
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-primary/5 to-chart-2/5">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        {/* CTA Options */}
        <div className="grid gap-6 md:grid-cols-2 mb-12 max-w-3xl mx-auto">
          <div className="rounded-xl border border-border bg-card p-6 text-center hover:shadow-lg transition-shadow">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 font-bold">{t("options.start.title")}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t("options.start.description")}</p>
            <Button asChild variant="outline" className="w-full gap-2 bg-transparent">
              <Link href={`/${locale}/catalogue`}>
                {t("options.start.cta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>


          <div className="rounded-xl border border-border bg-card p-6 text-center hover:shadow-lg transition-shadow">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
              <Target className="h-6 w-6 text-chart-4" />
            </div>
            <h3 className="mb-2 font-bold">{t("options.questions.title")}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t("options.questions.description")}</p>
            <Button asChild variant="outline" className="w-full gap-2 bg-transparent">
              <Link href={`/${locale}/contact`}>
                {t("options.questions.cta")}
                <MessageCircle className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Launch Offer */}
        <div className="max-w-2xl mx-auto mb-12 rounded-2xl border-2 border-primary/50 bg-gradient-to-r from-primary/10 to-chart-2/10 p-8 text-center">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wide">
              {t("launch.badge")}
            </span>
          </div>
          <h3 className="mb-4 text-2xl font-bold">{t("launch.title")}</h3>
          <ul className="space-y-2 mb-6 text-sm">
            {t.raw("launch.items").map((item: string, idx: number) => (
              <li key={idx} className="flex items-center justify-center gap-2">
                <span className="text-primary">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm font-semibold text-primary mb-6">{t("launch.note")}</p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white gap-2">
            <Link href={`/${locale}/inscription?tab=apprenant`}>
              {t("launch.cta")}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Final Reassurance */}
        <div className="grid gap-6 md:grid-cols-3 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <h4 className="mb-2 font-bold">{t("reassurance.quality.title")}</h4>
            <p className="text-sm text-muted-foreground">
              {t("reassurance.quality.description")}
            </p>
          </div>
          <div className="text-center">
            <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <h4 className="mb-2 font-bold">{t("reassurance.support.title")}</h4>
            <p className="text-sm text-muted-foreground">
              {t("reassurance.support.description")}
            </p>
          </div>
          <div className="text-center">
            <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <h4 className="mb-2 font-bold">{t("reassurance.riskFree.title")}</h4>
            <p className="text-sm text-muted-foreground">
              {t("reassurance.riskFree.description")}
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
