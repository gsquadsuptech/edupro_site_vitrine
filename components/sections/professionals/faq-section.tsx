"use client"

import { Container } from "@/components/marketing/layout/container"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useTranslations } from "next-intl"

export function FAQSection() {
    const t = useTranslations("professionals.faq")
    const [openIndex, setOpenIndex] = useState<string | null>(null)

    const categories = [
        {
            key: "registration",
            questions: ["account", "payment", "lifetime"],
        },
        {
            key: "content",
            questions: ["formats", "prerequisites", "languages", "mobile", "offline"],
        },
        {
            key: "certifications",
            questions: ["quality", "employment"],
        },
        {
            key: "pedagogy",
            questions: ["updated"],
        },
        {
            key: "other",
            questions: ["countries", "friends"],
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
                    {categories.map((cat) => (
                        <div key={cat.key}>
                            <h3 className="text-lg font-bold mb-4 text-primary">{t(`categories.${cat.key}.category`)}</h3>
                            <div className="space-y-3">
                                {cat.questions.map((qKey) => {
                                    const itemKey = `${cat.key}-${qKey}`
                                    const isOpen = openIndex === itemKey

                                    return (
                                        <div
                                            key={qKey}
                                            className="rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow"
                                        >
                                            <button
                                                onClick={() => setOpenIndex(isOpen ? null : itemKey)}
                                                className="w-full px-6 py-4 flex items-center justify-between bg-card hover:bg-muted/50 transition-colors"
                                            >
                                                <h4 className="text-left font-semibold text-sm md:text-base">
                                                    {t(`categories.${cat.key}.questions.${qKey}.q`)}
                                                </h4>
                                                <ChevronDown
                                                    className={`h-5 w-5 flex-shrink-0 text-primary transition-transform ${isOpen ? "rotate-180" : ""}`}
                                                />
                                            </button>
                                            {isOpen && (
                                                <div className="px-6 py-4 bg-muted/30 border-t border-border">
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        {t(`categories.${cat.key}.questions.${qKey}.a`)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    )
}
