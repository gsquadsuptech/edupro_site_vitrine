"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Upload, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { useRecaptcha } from "@/components/marketing/recaptcha-provider"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.doc', '.docx']

export function SpontaneousApplicationForm() {
  const params = useParams()
  const router = useRouter()
  const locale = (params?.locale as string) || 'fr'
  const t = useTranslations('careers.spontaneous.form')
  const { executeRecaptcha, isLoaded: recaptchaLoaded } = useRecaptcha()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    coverLetter: '',
    interestDomain: '',
    availability: '',
    additionalMessage: '',
  })

  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvFileName, setCvFileName] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = t('validation.firstNameRequired')
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t('validation.lastNameRequired')
    }

    if (!formData.email.trim()) {
      newErrors.email = t('validation.emailRequired')
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = t('validation.emailInvalid')
      }
    }

    if (formData.phone && !/^\+?[0-9\s-()]+$/.test(formData.phone)) {
      newErrors.phone = t('validation.phoneInvalid')
    }

    if (!cvFile) {
      newErrors.cv = t('validation.cvRequired')
    } else {
      if (!ALLOWED_FILE_TYPES.includes(cvFile.type) && !ALLOWED_FILE_EXTENSIONS.some(ext => cvFile.name.toLowerCase().endsWith(ext))) {
        newErrors.cv = t('validation.cvInvalidType')
      } else if (cvFile.size > MAX_FILE_SIZE) {
        newErrors.cv = t('validation.cvTooLarge')
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file
      if (!ALLOWED_FILE_TYPES.includes(file.type) && !ALLOWED_FILE_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext))) {
        setErrors(prev => ({ ...prev, cv: t('validation.cvInvalidType') }))
        setCvFile(null)
        setCvFileName('')
        return
      }

      if (file.size > MAX_FILE_SIZE) {
        setErrors(prev => ({ ...prev, cv: t('validation.cvTooLarge') }))
        setCvFile(null)
        setCvFileName('')
        return
      }

      setCvFile(file)
      setCvFileName(file.name)
      if (errors.cv) {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.cv
          return newErrors
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setSubmitMessage('')

    try {
      // Vérifier reCAPTCHA
      if (!recaptchaLoaded) {
        throw new Error("reCAPTCHA n'est pas encore chargé. Veuillez patienter quelques instants.")
      }

      let recaptchaToken = ""
      try {
        recaptchaToken = await executeRecaptcha("submit_spontaneous_application")
      } catch (recaptchaError) {
        console.error("Erreur reCAPTCHA:", recaptchaError)
        throw new Error("Erreur lors de la vérification de sécurité. Veuillez réessayer.")
      }

      const formDataToSend = new FormData()
      formDataToSend.append('recaptcha_token', recaptchaToken)
      formDataToSend.append('firstName', formData.firstName)
      formDataToSend.append('lastName', formData.lastName)
      formDataToSend.append('email', formData.email)
      if (formData.phone) formDataToSend.append('phone', formData.phone)
      if (formData.coverLetter) formDataToSend.append('coverLetter', formData.coverLetter)
      if (formData.interestDomain) formDataToSend.append('interestDomain', formData.interestDomain)
      if (formData.availability) formDataToSend.append('availability', formData.availability)
      if (formData.additionalMessage) formDataToSend.append('additionalMessage', formData.additionalMessage)
      formDataToSend.append('locale', locale)
      if (cvFile) formDataToSend.append('cv', cvFile)

      const response = await fetch('/api/public/spontaneous-applications', {
        method: 'POST',
        body: formDataToSend,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t('error.message'))
      }

      setSubmitStatus('success')
      setSubmitMessage(t('success.message'))

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        coverLetter: '',
        interestDomain: '',
        availability: '',
        additionalMessage: '',
      })
      setCvFile(null)
      setCvFileName('')

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push(`/${locale}/carrieres`)
      }, 3000)

    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
      setSubmitStatus('error')
      setSubmitMessage(error instanceof Error ? error.message : t('error.message'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations personnelles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{locale === 'fr' ? 'Informations personnelles' : 'Personal Information'}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t('fields.firstName')} *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={errors.firstName ? 'border-destructive' : ''}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">{t('fields.lastName')} *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={errors.lastName ? 'border-destructive' : ''}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('fields.email')} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('fields.phone')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* CV */}
          <div className="space-y-2">
            <Label htmlFor="cv">{t('fields.cv')} *</Label>
            <div className="flex items-center gap-4">
              <Input
                id="cv"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className={errors.cv ? 'border-destructive' : ''}
              />
              {cvFileName && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>{cvFileName}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{t('fields.cvPlaceholder')}</p>
            {errors.cv && (
              <p className="text-sm text-destructive">{errors.cv}</p>
            )}
          </div>

          {/* Lettre de motivation */}
          <div className="space-y-2">
            <Label htmlFor="coverLetter">{t('fields.coverLetter')}</Label>
            <Textarea
              id="coverLetter"
              value={formData.coverLetter}
              onChange={(e) => handleInputChange('coverLetter', e.target.value)}
              placeholder={t('fields.coverLetterPlaceholder')}
              rows={5}
            />
          </div>

          {/* Domaine d'intérêt et disponibilité */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interestDomain">{t('fields.interestDomain')}</Label>
              <Select
                value={formData.interestDomain}
                onValueChange={(value) => handleInputChange('interestDomain', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('fields.interestDomainPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">{t('domains.development')}</SelectItem>
                  <SelectItem value="design">{t('domains.design')}</SelectItem>
                  <SelectItem value="marketing">{t('domains.marketing')}</SelectItem>
                  <SelectItem value="sales">{t('domains.sales')}</SelectItem>
                  <SelectItem value="support">{t('domains.support')}</SelectItem>
                  <SelectItem value="management">{t('domains.management')}</SelectItem>
                  <SelectItem value="other">{t('domains.other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">{t('fields.availability')}</Label>
              <Select
                value={formData.availability}
                onValueChange={(value) => handleInputChange('availability', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('fields.availabilityPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">{t('availabilityOptions.immediate')}</SelectItem>
                  <SelectItem value="oneMonth">{t('availabilityOptions.oneMonth')}</SelectItem>
                  <SelectItem value="twoMonths">{t('availabilityOptions.twoMonths')}</SelectItem>
                  <SelectItem value="threeMonths">{t('availabilityOptions.threeMonths')}</SelectItem>
                  <SelectItem value="flexible">{t('availabilityOptions.flexible')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Message additionnel */}
          <div className="space-y-2">
            <Label htmlFor="additionalMessage">{t('fields.additionalMessage')}</Label>
            <Textarea
              id="additionalMessage"
              value={formData.additionalMessage}
              onChange={(e) => handleInputChange('additionalMessage', e.target.value)}
              placeholder={t('fields.additionalMessagePlaceholder')}
              rows={4}
            />
          </div>

          {/* Messages de statut */}
          {submitStatus === 'success' && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>{t('success.title')}</AlertTitle>
              <AlertDescription>{submitMessage}</AlertDescription>
            </Alert>
          )}

          {submitStatus === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('error.title')}</AlertTitle>
              <AlertDescription>{submitMessage}</AlertDescription>
            </Alert>
          )}

          {/* Bouton de soumission */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('submitting')}
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {t('submit')}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

