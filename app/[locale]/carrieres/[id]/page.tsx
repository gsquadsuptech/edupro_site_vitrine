"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Clock, Briefcase, Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Container } from "@/components/marketing/layout/container"
import { Separator } from "@/components/ui/separator"
import { useTranslations, useLocale } from "next-intl"

interface CareerPosition {
    id: string
    title: string
    department?: string
    location?: string
    type?: string
    description: string
    requirements?: string
    benefits?: string
    closing_date?: string
    locale: string
}

export default function CareerDetailPage() {
    const params = useParams()
    const router = useRouter()
    const locale = (params?.locale as string) || 'fr'
    const positionId = params?.id as string
    const t = useTranslations('careers.detail')
    const currentLocale = useLocale()

    const [position, setPosition] = useState<CareerPosition | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!positionId) return

        const fetchPosition = async () => {
            try {
                setLoading(true)
                const response = await fetch(`/api/public/careers/${positionId}?locale=${locale}`)
                if (response.ok) {
                    const data = await response.json()
                    setPosition(data)
                } else {
                    setPosition(null)
                }
            } catch (error) {
                setPosition(null)
            } finally {
                setLoading(false)
            }
        }

        fetchPosition()
    }, [positionId, locale, router])

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Container className="py-20">
                    <div className="flex items-center justify-center h-64">
                        <p className="text-muted-foreground">{t('loading')}</p>
                    </div>
                </Container>
            </div>
        )
    }

    if (!position) {
        return (
            <div className="min-h-screen bg-background">
                <Container className="py-20">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">{t('notFound.title')}</h1>
                        <p className="text-muted-foreground mb-6">
                            {t('notFound.description')}
                        </p>
                        <Button onClick={() => router.push(`/${locale}/carrieres`)}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            {t('notFound.back')}
                        </Button>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Container className="py-12 md:py-20">
                {/* Bouton retour */}
                <Button
                    variant="ghost"
                    onClick={() => router.push(`/${locale}/carrieres`)}
                    className="mb-8"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('back')}
                </Button>

                {/* En-tête du poste */}
                <div className="mb-8">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        {position.department && (
                            <Badge variant="secondary" className="text-sm">
                                {position.department}
                            </Badge>
                        )}
                        {position.type && (
                            <Badge variant="outline" className="text-sm">
                                {position.type}
                            </Badge>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold mb-6">{position.title}</h1>

                    <div className="flex flex-wrap gap-4 text-muted-foreground mb-6">
                        {position.location && (
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {position.location}
                            </div>
                        )}
                        {position.type && (
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {position.type}
                            </div>
                        )}
                        {position.closing_date && (
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {t('sections.closingDateLabel')} {new Date(position.closing_date).toLocaleDateString(currentLocale)}
                            </div>
                        )}
                    </div>
                </div>

                <Separator className="my-8" />

                {/* Description */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        {t('sections.description')}
                    </h2>
                    <div
                        className="prose prose-slate max-w-none"
                        dangerouslySetInnerHTML={{ __html: position.description }}
                    />
                </div>

                {/* Exigences */}
                {position.requirements && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">{t('sections.requirements')}</h2>
                        <div
                            className="prose prose-slate max-w-none"
                            dangerouslySetInnerHTML={{ __html: position.requirements }}
                        />
                    </div>
                )}

                {/* Avantages */}
                {position.benefits && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">{t('sections.benefits')}</h2>
                        <div
                            className="prose prose-slate max-w-none"
                            dangerouslySetInnerHTML={{ __html: position.benefits }}
                        />
                    </div>
                )}

                {/* Bouton Postuler */}
                <div className="mt-12 pt-8 border-t">
                    <Button size="lg" className="group">
                        {t('applyNow')}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>
            </Container>
        </div>
    )
}
