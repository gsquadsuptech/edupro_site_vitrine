"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Loader2, AlertCircle, GraduationCap, Upload } from 'lucide-react'
import { useParams } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { useRecaptcha } from "@/components/marketing/recaptcha-provider"
import { useTranslations } from "next-intl"

interface TrainerApplicationFormProps {
  isBootcamp?: boolean
}

export function TrainerApplicationForm({ isBootcamp = false }: TrainerApplicationFormProps) {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const { executeRecaptcha, isLoaded: recaptchaLoaded } = useRecaptcha()
  const t = useTranslations("trainers.application")
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    experience_years: "",
    specialties: "",
    cover_letter: "",
    wants_certification: false,
    bootcamp: isBootcamp || false, // Initialiser avec le paramètre URL si présent
  })

  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvFileName, setCvFileName] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (field: 'wants_certification' | 'bootcamp', checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Vérifier la taille (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("form.errors.genericError"))
        return
      }
      // Vérifier le type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        toast.error(t("form.errors.genericError"))
        return
      }
      setCvFile(file)
      setCvFileName(file.name)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validation
      if (!formData.first_name || !formData.last_name || !formData.email) {
        throw new Error(t("form.errors.genericError"))
      }

      if (!cvFile) {
        throw new Error(t("form.errors.genericError"))
      }

      // Vérifier reCAPTCHA
      if (!recaptchaLoaded) {
        throw new Error(t("form.errors.recaptchaNotLoaded"))
      }

      let recaptchaToken = ""
      try {
        recaptchaToken = await executeRecaptcha("submit_trainer_application")
      } catch (recaptchaError) {
        console.error("Erreur reCAPTCHA:", recaptchaError)
        throw new Error(t("form.errors.recaptchaError"))
      }

      // Créer FormData pour l'envoi
      const formDataToSend = new FormData()
      formDataToSend.append('recaptcha_token', recaptchaToken)
      formDataToSend.append('first_name', formData.first_name)
      formDataToSend.append('last_name', formData.last_name)
      formDataToSend.append('email', formData.email)
      if (formData.phone) formDataToSend.append('phone', formData.phone)
      if (formData.experience_years) formDataToSend.append('experience_years', formData.experience_years)
      if (formData.specialties) formDataToSend.append('specialties', formData.specialties)
      if (formData.cover_letter) formDataToSend.append('cover_letter', formData.cover_letter)
      formDataToSend.append('wants_certification', formData.wants_certification ? 'true' : 'false')
      formDataToSend.append('locale', locale)
      formDataToSend.append('bootcamp', formData.bootcamp ? 'true' : 'false')
      formDataToSend.append('cv', cvFile)

      // Envoyer la candidature
      const response = await fetch('/api/trainer-applications', {
        method: 'POST',
        body: formDataToSend,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t("form.errors.submitError"))
      }

      setIsSuccess(true)
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        experience_years: "",
        specialties: "",
        cover_letter: "",
        wants_certification: false,
        bootcamp: isBootcamp || false,
      })
      setCvFile(null)
      setCvFileName("")
      toast.success(t("form.success.message"))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t("form.errors.genericError")
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
        <h3 className="mb-2 text-2xl font-bold">{t("form.success.title")}</h3>
        <p className="mb-8 text-muted-foreground">
          {t("form.success.message")}
        </p>
        <Button asChild variant="outline">
          <Link href={`/${locale}`}>
            {t("form.success.backHome")}
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-3">
          <GraduationCap className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{t("title")}</h2>
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
            <Label htmlFor="first_name">{t("form.fields.firstName.label")}</Label>
            <Input 
              id="first_name" 
              name="first_name" 
              placeholder={t("form.fields.firstName.placeholder")} 
              required 
              className="bg-muted"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">{t("form.fields.lastName.label")}</Label>
            <Input 
              id="last_name" 
              name="last_name" 
              placeholder={t("form.fields.lastName.placeholder")} 
              required 
              className="bg-muted"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">{t("form.fields.email.label")}</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder={t("form.fields.email.placeholder")} 
              required 
              className="bg-muted"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t("form.fields.phone.label")}</Label>
            <Input 
              id="phone" 
              name="phone" 
              type="tel" 
              placeholder={t("form.fields.phone.placeholder")} 
              className="bg-muted"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience_years">{t("form.fields.experienceYears.label")}</Label>
          <Select 
            value={formData.experience_years} 
            onValueChange={(value) => handleSelectChange('experience_years', value)}
          >
            <SelectTrigger className="bg-muted">
              <SelectValue placeholder={t("form.fields.experienceYears.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(t.raw("form.fields.experienceYears.options")).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label as string}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialties">{t("form.fields.specialties.label")}</Label>
          <Textarea 
            id="specialties" 
            name="specialties"
            placeholder={t("form.fields.specialties.placeholder")} 
            className="min-h-[100px] bg-muted" 
            value={formData.specialties}
            onChange={handleChange}
            required
          />
          <p className="text-xs text-muted-foreground">{t("form.fields.specialties.hint")}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cv">{t("form.fields.cv.label")}</Label>
          <div className="flex items-center gap-4">
            <Input 
              id="cv" 
              name="cv"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="bg-muted"
              required
            />
            {cvFileName && (
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Upload className="h-4 w-4" />
                {cvFileName}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cover_letter">{t("form.fields.coverLetter.label")}</Label>
          <Textarea 
            id="cover_letter" 
            name="cover_letter"
            placeholder={t("form.fields.coverLetter.placeholder")} 
            className="min-h-[150px] bg-muted" 
            value={formData.cover_letter}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="bootcamp" 
                checked={formData.bootcamp}
                onCheckedChange={(checked) => handleCheckboxChange('bootcamp', checked as boolean)}
                className="mt-1"
              />
              <div className="space-y-1">
                <Label 
                  htmlFor="bootcamp" 
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {t("form.fields.bootcamp.label")}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {t("form.fields.bootcamp.description")}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="wants_certification" 
                checked={formData.wants_certification}
                onCheckedChange={(checked) => handleCheckboxChange('wants_certification', checked as boolean)}
                className="mt-1"
              />
              <div className="space-y-1">
                <Label 
                  htmlFor="wants_certification" 
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {t("form.fields.certification.label")}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {t("form.fields.certification.price")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("form.fields.certification.includes")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-primary to-chart-2 text-primary-foreground" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("form.submit.sending")}
            </>
          ) : (
            t("form.submit.send")
          )}
        </Button>
      </form>
    </div>
  )
}

