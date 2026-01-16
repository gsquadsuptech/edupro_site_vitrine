"use client"

import { useState } from "react"
import { Container } from "@/components/marketing/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Loader2, CheckCircle2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useLanguage } from "@/hooks/useLanguage"
import { toast } from "sonner"
import { useRecaptcha } from "@/components/marketing/recaptcha-provider"

export function Newsletter() {
  const t = useTranslations("landing.newsletter")
  const { locale } = useLanguage()
  const { executeRecaptcha, isLoaded: recaptchaLoaded } = useRecaptcha()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const trimmedEmail = email.trim()
      
      if (!trimmedEmail) {
        toast.error("Veuillez entrer une adresse email valide")
        setIsSubmitting(false)
        return
      }

      // Vérifier reCAPTCHA
      if (!recaptchaLoaded) {
        toast.error("reCAPTCHA n'est pas encore chargé. Veuillez patienter quelques instants.")
        setIsSubmitting(false)
        return
      }

      let recaptchaToken = ""
      try {
        recaptchaToken = await executeRecaptcha("submit_newsletter")
      } catch (recaptchaError) {
        console.error("Erreur reCAPTCHA:", recaptchaError)
        toast.error("Erreur lors de la vérification de sécurité. Veuillez réessayer.")
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
          email: trimmedEmail, 
          locale,
          source: 'newsletter'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t("error") || "Erreur lors de l'inscription")
      }

      setIsSubmitted(true)
      setEmail("")
      toast.success(data.message || t("success") || "Merci pour votre inscription !")
    } catch (error: any) {
      console.error('Erreur newsletter:', error)
      toast.error(error.message || t("error") || "Erreur lors de l'inscription")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="border-t border-border py-16">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Mail className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">{t("title")}</h2>
          <p className="mb-6 text-muted-foreground">{t("subtitle")}</p>

          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center gap-4 text-green-600">
              <CheckCircle2 className="h-12 w-12" />
              <p className="text-lg font-semibold">{t("success") || "Merci pour votre inscription !"}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              <Input 
                type="email" 
                placeholder={t("placeholder")} 
                className="flex-1" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <Button 
                type="submit"
                className="bg-gradient-to-r from-primary to-chart-2 text-primary-foreground hover:opacity-90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("submitting") || "Inscription..."}
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    {t("cta")}
                  </>
                )}
              </Button>
            </form>
          )}

          <p className="mt-4 text-xs text-muted-foreground">{t("unsubscribe")}</p>
        </div>
      </Container>
    </section>
  )
}

