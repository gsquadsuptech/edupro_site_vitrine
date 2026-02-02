import { Container } from "@/components/marketing/layout/container"
import { CheckCircle2 } from "lucide-react"
import { useTranslations } from "next-intl"

export function HowItWorksSection() {
    const t = useTranslations("professionals.howItWorks")

    const steps = [
        {
            key: "choose",
            number: 1,
        },
        {
            key: "learn",
            number: 2,
        },
        {
            key: "certify",
            number: 3,
        },
    ]

    const experienceKeys = ["quality", "practical", "quizzes", "community"]

    return (
        <section className="py-20 md:py-32 bg-muted/30">
            <Container>
                {/* Main Timeline */}
                <div className="mb-20">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                            {t("title")}
                        </h2>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {steps.map((step, index) => {
                            const items = t.raw(`steps.${step.key}.items`) as string[]
                            return (
                                <div key={index} className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
                                            {step.number}
                                        </div>
                                        <h3 className="font-bold text-lg">{t(`steps.${step.key}.title`)}</h3>
                                    </div>

                                    <ul className="space-y-2">
                                        {items.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm">
                                                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <p className="text-xs text-muted-foreground italic bg-muted/50 p-2 rounded">{t(`steps.${step.key}.timing`)}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Experience Cards */}
                <div>
                    <div className="mb-12 text-center">
                        <h3 className="text-2xl md:text-3xl font-bold mb-2">{t("experience.title")}</h3>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {experienceKeys.map((key, index) => (
                            <div key={index} className="rounded-xl border border-border bg-card p-6">
                                <h4 className="mb-2 font-bold text-lg">{t(`experience.features.${key}.title`)}</h4>
                                <p className="mb-4 text-sm text-muted-foreground">{t(`experience.features.${key}.description`)}</p>
                                <div className="border-t border-border pt-3">
                                    <p className="text-sm font-medium text-primary italic">→ {t(`experience.features.${key}.benefit`)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    )
}
