"use client"

import type React from "react"

import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Loader2, CheckCircle2 } from "lucide-react"
import { useRecaptcha } from "@/components/marketing/recaptcha-provider"

export function ContactFormSection() {
  const { executeRecaptcha, isLoaded: recaptchaLoaded } = useRecaptcha()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const form = e.currentTarget as HTMLFormElement
      const formData = new FormData(form)
      
      const firstName = formData.get('firstName') as string
      const lastName = formData.get('lastName') as string
      const email = formData.get('email') as string
      const phone = formData.get('phone') as string
      const subject = formData.get('subject') as string
      const message = formData.get('message') as string

      // Vérifier reCAPTCHA
      if (!recaptchaLoaded) {
        throw new Error("reCAPTCHA n'est pas encore chargé. Veuillez patienter quelques instants.")
      }

      let recaptchaToken = ""
      try {
        recaptchaToken = await executeRecaptcha("submit_contact")
      } catch (recaptchaError) {
        console.error("Erreur reCAPTCHA:", recaptchaError)
        throw new Error("Erreur lors de la vérification de sécurité. Veuillez réessayer.")
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recaptcha_token: recaptchaToken,
          firstname: firstName,
          lastname: lastName,
          email,
          subject,
          message,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi du message")
      }

      setIsSubmitted(true)
      form.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <section className="py-20 md:py-32 bg-muted/30">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mb-4 text-3xl font-bold">Message envoyé !</h2>
            <p className="mb-8 text-muted-foreground">
              Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.
            </p>
            <Button onClick={() => setIsSubmitted(false)}>Envoyer un autre message</Button>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <Container>
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Envoyez-nous un message</h2>
            <p className="text-muted-foreground">
              Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
            </p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-8 space-y-6">
            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom *</Label>
                <Input id="firstName" name="firstName" placeholder="Votre prénom" required disabled={isSubmitting} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Nom *</Label>
                <Input id="lastName" name="lastName" placeholder="Votre nom" required disabled={isSubmitting} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" placeholder="votre@email.com" required disabled={isSubmitting} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+221 XX XXX XX XX" disabled={isSubmitting} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Sujet *</Label>
              <Input id="subject" name="subject" placeholder="Sujet de votre message" required disabled={isSubmitting} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Décrivez votre demande..."
                rows={6}
                required
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-chart-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                "Envoyer le message"
              )}
            </Button>
          </form>
        </div>
      </Container>
    </section>
  )
}

