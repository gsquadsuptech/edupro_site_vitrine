"use client"

import { Container } from "@/components/marketing/layout/container"
import { CreditCard, Banknote, Smartphone } from "lucide-react"
import { useTranslations } from "next-intl"

export function PaymentSection() {
  const t = useTranslations("enterprises.payment")

  return (
    <section className="bg-muted/30 py-12 md:py-16">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mb-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-xl border-2 border-border bg-card p-8">
            <h3 className="mb-4 text-xl font-bold">{t("methods.title")}</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CreditCard className="h-6 w-6 flex-shrink-0 text-primary" />
                <div>
                  <p className="font-semibold">{t("methods.card.title")}</p>
                  <p className="text-sm text-muted-foreground">{t("methods.card.description")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Banknote className="h-6 w-6 flex-shrink-0 text-primary" />
                <div>
                  <p className="font-semibold">{t("methods.bank.title")}</p>
                  <p className="text-sm text-muted-foreground">{t("methods.bank.description")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Smartphone className="h-6 w-6 flex-shrink-0 text-primary" />
                <div>
                  <p className="font-semibold">{t("methods.mobile.title")}</p>
                  <p className="text-sm text-muted-foreground">{t("methods.mobile.description")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border-2 border-primary bg-primary/5 p-8">
            <h3 className="mb-4 text-xl font-bold">{t("frequencies.title")}</h3>
            <div className="space-y-6">
              <div>
                <h4 className="mb-2 flex items-center gap-2 font-semibold">
                  <CreditCard className="h-5 w-5 text-primary" />
                  {t("frequencies.monthly.title")}
                </h4>
                <p className="mb-2 text-sm text-muted-foreground">{t("frequencies.monthly.description")}</p>
                <p className="text-xs text-muted-foreground">{t("frequencies.monthly.note")}</p>
              </div>
              <div>
                <h4 className="mb-2 flex items-center gap-2 font-semibold">
                  <Banknote className="h-5 w-5 text-primary" />
                  {t("frequencies.quarterly.title")}
                </h4>
                <p className="mb-2 text-sm text-muted-foreground">{t("frequencies.quarterly.description")}</p>
                <p className="text-xs text-muted-foreground">{t("frequencies.quarterly.note")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">
            {t("public")}
          </p>
        </div>
      </Container>
    </section>
  )
}
