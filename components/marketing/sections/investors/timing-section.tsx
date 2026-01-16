"use client"

import { Container } from "@/components/marketing/layout/container"
import { Smartphone, CreditCard, GraduationCap, Briefcase, Globe, Users } from "lucide-react"
import { useTranslations } from "next-intl"

export function TimingSection() {
  const t = useTranslations("investors.timing")
  
  // Debug: vérifier si les traductions sont chargées
  const windowRaw = t.raw("window")
  const windowTranslated = t("window")
  const windowText = (typeof windowRaw === 'string' ? windowRaw : windowTranslated) || "investors.timing.window"

  const catalysts = [
    {
      icon: Smartphone,
      key: "mobile",
    },
    {
      icon: CreditCard,
      key: "mobileMoney",
    },
    {
      icon: GraduationCap,
      key: "policies",
    },
    {
      icon: Briefcase,
      key: "talent",
    },
    {
      icon: Globe,
      key: "momentum",
    },
    {
      icon: Users,
      key: "demographic",
    },
  ]

  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t("title")}</h2>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {catalysts.map((catalyst, index) => {
            const Icon = catalyst.icon
            const catalystData = t.raw(`catalysts.${catalyst.key}`) as any
            return (
              <div key={index} className="rounded-lg border border-border bg-card p-6 hover:shadow-lg transition-all">
                <Icon className="mb-3 h-8 w-8 text-primary" />
                <h3 className="mb-3 font-bold text-foreground">{catalystData.title}</h3>
                <ul className="space-y-2">
                  {(catalystData.points as string[]).map((point: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <div className="mt-12 rounded-lg border-2 border-primary/20 bg-primary/5 p-8 text-center">
          <p className="text-lg font-semibold text-foreground" dangerouslySetInnerHTML={{ __html: windowText }} />
        </div>
      </Container>
    </section>
  )
}
