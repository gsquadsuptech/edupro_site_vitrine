"use client"

import { Container } from "@/components/marketing/layout/container"
import { MapPin } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

export function GeographicCoverage() {
  const t = useTranslations("landing.geographicCoverage")

  const countries = [
    {
      flag: "🇸🇳",
      key: "senegal",
      image: "/dakar-senegal-modern-cityscape.jpg",
    },
    {
      flag: "🇨🇮",
      key: "ivoryCoast",
      image: "/abidjan-ivory-coast-skyline.jpg",
    },
    {
      flag: "🇷🇼",
      key: "rwanda",
      image: "/kigali-rwanda-modern-cityscape.jpg",
    },
  ]

  return (
    <section className="bg-muted/30 py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {countries.map((country, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:scale-105 hover:shadow-xl"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={country.image || "/placeholder.svg"}
                  alt={`${t(`${country.key}.city`)}, ${t(`${country.key}.name`)}`}
                  width={400}
                  height={300}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-8">
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-4xl">{country.flag}</span>
                  <div>
                    <div className="text-lg font-bold">{t(`${country.key}.name`)}</div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {t(`${country.key}.city`)}
                    </div>
                  </div>
                </div>
                {([0, 1].some(idx => t(`${country.key}.stats.${idx}`))) && (
                  <ul className="space-y-2">
                    {[0, 1].map((idx) => {
                      const stat = t(`${country.key}.stats.${idx}`)
                      if (!stat) return null
                      return (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary">•</span>
                          {stat}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
