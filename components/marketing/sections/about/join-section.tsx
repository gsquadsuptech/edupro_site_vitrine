"use client"

import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { Briefcase, GraduationCap, Handshake, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"

export function JoinSection() {
  const t = useTranslations("about.join")
  const params = useParams()
  const locale = params?.locale || 'fr'

  const opportunities = [
    {
      icon: Briefcase,
      key: "careers",
      ctaLink: `/${locale}/carrieres`,
    },
    {
      icon: GraduationCap,
      key: "trainer",
      ctaLink: `/${locale}/formateurs`,
    },
    {
      icon: Handshake,
      key: "partner",
      ctaLink: "#contact",
    },
  ]

  return (
    <section className="bg-muted/30 py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">{t("title")}</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {opportunities.map((opportunity, index) => {
            const Icon = opportunity.icon
            const oppData = t.raw(`opportunities.${opportunity.key}`) as any
            return (
              <div
                key={index}
                className="flex flex-col rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg"
              >
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-8 w-8 text-primary" />
                </div>

                <h3 className="mb-2 text-xl font-bold">{oppData.title}</h3>
                <p className="mb-4 text-sm font-medium text-muted-foreground">{oppData.subtitle}</p>

                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{oppData.description}</p>

                <div className="mb-6 space-y-2">
                  <ul className="space-y-2">
                    {(oppData.benefits as string[]).map((benefit: string, idx: number) => (
                      <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="text-primary">•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {oppData.note && (
                  <p className="mb-6 text-sm text-muted-foreground">
                    <strong className="text-foreground">
                      {index === 0 ? "Profils recherchés: " : index === 1 ? "Domaines recherchés: " : ""}
                    </strong>
                    {oppData.note}
                  </p>
                )}

                <div className="mt-auto">
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href={opportunity.ctaLink}>
                      {oppData.cta}
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
