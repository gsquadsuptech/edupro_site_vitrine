"use client"

import { Container } from "@/components/marketing/layout/container"
import { useTranslations } from "next-intl"

export function CaseStudySection() {
  const t = useTranslations("enterprises.caseStudy")

  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h3 className="mb-6 text-2xl font-bold">{t("challenge")}</h3>

            <div className="space-y-6">
              <div>
                <h4 className="mb-2 font-semibold text-primary">{t("before.title")}</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {(t.raw("before.items") as string[]).map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="mb-2 font-semibold text-primary">{t("after.title")}</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {(t.raw("after.items") as string[]).map((item, idx) => (
                    <li key={idx}>✓ {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden">
            <img
              src="/images/edupro-entreprise5.png"
              alt="Centre d'appels BPO avec analytics"
              className="h-full w-full object-cover rounded-xl"
            />
          </div>
        </div>

        <div className="mt-12 grid gap-6 rounded-xl border border-border bg-muted/30 p-8 md:grid-cols-3">
          <div>
            <div className="mb-2 text-3xl font-bold text-primary">-60%</div>
            <p className="text-sm text-muted-foreground">{t("results.costs")}</p>
          </div>
          <div>
            <div className="mb-2 text-3xl font-bold text-primary">6 semaines</div>
            <p className="text-sm text-muted-foreground">{t("results.productivity")}</p>
          </div>
          <div>
            <div className="mb-2 text-3xl font-bold text-primary">300%+</div>
            <p className="text-sm text-muted-foreground">{t("results.roi")}</p>
          </div>
        </div>
      </Container>
    </section>
  )
}
