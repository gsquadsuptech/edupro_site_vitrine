"use client"

import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Link from "next/link"

export function FormateursPricingSection() {
  const t = useTranslations("trainers.pricing")
  const params = useParams()
  const locale = params?.locale || 'fr'

  return (
    <section id="pricing" className="py-20 md:py-32 bg-muted/30">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* TEACH Starter */}
          <div className="rounded-2xl border border-border bg-card p-8 flex flex-col">
            <h3 className="mb-2 text-xl font-bold">{t("plans.starter.name")}</h3>
            <p className="mb-4 text-sm font-semibold text-primary">{t("plans.starter.subtitle")}</p>
            <p className="mb-4 text-xs text-muted-foreground">{t("plans.starter.position")}</p>
            <div className="mb-6 border-t border-border pt-6">
              <p className="text-sm font-semibold text-primary mb-2">{t("plans.starter.pricing.free")}</p>
              <p className="text-xs text-muted-foreground mb-2">{t("plans.starter.pricing.freeNote")}</p>
              <p className="text-sm font-semibold text-primary">{t("plans.starter.pricing.pro")}</p>
              <p className="text-xs text-muted-foreground">{t("plans.starter.pricing.proNote")}</p>
            </div>
            <ul className="mb-8 space-y-2 text-xs flex-grow">
              {(t.raw("plans.starter.features") as string[]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full bg-transparent text-xs mt-auto" asChild>
              <Link href={`/${locale}/formateurs/candidature`}>
                {t("plans.starter.cta")}
              </Link>
            </Button>
          </div>

          {/* TEACH Academy */}
          <div className="rounded-2xl border-2 border-primary bg-gradient-to-br from-primary/10 to-chart-2/10 p-8 relative flex flex-col">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
              ⭐ {t("plans.academy.popular")}
            </div>
            <h3 className="mb-2 text-xl font-bold">{t("plans.academy.name")}</h3>
            <p className="mb-4 text-sm font-semibold text-primary">{t("plans.academy.subtitle")}</p>
            <p className="mb-4 text-xs text-muted-foreground">{t("plans.academy.position")}</p>
            <div className="mb-6 border-t border-border pt-6">
              <p className="text-sm font-semibold text-primary mb-2">{t("plans.academy.pricing.starter")}</p>
              <p className="text-xs text-muted-foreground mb-2">{t("plans.academy.pricing.starterPrice")}</p>
              <p className="text-sm font-semibold text-primary mb-2">{t("plans.academy.pricing.growth")}</p>
              <p className="text-xs text-muted-foreground mb-2">{t("plans.academy.pricing.growthPrice")}</p>
              <p className="text-sm font-semibold text-primary mb-2">{t("plans.academy.pricing.enterprise")}</p>
              <p className="text-xs text-muted-foreground">{t("plans.academy.pricing.enterprisePrice")}</p>
            </div>
            <ul className="mb-8 space-y-2 text-xs flex-grow">
              {(t.raw("plans.academy.features") as string[]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full bg-primary hover:bg-primary/90 text-xs mt-auto" asChild>
              <Link href={`/${locale}/demande-demo?type=institute`}>
                {t("plans.academy.cta")}
              </Link>
            </Button>
          </div>

          {/* TEACH Certified */}
          <div className="rounded-2xl border border-border bg-card p-8 flex flex-col">
            <h3 className="mb-2 text-xl font-bold">{t("plans.certified.name")}</h3>
            <p className="mb-4 text-sm font-semibold text-primary">{t("plans.certified.subtitle")}</p>
            <p className="mb-4 text-xs text-muted-foreground">{t("plans.certified.position")}</p>
            <div className="mb-6 border-t border-border pt-6">
              <p className="text-sm font-semibold text-primary mb-2">{t("plans.certified.pricing.price")}</p>
              <p className="text-xs text-muted-foreground">{t("plans.certified.pricing.validity")}</p>
            </div>
            <p className="mb-4 text-xs font-semibold text-primary">{t("plans.certified.program")}</p>
            <ul className="mb-8 space-y-2 text-xs flex-grow">
              {(t.raw("plans.certified.programItems") as string[]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <ul className="mb-8 space-y-2 text-xs flex-grow">
              {(t.raw("plans.certified.features") as string[]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full bg-transparent text-xs mt-auto" asChild>
              <Link href={`/${locale}/formateurs/candidature?bootcamp=true`}>
                {t("plans.certified.cta")}
              </Link>
            </Button>
          </div>

          {/* TEACH Partner */}
          <div className="rounded-2xl border border-border bg-card p-8 flex flex-col">
            <h3 className="mb-2 text-xl font-bold">{t("plans.partner.name")}</h3>
            <p className="mb-4 text-sm font-semibold text-primary">{t("plans.partner.subtitle")}</p>
            <p className="mb-4 text-xs text-muted-foreground">{t("plans.partner.position")}</p>
            <div className="mb-6 border-t border-border pt-6">
              <p className="text-sm font-semibold text-primary mb-2">{t("plans.partner.structure")}</p>
            </div>
            <p className="mb-4 text-xs font-semibold text-primary">{t("plans.partner.model")}</p>
            <ul className="mb-8 space-y-2 text-xs flex-grow">
              {(t.raw("plans.partner.features") as string[]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full bg-transparent text-xs mt-auto" asChild>
              <Link href={`/${locale}/contact`}>
                {t("plans.partner.cta")}
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-primary/5 border border-primary/20 p-4 text-center text-sm text-muted-foreground">
          <p>
            Pas de frais cachés · Commissions versées en moins de 30 jours · Paiements sécurisés · Factures automatiques
          </p>
        </div>
      </Container>
    </section>
  )
}
