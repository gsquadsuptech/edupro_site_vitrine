"use client"

import { Container } from "@/components/marketing/layout/container"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useTranslations } from "next-intl"

export function InvestorFAQSection() {
  const t = useTranslations("investors.faq")
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqKeys = [
    "revenue",
    "valuation",
    "ticket",
    "lead",
    "profitability",
    "seriesA",
  ]

  return (
    <section className="bg-muted/30 py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t("title")}</h2>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {faqKeys.map((key, index) => (
            <div key={index} className="rounded-lg border border-border bg-card overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-muted/50 transition-colors"
              >
                <h3 className="font-semibold text-foreground">{t(`questions.${key}.q`)}</h3>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                />
              </button>

              {openIndex === index && (
                <div className="border-t border-border px-6 py-4 text-muted-foreground">
                  <p>{t(`questions.${key}.a`)}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
