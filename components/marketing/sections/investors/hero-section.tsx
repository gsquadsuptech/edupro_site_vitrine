"use client"

import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

export function InvestorsHeroSection() {
  const t = useTranslations("investors.hero")
  
  // Debug: vérifier si les traductions sont chargées
  const subtitleRaw = t.raw("subtitle")
  const subtitleTranslated = t("subtitle")
  const subtitle = (typeof subtitleRaw === 'string' ? subtitleRaw : subtitleTranslated) || "investors.hero.subtitle"

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-chart-2/5 to-accent/5 py-20 md:py-32">
      <Container>
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-balance text-4xl font-bold md:text-5xl lg:text-6xl">
            {t("title")}
            <br />
            {t("titleLine2")}
            <br />
            <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h1>

          <p className="mb-8 text-balance text-lg text-muted-foreground md:text-xl" dangerouslySetInnerHTML={{ __html: subtitle }} />

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-chart-2 text-primary-foreground hover:opacity-90"
              onClick={() => {
                const formSection = document.getElementById('investor-form-section')
                if (formSection) {
                  formSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
            >
              {t("cta.primary")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card/50 p-6">
              <div className="text-sm font-medium text-muted-foreground">{t("stats.trainers")}</div>
              <div className="mt-2 text-3xl font-bold">{t("stats.trainersValue")}</div>
              <div className="text-xs text-muted-foreground">{t("stats.trainersSub")}</div>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-6">
              <div className="text-sm font-medium text-muted-foreground">{t("stats.courses")}</div>
              <div className="mt-2 text-3xl font-bold">{t("stats.coursesValue")}</div>
              <div className="text-xs text-muted-foreground">{t("stats.coursesSub")}</div>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-6">
              <div className="text-sm font-medium text-muted-foreground">{t("stats.launch")}</div>
              <div className="mt-2 text-3xl font-bold">{t("stats.launchValue")}</div>
              <div className="text-xs text-muted-foreground">{t("stats.launchSub")}</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
