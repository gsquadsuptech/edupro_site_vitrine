"use client"

import { Container } from "@/components/marketing/layout/container"
import { Globe, GraduationCap, Building2, UserCircle, DollarSign, Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"

export function VisionSection() {
  const t = useTranslations("investors.vision")

  const vision = [
    { icon: Globe, key: "countries" },
    { icon: GraduationCap, key: "learners" },
    { icon: Building2, key: "companies" },
    { icon: UserCircle, key: "trainers" },
    { icon: DollarSign, key: "arr" },
    { icon: Sparkles, key: "valuation" },
  ]

  const impact = [
    { key: "employment" },
    { key: "income" },
    { key: "women" },
    { key: "sdg" },
  ]

  return (
    <section className="bg-muted/30 py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t("title")}</h2>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <h3 className="mb-8 text-center text-xl font-bold">{t("aspirational.title")}</h3>
        <div className="mb-16 grid gap-6 md:grid-cols-3">
          {vision.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="rounded-lg border border-border bg-card p-6 text-center">
                <Icon className="mb-2 h-8 w-8 text-primary mx-auto" />
                <div className="mb-1 text-2xl font-bold text-primary">{t(`aspirational.${item.key}.value`)}</div>
                <div className="mb-1 font-semibold text-foreground">{t(`aspirational.${item.key}.label`)}</div>
                <div className="text-xs text-muted-foreground">{t(`aspirational.${item.key}.description`)}</div>
              </div>
            )
          })}
        </div>

        <h3 className="mb-8 text-center text-xl font-bold">{t("impact.title")}</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {impact.map((item, index) => (
            <div key={index} className="rounded-lg border border-primary/20 bg-primary/10 p-6 text-center">
              <div className="mb-2 text-3xl font-bold text-primary">{t(`impact.${item.key}.metric`)}</div>
              <p className="text-sm font-medium text-foreground">{t(`impact.${item.key}.description`)}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
