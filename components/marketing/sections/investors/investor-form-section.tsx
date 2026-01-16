"use client"

import type React from "react"

import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { Loader2, CheckCircle2 } from "lucide-react"
import { useRecaptcha } from "@/components/marketing/recaptcha-provider"

export function InvestorFormSection() {
  const t = useTranslations("investors.form")
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const { executeRecaptcha, isLoaded: recaptchaLoaded } = useRecaptcha()
  
  const [formData, setFormData] = useState({
    investorType: "",
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    africaInvestment: "",
    sectors: [] as string[],
    stage: "",
    ticket: "",
    discovered: "",
    interest: "",
    timeline: "",
    contact: [] as string[],
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validation des champs requis
      if (!formData.investorType || !formData.fullName || !formData.email || !formData.phone) {
        throw new Error("Veuillez remplir tous les champs obligatoires")
      }

      // Vérifier reCAPTCHA
      if (!recaptchaLoaded) {
        throw new Error("reCAPTCHA n'est pas encore chargé. Veuillez patienter quelques instants.")
      }

      let recaptchaToken = ""
      try {
        recaptchaToken = await executeRecaptcha("submit_investor_form")
      } catch (recaptchaError) {
        console.error("Erreur reCAPTCHA:", recaptchaError)
        throw new Error("Erreur lors de la vérification de sécurité. Veuillez réessayer.")
      }

      const response = await fetch('/api/investor-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recaptcha_token: recaptchaToken,
          investor_type: formData.investorType,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          linkedin: formData.linkedin || null,
          africa_investment: formData.africaInvestment || null,
          sectors: formData.sectors || [],
          stage: formData.stage || null,
          ticket: formData.ticket || null,
          discovered: formData.discovered || null,
          interest: formData.interest || null,
          timeline: formData.timeline || null,
          contact_methods: formData.contact || [],
          locale,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi de la demande")
      }

      setIsSuccess(true)
      toast.success("Votre demande a été envoyée avec succès !")
      
      // Réinitialiser le formulaire
      setFormData({
        investorType: "",
        fullName: "",
        email: "",
        phone: "",
        linkedin: "",
        africaInvestment: "",
        sectors: [],
        stage: "",
        ticket: "",
        discovered: "",
        interest: "",
        timeline: "",
        contact: [],
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="investor-form-section" className="py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t("title")}</h2>
          <p className="text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-8 md:p-12">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-6 rounded-full bg-green-100 p-4 text-green-600">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <h3 className="mb-2 text-2xl font-bold">Demande envoyée !</h3>
              <p className="mb-8 text-muted-foreground">
                Merci pour votre intérêt. Notre équipe vous contactera sous 48h.
              </p>
              <Button
                variant="outline"
                onClick={() => setIsSuccess(false)}
              >
                Faire une autre demande
              </Button>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Qui êtes-vous */}
            <div>
              <h3 className="mb-6 text-lg font-bold">{t("sections.who.title")}</h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    {t("sections.who.investorType.label")} <span className="text-accent">{t("sections.who.investorType.required")}</span>
                  </label>
                  <select
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm"
                    value={formData.investorType}
                    onChange={(e) => setFormData({ ...formData, investorType: e.target.value })}
                  >
                    <option value="">{t("sections.who.investorType.placeholder")}</option>
                    <option value="angel">{t("sections.who.investorType.options.angel")}</option>
                    <option value="vc">{t("sections.who.investorType.options.vc")}</option>
                    <option value="family">{t("sections.who.investorType.options.family")}</option>
                    <option value="corporate">{t("sections.who.investorType.options.corporate")}</option>
                    <option value="impact">{t("sections.who.investorType.options.impact")}</option>
                    <option value="other">{t("sections.who.investorType.options.other")}</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    {t("sections.who.fullName.label")} <span className="text-accent">{t("sections.who.fullName.required")}</span>
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      {t("sections.who.email.label")} <span className="text-accent">{t("sections.who.email.required")}</span>
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      {t("sections.who.phone.label")} <span className="text-accent">{t("sections.who.phone.required")}</span>
                    </label>
                    <input
                      type="tel"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">{t("sections.who.linkedin.label")}</label>
                  <input
                    type="url"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Votre Intérêt */}
            <div>
              <h3 className="mb-6 text-lg font-bold">{t("sections.interest.title")}</h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">{t("sections.interest.africaInvestment.label")}</label>
                  <select
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm"
                    value={formData.africaInvestment}
                    onChange={(e) => setFormData({ ...formData, africaInvestment: e.target.value })}
                  >
                    <option value="">{t("sections.who.investorType.placeholder")}</option>
                    <option value="regularly">{t("sections.interest.africaInvestment.options.regularly")}</option>
                    <option value="occasionally">{t("sections.interest.africaInvestment.options.occasionally")}</option>
                    <option value="no">{t("sections.interest.africaInvestment.options.no")}</option>
                    <option value="researching">{t("sections.interest.africaInvestment.options.researching")}</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">{t("sections.interest.ticket.label")}</label>
                  <select
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm"
                    value={formData.ticket}
                    onChange={(e) => setFormData({ ...formData, ticket: e.target.value })}
                  >
                    <option value="">{t("sections.who.investorType.placeholder")}</option>
                    <option value="50k">{t("sections.interest.ticket.options.50k")}</option>
                    <option value="50-100k">{t("sections.interest.ticket.options.50-100k")}</option>
                    <option value="100-250k">{t("sections.interest.ticket.options.100-250k")}</option>
                    <option value="250k+">{t("sections.interest.ticket.options.250k+")}</option>
                    <option value="flexible">{t("sections.interest.ticket.options.flexible")}</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">{t("sections.interest.timeline.label")}</label>
                  <select
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm"
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  >
                    <option value="">{t("sections.who.investorType.placeholder")}</option>
                    <option value="immediate">{t("sections.interest.timeline.options.immediate")}</option>
                    <option value="3-6">{t("sections.interest.timeline.options.3-6")}</option>
                    <option value="6-12">{t("sections.interest.timeline.options.6-12")}</option>
                    <option value="later">{t("sections.interest.timeline.options.later")}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Contexte */}
            <div>
              <h3 className="mb-6 text-lg font-bold">{t("sections.context.title")}</h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">{t("sections.context.discovered.label")}</label>
                  <select
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm"
                    value={formData.discovered}
                    onChange={(e) => setFormData({ ...formData, discovered: e.target.value })}
                  >
                    <option value="">{t("sections.who.investorType.placeholder")}</option>
                    <option value="referral">{t("sections.context.discovered.options.referral")}</option>
                    <option value="linkedin">{t("sections.context.discovered.options.linkedin")}</option>
                    <option value="event">{t("sections.context.discovered.options.event")}</option>
                    <option value="search">{t("sections.context.discovered.options.search")}</option>
                    <option value="article">{t("sections.context.discovered.options.article")}</option>
                    <option value="other">{t("sections.context.discovered.options.other")}</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">{t("sections.context.interest.label")}</label>
                  <textarea
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm"
                    rows={3}
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    placeholder={t("sections.context.interest.placeholder")}
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Prochaines Étapes */}
            <div>
              <h3 className="mb-6 text-lg font-bold">{t("sections.nextSteps.title")}</h3>

              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="rounded"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, contact: [...formData.contact, "email"] })
                      } else {
                        setFormData({
                          ...formData,
                          contact: formData.contact.filter((c) => c !== "email"),
                        })
                      }
                    }}
                  />
                  <span className="text-sm">{t("sections.nextSteps.email")}</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="rounded"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, contact: [...formData.contact, "call"] })
                      } else {
                        setFormData({
                          ...formData,
                          contact: formData.contact.filter((c) => c !== "call"),
                        })
                      }
                    }}
                  />
                  <span className="text-sm">{t("sections.nextSteps.call")}</span>
                </label>

              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-chart-2 py-3 text-primary-foreground hover:opacity-90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                t("submit")
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">{t("response")}</p>
          </form>
          )}
        </div>
      </Container>
    </section>
  )
}

