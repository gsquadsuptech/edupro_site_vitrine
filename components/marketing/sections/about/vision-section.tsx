"use client"

import { Container } from "@/components/marketing/layout/container"
import { useTranslations } from "next-intl"

export function VisionSection() {
  const t = useTranslations("about.vision")

  return (
    <section className="bg-muted/30 py-20 md:py-32">
      <Container>
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>

          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              <strong className="text-foreground">
                {t("main")}
              </strong>
            </p>

            <p>
              {t("description")}
            </p>

            <div className="my-8 space-y-4">
              <p className="font-semibold text-foreground">{t("future.title")}</p>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-primary">✓</span>
                  <span>
                    <strong className="text-foreground">{t("future.items.professional")}</strong>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">✓</span>
                  <span>
                    <strong className="text-foreground">{t("future.items.digitalization")}</strong>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">✓</span>
                  <span>
                    <strong className="text-foreground">{t("future.items.knowledge")}</strong>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">✓</span>
                  <span>
                    <strong className="text-foreground">{t("future.items.talents")}</strong>
                  </span>
                </li>
              </ul>
            </div>

            <p className="rounded-xl bg-primary/10 p-6 font-semibold text-foreground">
              {t("ambition")}
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
