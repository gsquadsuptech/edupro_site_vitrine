"use client"

import { Container } from "@/components/marketing/layout/container"
import { useState } from "react"
import { ChevronDown, Smartphone, BookOpen, Trophy, GraduationCap, Globe } from "lucide-react"
import { useTranslations } from "next-intl"

export function FAQSection() {
  const t = useTranslations("professionals.faq")
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqCategories = [
    {
      categoryKey: "registration",
      icon: Smartphone,
    },
    {
      categoryKey: "content",
      icon: BookOpen,
    },
    {
      categoryKey: "certifications",
      icon: Trophy,
    },
    {
      categoryKey: "pedagogy",
      icon: GraduationCap,
    },
    {
      categoryKey: "other",
      icon: Globe,
    },
  ]

  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">{t("title")}</h2>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          {faqCategories.map((category, catIndex) => {
            const Icon = category.icon
            const categoryData = t.raw(`categories.${category.categoryKey}`) as any
            const questions = Object.keys(categoryData.questions || {})
            return (
              <div key={catIndex}>
                <h3 className="text-lg font-bold mb-4 text-primary flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {categoryData.category}
                </h3>
              <div className="space-y-3">
                {questions.map((questionKey, itemIndex) => {
                  const question = categoryData.questions[questionKey]
                  return (
                    <div
                      key={itemIndex}
                      className="rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <button
                        onClick={() =>
                          setOpenIndex(openIndex === catIndex * 100 + itemIndex ? null : catIndex * 100 + itemIndex)
                        }
                        className="w-full px-6 py-4 flex items-center justify-between bg-card hover:bg-muted/50 transition-colors"
                      >
                        <h4 className="text-left font-semibold text-sm md:text-base">{question.q}</h4>
                        <ChevronDown
                          className={`h-5 w-5 flex-shrink-0 text-primary transition-transform ${
                            openIndex === catIndex * 100 + itemIndex ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openIndex === catIndex * 100 + itemIndex && (
                        <div className="px-6 py-4 bg-muted/30 border-t border-border">
                          <p className="text-sm text-muted-foreground leading-relaxed">{question.a}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
          })}
        </div>
      </Container>
    </section>
  )
}
