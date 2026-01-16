"use client"

import { Container } from "@/components/marketing/layout/container"
import { XCircle } from "lucide-react"
import { useTranslations } from "next-intl"

export function FormateursProblemsSection() {
  const t = useTranslations("trainers.problems")

  const problems = [
    {
      key: "reach",
    },
    {
      key: "tools",
    },
    {
      key: "visibility",
    },
    {
      key: "management",
    },
  ]

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {problems.map((problem, index) => (
            <div key={index} className="rounded-xl border border-border bg-card p-8 hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-flex rounded-lg bg-destructive/10 p-3">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="mb-3 text-xl font-bold">{t(`problems.${problem.key}.title`)}</h3>
              <p className="mb-4 text-muted-foreground">{t(`problems.${problem.key}.description`)}</p>
              <p className="text-sm italic text-chart-5">
                <strong>Conséquence:</strong> {t(`problems.${problem.key}.consequence`)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg italic text-muted-foreground">
            {t("closing")}
          </p>
        </div>
      </Container>
    </section>
  )
}
