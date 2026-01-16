"use client"

import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Link from "next/link"

export function FormateursFAQSection() {
  const t = useTranslations("trainers.faq")
  const params = useParams()
  const locale = params?.locale || 'fr'
  const [openIndex, setOpenIndex] = useState(0)

  const questionKeys = ["technical", "time", "payment", "pricing", "refund", "existing", "promotion"]

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">{t("title")}</h2>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {questionKeys.map((key, index) => (
            <button
              key={index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              className="w-full text-left"
            >
              <div className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-bold">{t(`questions.${key}.q`)}</h3>
                  <ChevronDown
                    className={`h-5 w-5 text-primary transition-transform flex-shrink-0 ${openIndex === index ? "rotate-180" : ""}`}
                  />
                </div>
                {openIndex === index && (
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{t(`questions.${key}.a`)}</p>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="mb-6 text-muted-foreground">{t("another")}</p>
          <Button variant="outline" asChild>
            <Link href={`/${locale}/contact`}>
              {t("contact")}
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  )
}
