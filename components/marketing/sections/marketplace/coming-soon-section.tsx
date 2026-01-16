"use client"

import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Rocket, Bell, Sparkles, Package, Users, TrendingUp, Mail, Calendar } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useRecaptcha } from "@/components/marketing/recaptcha-provider"
import { useTranslations } from "next-intl"

export function MarketplaceComingSoonSection() {
  const params = useParams()
  const locale = params?.locale || 'fr'
  const { executeRecaptcha, isLoaded: recaptchaLoaded } = useRecaptcha()
  const t = useTranslations("marketplace")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsSuccess(false)

    try {
      // Vérifier reCAPTCHA
      if (!recaptchaLoaded) {
        alert(t("comingSoon.notify.errors.recaptchaNotLoaded"))
        setIsSubmitting(false)
        return
      }

      let recaptchaToken = ""
      try {
        recaptchaToken = await executeRecaptcha("submit_newsletter")
      } catch (recaptchaError) {
        console.error("Erreur reCAPTCHA:", recaptchaError)
        alert(t("comingSoon.notify.errors.recaptchaError"))
        setIsSubmitting(false)
        return
      }

      const response = await fetch('/api/marketplace/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recaptcha_token: recaptchaToken,
          email: email.trim(),
          locale: locale,
          source: 'marketplace'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t("comingSoon.notify.errors.saveError"))
      }

      setIsSuccess(true)
      setEmail("")
    } catch (error) {
      console.error('Erreur:', error)
      alert(error instanceof Error ? error.message : t("comingSoon.notify.errors.generic"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-background via-primary/5 to-chart-2/10 py-24 lg:py-32">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-primary/20 blur-3xl" />
          <div
            className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-chart-2/20 blur-3xl"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <Container className="relative">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 border-primary/30 bg-primary/10 text-primary">
              <Sparkles className="mr-2 h-4 w-4" />
              {t("comingSoon.badge")}
            </Badge>

            <h1 className="mb-6 text-balance text-4xl font-bold leading-tight lg:text-6xl">
              {t("comingSoon.title")}
            </h1>

            <p className="mb-8 text-pretty text-xl text-muted-foreground lg:text-2xl">
              {t("comingSoon.subtitle")}
            </p>

            {/* Launch Date */}
            <div className="mb-12 flex items-center justify-center gap-3 rounded-2xl border-2 border-primary/50 bg-primary/10 px-6 py-4">
              <Calendar className="h-6 w-6 text-primary" />
              <div className="text-left">
                <p className="text-sm font-medium text-muted-foreground">{t("comingSoon.launch.label")}</p>
                <p className="text-2xl font-bold text-primary">{t("comingSoon.launch.date")}</p>
              </div>
            </div>

            {/* Notification Form */}
            <div className="mx-auto mb-12 max-w-md">
              <div className="rounded-2xl border bg-card p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-center">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Bell className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold">{t("comingSoon.notify.title")}</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {t("comingSoon.notify.subtitle")}
                </p>
                {isSuccess ? (
                  <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
                    {t("comingSoon.notify.success")}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input 
                      type="email" 
                      placeholder={t("comingSoon.notify.emailPlaceholder")} 
                      className="flex-1" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Button type="submit" className="bg-gradient-to-r from-primary to-chart-2" disabled={isSubmitting}>
                      <Mail className="mr-2 h-4 w-4" />
                      {isSubmitting ? t("comingSoon.notify.button.sending") : t("comingSoon.notify.button.default")}
                    </Button>
                  </form>
                )}
              </div>
            </div>

            {/* Coming Soon Stats */}
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-lg">
                <div className="mb-3 flex justify-center">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">{t("comingSoon.stats.trainings")}</div>
              </div>

              <div className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-lg">
                <div className="mb-3 flex justify-center">
                  <div className="rounded-full bg-chart-2/10 p-3">
                    <Users className="h-8 w-8 text-chart-2" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-chart-2">30+</div>
                <div className="text-sm text-muted-foreground">{t("comingSoon.stats.trainers")}</div>
              </div>

              <div className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-lg">
                <div className="mb-3 flex justify-center">
                  <div className="rounded-full bg-chart-1/10 p-3">
                    <TrendingUp className="h-8 w-8 text-chart-1" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-chart-1">15+</div>
                <div className="text-sm text-muted-foreground">{t("comingSoon.stats.domains")}</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Preview Section */}
      <section className="border-b py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">{t("comingSoon.preview.title")}</h2>
            <p className="mb-12 text-lg text-muted-foreground">
              {t("comingSoon.preview.subtitle")}
            </p>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl border bg-gradient-to-br from-card to-primary/5 p-8 text-left transition-shadow hover:shadow-lg">
                <div className="mb-4 inline-flex rounded-full bg-primary/10 p-3">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{t("comingSoon.preview.cards.certifications.title")}</h3>
                <p className="text-muted-foreground">
                  {t("comingSoon.preview.cards.certifications.description")}
                </p>
              </div>

              <div className="rounded-2xl border bg-gradient-to-br from-card to-chart-2/5 p-8 text-left transition-shadow hover:shadow-lg">
                <div className="mb-4 inline-flex rounded-full bg-chart-2/10 p-3">
                  <Users className="h-6 w-6 text-chart-2" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{t("comingSoon.preview.cards.experts.title")}</h3>
                <p className="text-muted-foreground">
                  {t("comingSoon.preview.cards.experts.description")}
                </p>
              </div>

              <div className="rounded-2xl border bg-gradient-to-br from-card to-chart-1/5 p-8 text-left transition-shadow hover:shadow-lg">
                <div className="mb-4 inline-flex rounded-full bg-chart-1/10 p-3">
                  <TrendingUp className="h-6 w-6 text-chart-1" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{t("comingSoon.preview.cards.tracking.title")}</h3>
                <p className="text-muted-foreground">
                  {t("comingSoon.preview.cards.tracking.description")}
                </p>
              </div>

              <div className="rounded-2xl border bg-gradient-to-br from-card to-chart-3/5 p-8 text-left transition-shadow hover:shadow-lg">
                <div className="mb-4 inline-flex rounded-full bg-chart-3/10 p-3">
                  <Sparkles className="h-6 w-6 text-chart-3" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{t("comingSoon.preview.cards.community.title")}</h3>
                <p className="text-muted-foreground">
                  {t("comingSoon.preview.cards.community.description")}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-chart-2/10 py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">{t("comingSoon.cta.title")}</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              {t("comingSoon.cta.subtitle")}
            </p>
            <Button size="lg" asChild className="bg-gradient-to-r from-primary to-chart-2">
              <Link href={`/${locale}/professionnels`}>{t("comingSoon.cta.button")}</Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}

