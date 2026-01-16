"use client"

import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Link from "next/link"

export function FormateursProcessSection() {
  const t = useTranslations("trainers.process")
  const params = useParams()
  const locale = params?.locale || 'fr'

  const steps = [
    {
      key: "application",
    },
    {
      key: "qualification",
    },
    {
      key: "onboarding",
    },
    {
      key: "launch",
    },
  ]

  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">{t("title")}</h2>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const stepData = t.raw(`steps.${step.key}`) as any
            return (
              <div key={index} className="relative">
                <div className="rounded-xl border border-border bg-card p-6 h-full">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 font-bold text-primary text-lg">
                    {stepData.number}
                  </div>
                  <h3 className="mb-2 font-bold">{stepData.title}</h3>
                  <p className="mb-3 text-sm font-semibold text-muted-foreground">{stepData.subtitle}</p>
                  <p className="mb-4 text-sm text-muted-foreground">{stepData.description}</p>
                  <p className="text-xs italic text-chart-5">{stepData.note}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2">
                    <ArrowRight className="h-5 w-5 text-primary/50" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" className="bg-gradient-to-r from-primary to-chart-2" asChild>
            <Link href={`/${locale}/inscription?tab=formateur`}>
              {t("cta")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  )
}
