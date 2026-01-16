"use client"

import { Container } from "@/components/marketing/layout/container"
import { useTranslations } from "next-intl"

export function ExtendedFAQSection() {
  const t = useTranslations("enterprises.extendedFaq")

  const categories = [
    {
      key: "support",
    },
    {
      key: "languages",
    },
    {
      key: "quality",
    },
  ]

  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="grid gap-8 md:grid-cols-2">
          {categories.map((category, catIdx) => {
            const categoryData = t.raw(`categories.${category.key}`) as any
            const questionKeys = Object.keys(categoryData.questions || {})
            return (
              <div key={catIdx}>
                <h3 className="mb-6 text-lg font-bold text-primary">{categoryData.category}</h3>
                <div className="space-y-4">
                  {questionKeys.map((qKey, idx) => (
                    <details
                      key={idx}
                      className="group rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md"
                    >
                      <summary className="flex cursor-pointer items-center justify-between font-semibold text-foreground">
                        {categoryData.questions[qKey].q}
                        <span className="transition-transform group-open:rotate-180">▼</span>
                      </summary>
                      <p className="mt-4 text-sm text-muted-foreground">{categoryData.questions[qKey].a}</p>
                    </details>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
