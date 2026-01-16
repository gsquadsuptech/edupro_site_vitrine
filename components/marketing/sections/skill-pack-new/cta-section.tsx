"use client"

import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { ArrowRight, Rocket } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"

import { LearningPath } from "@/lib/supabase/types"

interface SkillPackCTAProps {
  skillPack?: LearningPath
}

export function SkillPackCTA({ skillPack }: SkillPackCTAProps) {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const t = useTranslations("common")

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

      <Container>
        <div className="relative">
          {/* Main CTA card */}
          <div className="relative bg-gradient-to-br from-violet-600 via-fuchsia-600 to-violet-700 rounded-3xl p-12 md:p-16 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />

            <div className="relative text-center max-w-3xl mx-auto">
              {/* Icon */}
              <div className="inline-flex p-4 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
                <Rocket className="h-8 w-8 text-white" />
              </div>

              {/* Heading */}
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-pretty">
                {t("skillPackCta.title")}
              </h2>

              {/* Description */}
              <p className="text-xl text-violet-100 mb-8 text-balance">
                {t("skillPackCta.subtitle")}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-violet-600 hover:bg-slate-100 font-semibold text-base px-8 py-6"
                >
                  <Link href={`/${locale}/inscription`} aria-label={t("skillPackCta.primary")}>
                    {t("skillPackCta.primary")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 font-semibold text-base px-8 py-6 bg-transparent"
                >
                  <Link href={`/${locale}/contact`} aria-label={t("skillPackCta.secondary")}>
                    {t("skillPackCta.secondary")}
                  </Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-12 pt-8 border-t border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">92%</div>
                  <div className="text-sm text-violet-100">{t("skillPackCta.stats.successRateLabel")}</div>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">4.8/5</div>
                  <div className="text-sm text-violet-100">{t("skillPackCta.stats.averageRatingLabel")}</div>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">30 jours</div>
                  <div className="text-sm text-violet-100">{t("skillPackCta.stats.refundGuaranteeLabel")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
