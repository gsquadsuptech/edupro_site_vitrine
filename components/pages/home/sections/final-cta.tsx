"use client"

import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import eduproHome2 from "@/assets/images/edupro-home2.png"
import { Building2, GraduationCap, Users, TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"

export function FinalCTA() {
  const t = useTranslations("landing.finalCTA")

  const ctas = [
    {
      icon: Building2,
      key: "enterprises",
    },
    {
      icon: GraduationCap,
      key: "professionals",
    },
    {
      icon: Users,
      key: "trainers",
    },
    {
      icon: TrendingUp,
      key: "investors",
    },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-chart-2/10 to-accent/10 py-20 md:py-32">
      <div className="absolute inset-0 opacity-10">
        <Image
          src={eduproHome2}
          alt="Background"
          fill
          className="object-cover"
        />
      </div>

      <Container className="relative z-10">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
        </div>

        <div className="mx-auto mb-12 grid max-w-4xl gap-6">
          {ctas.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-6 transition-all hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-gradient-to-br from-primary/10 to-chart-2/10 p-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-bold tracking-wide text-primary">
                        {t(`ctas.${item.key}.title`)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t(`ctas.${item.key}.subtitle`)}
                      </div>
                    </div>
                  </div>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-primary to-chart-2 text-primary-foreground hover:opacity-90"
                  >
                    <Link href={t(`ctas.${item.key}.href`)}>
                      {t(`ctas.${item.key}.cta`)}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mx-auto max-w-3xl rounded-xl border border-border bg-card p-8">
          <div className="grid gap-4 md:grid-cols-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span className="text-muted-foreground">{t(`reassurances.${index}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
