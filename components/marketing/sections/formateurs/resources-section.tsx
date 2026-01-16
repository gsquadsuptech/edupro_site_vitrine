"use client"

import { Container } from "@/components/marketing/layout/container"
import { BookOpen, Users, Headphones, Share2 } from "lucide-react"
import { useTranslations } from "next-intl"

export function FormateursResourcesSection() {
  const t = useTranslations("trainers.resources")

  const resources = [
    {
      icon: BookOpen,
      key: "training",
    },
    {
      icon: Users,
      key: "community",
    },
    {
      icon: Headphones,
      key: "support",
    },
    {
      icon: Share2,
      key: "marketing",
    },
  ]

  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {resources.map((resource, index) => {
            const Icon = resource.icon
            const resourceData = t.raw(`resources.${resource.key}`) as any
            return (
              <div key={index} className="rounded-xl border border-border bg-card p-6">
                <Icon className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-4 font-bold">{resourceData.title}</h3>
                <ul className="space-y-2">
                  {(resourceData.items as string[]).map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary">•</span>
                      <span>{item}</span>
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
