"use client"

import { Mail, MapPin, Phone } from 'lucide-react'
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"

export function ContactInfo() {
  const params = useParams()
  const locale = params?.locale || 'fr'
  const t = useTranslations("about.contactInfo")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid gap-6">
        <div className="flex items-start gap-4 rounded-xl border border-border bg-muted/50 p-6">
          <div className="rounded-lg bg-primary/10 p-3 text-primary">
            <Mail className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{t("sections.email.title")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t("sections.email.description")}</p>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">{t("sections.email.dakar.label")}</p>
                <a href={`mailto:${t("sections.email.dakar.email")}`} className="block font-medium text-primary hover:underline">
                  {t("sections.email.dakar.email")}
                </a>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">{t("sections.email.abidjan.label")}</p>
                <a href={`mailto:${t("sections.email.abidjan.email")}`} className="block font-medium text-primary hover:underline">
                  {t("sections.email.abidjan.email")}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-xl border border-border bg-muted/50 p-6">
          <div className="rounded-lg bg-chart-2/10 p-3 text-chart-2">
            <Phone className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{t("sections.phone.title")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t("sections.phone.description")}</p>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">{t("sections.phone.dakar.label")}</p>
                <a href="https://wa.me/221766651717" target="_blank" rel="noopener noreferrer" className="block font-medium text-primary hover:underline">
                  {t("sections.phone.dakar.phone")}
                </a>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">{t("sections.phone.abidjan.label")}</p>
                <a href="https://wa.me/2250554040707" target="_blank" rel="noopener noreferrer" className="block font-medium text-primary hover:underline">
                  {t("sections.phone.abidjan.phone")}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-xl border border-border bg-muted/50 p-6">
          <div className="rounded-lg bg-chart-1/10 p-3 text-chart-1">
            <MapPin className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-3">{t("sections.offices.title")}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-foreground mb-1">{t("sections.offices.dakar.label")}</p>
                <address className="text-sm not-italic text-muted-foreground">
                  {t("sections.offices.dakar.address1")}<br />
                  {t("sections.offices.dakar.address2")}
                </address>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">{t("sections.offices.abidjan.label")}</p>
                <address className="text-sm not-italic text-muted-foreground">
                  {t("sections.offices.abidjan.address1")}<br />
                  {t("sections.offices.abidjan.address2")}
                </address>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

