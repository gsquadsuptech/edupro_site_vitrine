"use client"

import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { ArrowRight, Building2, User, GraduationCap, Users, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import eduproHome from "@/assets/images/edupro-home.png"
import eduproHome5 from "@/assets/images/edupro-home5.png"
import eduproHome6 from "@/assets/images/edupro-home6.png"
import eduproHome7 from "@/assets/images/edupro-home7.png"
import { useTranslations } from "next-intl"

export function AudienceCards() {
  const t = useTranslations("landing.audienceCards")

  const audiences = [
    {
      icon: Building2,
      key: "enterprises",
      gradient: "from-primary/10 to-chart-2/10",
      image: eduproHome,
    },
    {
      icon: GraduationCap,
      key: "professionals",
      gradient: "from-chart-2/10 to-accent/10",
      image: eduproHome5,
    },
    {
      icon: Users,
      key: "trainers",
      gradient: "from-accent/10 to-primary/10",
      image: eduproHome6,
    },
    {
      icon: TrendingUp,
      key: "investors",
      gradient: "from-chart-4/10 to-chart-5/10",
      image: eduproHome7,
    },
  ]

  return (
    <section id="audiences" className="py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {audiences.map((audience, index) => {
            const Icon = audience.icon
            return (
              <div
                key={index}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:scale-[1.02] hover:shadow-2xl"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={audience.image || "/placeholder.svg"}
                    alt={t(`${audience.key}.title`)}
                    width={400}
                    height={300}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                <div className="p-8">
                  <div className={`mb-6 inline-flex rounded-xl bg-gradient-to-br ${audience.gradient} p-4`}>
                    <Icon className="h-10 w-10 text-primary" />
                  </div>

                  <h3 className="mb-3 text-sm font-bold tracking-wide text-primary">
                    {t(`${audience.key}.title`)}
                  </h3>
                  <p className="mb-6 text-xl font-bold leading-tight">
                    {t(`${audience.key}.headline`)}
                  </p>

                  <ul className="mb-6 space-y-3">
                    {[0, 1, 2, 3].map((idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="mt-0.5 text-primary">✓</span>
                        <span className="text-muted-foreground">
                          {t(`${audience.key}.benefits.${idx}`)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mb-6 rounded-lg bg-muted/50 p-4">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t(`${audience.key}.caseStudy.title`)}
                    </p>
                    <p className="font-semibold text-foreground">
                      {t(`${audience.key}.caseStudy.result`)}
                    </p>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full bg-transparent group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    <Link href={t(`${audience.key}.ctaLink`)}>
                      {t(`${audience.key}.cta`)}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
