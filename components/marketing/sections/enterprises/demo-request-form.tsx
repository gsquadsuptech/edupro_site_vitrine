"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Loader2, AlertCircle, Building2, School } from 'lucide-react'
import { useParams, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { useRecaptcha } from "@/components/marketing/recaptcha-provider"
import { useTranslations } from "next-intl"

interface DemoRequestFormProps {
  requestType?: 'enterprise' | 'institute'
}

export function DemoRequestForm({ requestType: propRequestType }: DemoRequestFormProps = {}) {
  const params = useParams()
  const searchParams = useSearchParams()
  const locale = (params?.locale as string) || 'fr'
  const { executeRecaptcha, isLoaded: recaptchaLoaded } = useRecaptcha()
  const t = useTranslations("enterprises.demoRequest.form")
  
  // Détecter le type depuis l'URL ou la prop
  const urlType = searchParams?.get('type')
  const requestType = propRequestType || (urlType === 'institute' ? 'institute' : 'enterprise')
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    company_size: "",
    industry: "",
    country: "",
    city: "",
    message: "",
    request_type: requestType,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Vérifier reCAPTCHA
      if (!recaptchaLoaded) {
        throw new Error(t("errors.recaptchaNotLoaded"))
      }

      let recaptchaToken = ""
      try {
        recaptchaToken = await executeRecaptcha("submit_demo_request")
      } catch (recaptchaError) {
        console.error("Erreur reCAPTCHA:", recaptchaError)
        throw new Error(t("errors.recaptchaError"))
      }

      const response = await fetch('/api/demo-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recaptcha_token: recaptchaToken,
          ...formData,
          request_type: requestType,
          locale,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t("errors.submitError"))
      }

      setIsSuccess(true)
      setFormData({
        company_name: "",
        contact_name: "",
        email: "",
        phone: "",
        company_size: "",
        industry: "",
        country: "",
        city: "",
        message: "",
        request_type: requestType,
      })
      toast.success(t("success.message"))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t("errors.genericError")
      setError(errorMessage)
      toast.error(errorMessage)
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
        <Button asChild variant="outline">
          <Link href={`/${locale}`}>
            {t("success.backHome")}
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-3">
          {requestType === 'institute' ? (
            <School className="h-6 w-6 text-primary" />
          ) : (
            <Building2 className="h-6 w-6 text-primary" />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold">
            {t(`title.${requestType}`)}
          </h2>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company_name">
              {t(`fields.companyName.label.${requestType}`)}
            </Label>
            <Input 
              id="company_name" 
              name="company_name" 
              placeholder={t(`fields.companyName.placeholder.${requestType}`)} 
              required 
              className="bg-muted"
              value={formData.company_name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_name">{t("fields.contactName.label")}</Label>
            <Input 
              id="contact_name" 
              name="contact_name" 
              placeholder={t("fields.contactName.placeholder")} 
              required 
              className="bg-muted"
              value={formData.contact_name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">{t("fields.email.label")}</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder={t("fields.email.placeholder")} 
              required 
              className="bg-muted"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t("fields.phone.label")}</Label>
            <Input 
              id="phone" 
              name="phone" 
              type="tel" 
              placeholder={t("fields.phone.placeholder")} 
              className="bg-muted"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company_size">
              {t(`fields.companySize.label.${requestType}`)}
            </Label>
            <Select 
              value={formData.company_size} 
              onValueChange={(value) => handleSelectChange('company_size', value)}
            >
              <SelectTrigger className="bg-muted">
                <SelectValue placeholder={t("fields.companySize.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(t.raw(`fields.companySize.options.${requestType}`)).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label as string}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">{t("fields.industry.label")}</Label>
            <Select 
              value={formData.industry} 
              onValueChange={(value) => handleSelectChange('industry', value)}
            >
              <SelectTrigger className="bg-muted">
                <SelectValue placeholder={t("fields.industry.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(t.raw("fields.industry.options")).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label as string}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="country">{t("fields.country.label")}</Label>
            <Input 
              id="country" 
              name="country" 
              placeholder={t("fields.country.placeholder")} 
              className="bg-muted"
              value={formData.country}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">{t("fields.city.label")}</Label>
            <Input 
              id="city" 
              name="city" 
              placeholder={t("fields.city.placeholder")} 
              className="bg-muted"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">{t("fields.message.label")}</Label>
          <Textarea 
            id="message" 
            name="message"
            placeholder={t("fields.message.placeholder")} 
            className="min-h-[120px] bg-muted" 
            value={formData.message}
            onChange={handleChange}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-primary to-chart-2 text-primary-foreground" 
          disabled={isSubmitting}
        >
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

