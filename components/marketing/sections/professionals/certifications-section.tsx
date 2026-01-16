"use client"

import { Container } from "@/components/marketing/layout/container"
import { CheckCircle2, Share2, Award, Zap } from "lucide-react"
import { useTranslations } from "next-intl"

export function CertificationsSection() {
  const t = useTranslations("professionals.certifications")

  const features = [
    {
      icon: CheckCircle2,
      key: "verifiable",
    },
    {
      icon: Award,
      key: "coCertified",
    },
    {
      icon: Share2,
      key: "shareable",
    },
    {
      icon: Zap,
      key: "evolutive",
    },
  ]

  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{t(`features.${feature.key}.title`)}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{t(`features.${feature.key}.description`)}</p>
                <div className="border-t border-border pt-3">
                  <p className="text-sm font-medium text-chart-2 italic">Impact: {t(`features.${feature.key}.impact`)}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Certificate Example */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-chart-2/10 overflow-hidden">
          <div className="p-8 md:p-12">
            <h3 className="mb-8 text-center text-2xl font-bold">{t("example.title")}</h3>

            <div className="max-w-md mx-auto rounded-xl border border-border bg-white p-8 shadow-lg">
              <div className="text-center space-y-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Award className="h-8 w-8 text-primary" />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary">Certificat Professionnel</p>
                  <h4 className="text-xl font-bold">{t("example.skill")}</h4>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <p className="text-sm">{t("example.certified")}</p>
                  <p className="text-lg font-bold">{t("example.name")}</p>
                </div>

                <div className="space-y-2 text-left bg-muted p-4 rounded-lg">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Compétences validées:</p>
                  <ul className="text-sm space-y-1">
                    <li>✓ Analyse de données avec Python</li>
                    <li>✓ Data visualization avancée</li>
                    <li>✓ Machine Learning appliqué</li>
                    <li>✓ Gestion de projets data</li>
                  </ul>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Score: <span className="font-bold text-primary">92/100</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Certificat N°: <span className="font-mono">EDU-DA-2025-0042</span>
                  </p>
                </div>

                <div className="pt-4">
                  <div className="h-12 w-12 mx-auto bg-muted rounded flex items-center justify-center">
                    <span className="text-xs font-bold">QR</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Certificats élégants, professionnels, dégradés violet-bleu, avec mentions légales sécurisées
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
