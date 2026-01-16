"use client"

import { useState } from "react"
import { Container } from "@/components/marketing/layout/container"
import { MapPin, Mail, Globe, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslations } from "next-intl"
import { useLanguage } from "@/hooks/useLanguage"
import { toast } from "sonner"

export function ContactSection() {
  const t = useTranslations("about.contact")
  const { locale } = useLanguage()
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false)
  const [isNewsletterSubmitted, setIsNewsletterSubmitted] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingNewsletter(true)

    try {
      const response = await fetch('/api/marketplace/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: newsletterEmail.trim(), 
          locale,
          source: 'newsletter'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'inscription")
      }

      setIsNewsletterSubmitted(true)
      setNewsletterEmail("")
      toast.success(data.message || "Merci pour votre inscription !")
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'inscription")
    } finally {
      setIsSubmittingNewsletter(false)
    }
  }

  return (
    <section id="contact" className="py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">{t("title")}</h2>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>

            <h3 className="mb-6 text-xl font-bold">{t("offices.title")}</h3>

            <div className="space-y-6">
              <div>
                <p className="mb-2 font-semibold text-foreground">{t("offices.dakar.location")}</p>
                <p className="text-sm text-muted-foreground">{t("offices.dakar.address1")}</p>
                <p className="text-sm text-muted-foreground">{t("offices.dakar.address2")}</p>
                <p className="mt-2 text-sm text-primary">{t("offices.dakar.email")}</p>
                <p className="text-sm text-muted-foreground">{t("offices.dakar.phone")}</p>
              </div>

              <div>
                <p className="mb-2 font-semibold text-foreground">{t("offices.abidjan.location")}</p>
                <p className="text-sm text-muted-foreground">{t("offices.abidjan.address1")}</p>
                <p className="text-sm text-muted-foreground">{t("offices.abidjan.address2")}</p>
                <p className="mt-2 text-sm text-primary">{t("offices.abidjan.email")}</p>
                <p className="text-sm text-muted-foreground">{t("offices.abidjan.phone")}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>

            <h3 className="mb-6 text-xl font-bold">{t("writeUs.title")}</h3>

            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold text-foreground">{t("writeUs.enterprises.label")}</p>
                <p className="text-primary">{t("writeUs.enterprises.email")}</p>
              </div>

              <div>
                <p className="font-semibold text-foreground">{t("writeUs.trainers.label")}</p>
                <p className="text-primary">{t("writeUs.trainers.email")}</p>
              </div>

              <div>
                <p className="font-semibold text-foreground">{t("writeUs.learners.label")}</p>
                <p className="text-primary">{t("writeUs.learners.email")}</p>
              </div>

              <div>
                <p className="font-semibold text-foreground">{t("writeUs.investors.label")}</p>
                <p className="text-primary">{t("writeUs.investors.email")}</p>
              </div>

              <div>
                <p className="font-semibold text-foreground">{t("writeUs.press.label")}</p>
                <p className="text-primary">{t("writeUs.press.email")}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-4">
              <Globe className="h-6 w-6 text-primary" />
            </div>

            <h3 className="mb-6 text-xl font-bold">{t("social.title")}</h3>

            <p className="mb-4 text-sm text-muted-foreground">{t("social.subtitle")}</p>

            <div className="mb-6 space-y-2 text-sm">
              <p>
                <a href="https://www.linkedin.com/company/edupro-africa/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {t("social.linkedin")}
                </a>
              </p>
              <p>
                <a href="https://x.com/eduproafrica" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {t("social.twitter")}
                </a>
              </p>
              <p>
                <a href="https://www.instagram.com/edupro.africa" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {t("social.instagram")}
                </a>
              </p>
              <p>
                <a href="https://www.facebook.com/profile.php?id=61577379684411" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {t("social.facebook")}
                </a>
              </p>
              <p>
                <a href="https://www.tiktok.com/@edupro.africa" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  TikTok - Contenu court & tendances
                </a>
              </p>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-foreground">{t("social.newsletter.title")}</p>
              {isNewsletterSubmitted ? (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{t("social.newsletter.success") || "Merci pour votre inscription !"}</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <Input 
                    type="email" 
                    placeholder={t("social.newsletter.placeholder")} 
                    className="flex-1" 
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    disabled={isSubmittingNewsletter}
                  />
                  <Button 
                    type="submit"
                    size="sm"
                    disabled={isSubmittingNewsletter}
                  >
                    {isSubmittingNewsletter ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      t("social.newsletter.button")
                    )}
                  </Button>
                </form>
              )}
              <p className="mt-2 text-xs text-muted-foreground">{t("social.newsletter.description")}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
