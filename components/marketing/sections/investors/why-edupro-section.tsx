"use client"

import { Container } from "@/components/marketing/layout/container"
import Image from "next/image"
import { Building2, GraduationCap, UserCircle, Bot, Smartphone, Globe, Users } from "lucide-react"
import { useTranslations } from "next-intl"

export function WhyEduProSection() {
  const t = useTranslations("investors.whyEdupro")

  const problems = [
    {
      icon: Building2,
      key: "enterprises",
    },
    {
      icon: GraduationCap,
      key: "professionals",
    },
    {
      icon: UserCircle,
      key: "trainers",
    },
  ]

  const differentiators = [
    {
      icon: Bot,
      key: "ai",
    },
    {
      icon: Smartphone,
      key: "mobile",
    },
    {
      icon: Globe,
      key: "panafrican",
    },
    {
      icon: Users,
      key: "team",
    },
  ]

  return (
    <section className="bg-muted/30 py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mb-16 grid gap-8 md:grid-cols-3">
          {problems.map((problem, index) => {
            const Icon = problem.icon
            return (
              <div key={index} className="rounded-lg border border-border bg-card p-6">
                <Icon className="mb-3 h-8 w-8 text-primary" />
                <h3 className="mb-4 font-bold text-foreground">{t(`problems.${problem.key}.title`)}</h3>
                <ul className="space-y-2">
                  {(t.raw(`problems.${problem.key}.points`) as string[]).map((point: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <div className="mb-16">
          <h3 className="mb-8 text-center text-2xl font-bold">{t("solution.title")}</h3>
          <div className="flex justify-center mb-8">
            <Image
              src="/images/marketplace-edupro.png"
              alt="EduPro Marketplace Architecture"
              width={600}
              height={300}
              className="rounded-lg border border-border"
            />
          </div>
          <p className="text-center text-lg font-semibold text-primary">
            {t("solution.description")}
          </p>
        </div>

        <div className="mb-12">
          <h3 className="mb-8 text-center text-2xl font-bold">{t("differentiators.title")}</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {differentiators.map((diff, index) => {
              const Icon = diff.icon
              return (
                <div key={index} className="rounded-lg border border-primary/20 bg-primary/5 p-6">
                  <Icon className="mb-3 h-8 w-8 text-primary" />
                  <h4 className="mb-2 font-bold text-foreground">{t(`differentiators.${diff.key}.title`)}</h4>
                  <p className="text-sm text-muted-foreground">{t(`differentiators.${diff.key}.description`)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
