"use client"

import { Container } from "@/components/marketing/layout/container"
import { CheckCircle2, Zap, Smartphone, GraduationCap } from "lucide-react"
import { useTranslations } from "next-intl"

export function HowItWorksSection() {
  const t = useTranslations("professionals.howItWorks")

  const steps = [
    {
      number: 1,
      title: t("steps.choose.title"),
      items: t.raw("steps.choose.items") as string[],
      timing: t("steps.choose.timing"),
      timingIcon: Zap,
    },
    {
      number: 2,
      title: t("steps.learn.title"),
      items: t.raw("steps.learn.items") as string[],
      timing: t("steps.learn.timing"),
      timingIcon: Smartphone,
    },
    {
      number: 3,
      title: t("steps.certify.title"),
      items: t.raw("steps.certify.items") as string[],
      timing: t("steps.certify.timing"),
      timingIcon: GraduationCap,
    },
  ]

  const experience = [
    {
      title: t("experience.features.quality.title"),
      description: t("experience.features.quality.description"),
      benefit: t("experience.features.quality.benefit"),
    },
    {
      title: t("experience.features.practical.title"),
      description: t("experience.features.practical.description"),
      benefit: t("experience.features.practical.benefit"),
    },
    {
      title: t("experience.features.quizzes.title"),
      description: t("experience.features.quizzes.description"),
      benefit: t("experience.features.quizzes.benefit"),
    },
    {
      title: t("experience.features.community.title"),
      description: t("experience.features.community.description"),
      benefit: t("experience.features.community.benefit"),
    },
  ]

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <Container>
        {/* Main Timeline */}
        <div className="mb-20">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
              {t("title")}
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => {
              const TimingIcon = step.timingIcon
              return (
                <div key={index} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
                      {step.number}
                    </div>
                    <h3 className="font-bold text-lg">{step.title}</h3>
                  </div>

                  <ul className="space-y-2">
                    {step.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-xs text-muted-foreground italic bg-muted/50 p-2 rounded flex items-center gap-2">
                    {TimingIcon && <TimingIcon className="h-4 w-4 text-primary" />}
                    {step.timing}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Experience Cards */}
        <div>
          <div className="mb-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">{t("experience.title")}</h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {experience.map((exp, index) => (
              <div key={index} className="rounded-xl border border-border bg-card p-6">
                <h4 className="mb-2 font-bold text-lg">{exp.title}</h4>
                <p className="mb-4 text-sm text-muted-foreground">{exp.description}</p>
                <div className="border-t border-border pt-3">
                  <p className="text-sm font-medium text-primary italic">→ {exp.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
