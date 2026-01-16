"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { useRecaptcha } from "@/components/marketing/recaptcha-provider"
import { useTranslations } from "next-intl"

export function ContactForm() {
  const { executeRecaptcha, isLoaded: recaptchaLoaded } = useRecaptcha()
  const t = useTranslations("about.contact.form")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [subject, setSubject] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const form = e.currentTarget
    const formData = new FormData(form)
    
    const firstname = formData.get('firstname') as string
    const lastname = formData.get('lastname') as string
    const email = formData.get('email') as string
    const message = formData.get('message') as string

    if (!subject) {
      setError(t("errors.subjectRequired"))
      setIsSubmitting(false)
      return
    }

    try {
      // Vérifier reCAPTCHA
      if (!recaptchaLoaded) {
        throw new Error(t("errors.recaptchaNotLoaded"))
      }

      let recaptchaToken = ""
      try {
        recaptchaToken = await executeRecaptcha("submit_contact")
      } catch (recaptchaError) {
        console.error("Erreur reCAPTCHA:", recaptchaError)
        throw new Error(t("errors.recaptchaError"))
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recaptcha_token: recaptchaToken,
          firstname,
          lastname,
          email,
          subject,
          message,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t("errors.submitError"))
      }

      setIsSuccess(true)
      form.reset()
      setSubject("")
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.genericError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mb-6 rounded-full bg-green-100 p-4 text-green-600">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <h3 className="mb-2 text-2xl font-bold">{t("success.title")}</h3>
        <p className="mb-8 text-muted-foreground">
          {t("success.message")}
        </p>
        <Button onClick={() => setIsSuccess(false)} variant="outline">
          {t("success.sendAnother")}
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold">{t("title")}</h2>
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstname">{t("fields.firstname.label")}</Label>
            <Input id="firstname" name="firstname" placeholder={t("fields.firstname.placeholder")} required className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastname">{t("fields.lastname.label")}</Label>
            <Input id="lastname" name="lastname" placeholder={t("fields.lastname.placeholder")} required className="bg-muted" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t("fields.email.label")}</Label>
          <Input id="email" name="email" type="email" placeholder={t("fields.email.placeholder")} required className="bg-muted" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">{t("fields.subject.label")}</Label>
          <Select value={subject} onValueChange={setSubject} required>
            <SelectTrigger className="bg-muted">
              <SelectValue placeholder={t("fields.subject.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(t.raw("fields.subject.options")).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label as string}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="subject" value={subject} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">{t("fields.message.label")}</Label>
          <Textarea 
            id="message" 
            name="message"
            placeholder={t("fields.message.placeholder")} 
            className="min-h-[150px] bg-muted" 
            required 
          />
        </div>

        <Button type="submit" className="w-full bg-gradient-to-r from-primary to-chart-2" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("submit.sending")}
            </>
          ) : (
            t("submit.send")
          )}
        </Button>
      </form>
    </div>
  )
}

