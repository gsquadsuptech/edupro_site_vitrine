"use client"

import { Container } from "@/components/marketing/layout/container"
import { useTranslations } from "next-intl"

export function MissionSection() {
  const t = useTranslations("about.mission")

  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>

          <div className="space-y-8 text-lg leading-relaxed text-muted-foreground">
            <div>
              <h3 className="mb-4 text-xl font-semibold text-foreground">{t("observation.title")}</h3>
              <p>
                {t("observation.text")}
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-semibold text-foreground">{t("approach.title")}</h3>
              <p className="mb-4">{t("approach.intro")}</p>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>
                    <strong className="text-foreground">{t("approach.challenges.accessibility.label")}</strong> : {t("approach.challenges.accessibility.description")}
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>
                    <strong className="text-foreground">{t("approach.challenges.interactivity.label")}</strong> : {t("approach.challenges.interactivity.description")}
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>
                    <strong className="text-foreground">{t("approach.challenges.measurability.label")}</strong> : {t("approach.challenges.measurability.description")}
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-semibold text-foreground">{t("ecosystem.title")}</h3>
              <p>
                {t("ecosystem.text")}
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border-l-4 border-primary bg-primary/5 p-8">
            <blockquote className="text-lg italic leading-relaxed">
              {t("quote.text")}
            </blockquote>
            <p className="mt-4 font-semibold text-foreground">{t("quote.author")}</p>
          </div>
        </div>
      </Container>
    </section>
  )
}
