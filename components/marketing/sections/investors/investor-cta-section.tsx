"use client"

import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

export function InvestorCTASection() {
  const t = useTranslations("investors.cta")
  
  // Debug: vérifier si les traductions sont chargées
  const highlightRaw = t.raw("highlight")
  const highlightTranslated = t("highlight")
  const highlight = (typeof highlightRaw === 'string' ? highlightRaw : highlightTranslated) || "investors.cta.highlight"

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-chart-2 py-20 md:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center text-white">
          <h2 className="mb-6 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>

          <p className="mb-8 text-lg text-white/90">
            {t("subtitle")}
          </p>

          <p className="mb-12 text-lg font-semibold text-white/95" dangerouslySetInnerHTML={{ __html: highlight }} />

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-base"
              onClick={() => {
                const formSection = document.getElementById('investor-form-section')
                if (formSection) {
                  formSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
            >
              {t("buttons.form")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="mt-12 grid gap-4 text-left md:grid-cols-3">
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="font-semibold">{t("contact.urgent")}</div>
              <div className="text-sm text-white/80">{t("contact.email")}</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="font-semibold">{t("contact.phone")}</div>
              <div className="text-sm text-white/80">{t("contact.phoneValue")}</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="font-semibold">{t("contact.follow")}</div>
              <div className="text-sm text-white/80">
                <a 
                  href="https://www.linkedin.com/company/edupro-africa/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline"
                >
                  LinkedIn
                </a>
                {", "}
                <a 
                  href="https://x.com/eduproafrica" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline"
                >
                  Twitter
                </a>
                {", "}
                <a 
                  href="https://www.instagram.com/edupro.africa" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
