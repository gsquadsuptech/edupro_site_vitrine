"use client"

import { Container } from "@/components/marketing/container"
import { XCircle, TrendingDown, Clock, Search } from "lucide-react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import eduproHome2a from "@/assets/images/edupro-home2a.png"
import { useTranslations } from "next-intl"

export function ProblemSection() {
  const t = useTranslations("landing.problem")

  const problems = [
    {
      title: t("problems.limitedAccess.title"),
      stat: t("problems.limitedAccess.stat"),
      description: t("problems.limitedAccess.description"),
      consequence: t("problems.limitedAccess.consequence"),
    },
    {
      title: t("problems.inadequateSolutions.title"),
      stat: t("problems.inadequateSolutions.stat"),
      description: t("problems.inadequateSolutions.description"),
      consequence: t("problems.inadequateSolutions.consequence"),
    },
    {
      title: t("problems.unexploitedExpertise.title"),
      stat: t("problems.unexploitedExpertise.stat"),
      description: t("problems.unexploitedExpertise.description"),
      consequence: t("problems.unexploitedExpertise.consequence"),
    },
    {
      title: t("problems.invisibleROI.title"),
      stat: t("problems.invisibleROI.stat"),
      description: t("problems.invisibleROI.description"),
      consequence: t("problems.invisibleROI.consequence"),
    },
  ]

  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="mb-12 overflow-hidden rounded-2xl">
          <Image
            src={eduproHome2a}
            alt="Skills gap challenges in Africa"
            width={1200}
            height={400}
            className="h-64 w-full object-cover md:h-80"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {problems.map((problem, index) => (
            <div key={index} className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-lg">
              <XCircle className="mb-4 h-8 w-8 text-destructive" />
              <h3 className="mb-2 text-xl font-semibold">{problem.title}</h3>
              <div className="mb-3 text-2xl font-bold text-primary">{problem.stat}</div>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{problem.description}</p>
              <p className="text-sm font-medium text-foreground">
                <strong>Conséquence:</strong> {problem.consequence}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg italic text-muted-foreground">{t("closing")}</p>
        </div>
      </Container>
    </section>
  )
}

