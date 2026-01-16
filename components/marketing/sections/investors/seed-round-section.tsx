"use client"

import { Container } from "@/components/marketing/layout/container"
import { useTranslations } from "next-intl"

export function SeedRoundSection() {
  const t = useTranslations("investors.seedRound")

  const fundUses = [
    {
      key: "acquisition",
    },
    {
      key: "product",
    },
    {
      key: "operations",
    },
    {
      key: "expansion",
    },
  ]

  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t("title")}</h2>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mb-12 rounded-xl border border-primary/20 bg-primary/5 p-8 md:p-12">
          <div className="text-center">
            <h3 className="mb-4 text-2xl font-bold">{t("structure.title")}</h3>
            <div className="mb-4 text-lg text-muted-foreground">
              <div>{t("structure.amount")}</div>
              <div className="mt-2 font-semibold text-foreground">{t("structure.amountNote")}</div>
            </div>
            <div className="mt-6 flex flex-col gap-2 text-sm">
              <div>
                <span className="font-semibold">{t("structure.stage")}</span> {t("structure.stageValue")}
              </div>
              <div>
                <span className="font-semibold">{t("structure.closing")}</span> {t("structure.closingValue")}
              </div>
            </div>
          </div>
        </div>

        <h3 className="mb-8 text-center text-2xl font-bold">{t("fundUses.title")}</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {fundUses.map((use, index) => {
            const useData = t.raw(`fundUses.${use.key}`) as any
            return (
              <div key={index} className="rounded-lg border border-border bg-card p-6">
                <div className="mb-4">
                  <div className="mb-1 text-3xl font-bold text-primary">{useData.percentage}</div>
                  <div className="font-bold text-foreground">{useData.title}</div>
                </div>
                <ul className="space-y-2">
                  {(useData.items as string[]).map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
