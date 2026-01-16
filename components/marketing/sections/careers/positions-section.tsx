"use client"

import { useState, useEffect } from "react"
import { MapPin, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Container } from "@/components/marketing/layout/container"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useTranslations } from "next-intl"

interface CareerPosition {
  id: string
  title: string
  department?: string
  location?: string
  type?: string
  description: string
  locale: string
}

export function CareersPositionsSection() {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const t = useTranslations('careers.positions')
  const [positions, setPositions] = useState<CareerPosition[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/public/careers?locale=${locale}`)
        if (response.ok) {
          const data = await response.json()
          setPositions(data)
        }
      } catch (error) {
        // Erreur silencieuse - l'état de chargement sera géré
      } finally {
        setLoading(false)
      }
    }

    fetchPositions()
  }, [locale])

  if (loading) {
    return (
      <section id="positions" className="py-20 md:py-32 bg-muted/30">
        <Container>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">{t('loading')}</p>
          </div>
        </Container>
      </section>
    )
  }

  if (positions.length === 0) {
    return (
      <section id="positions" className="py-20 md:py-32 bg-muted/30">
        <Container>
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">{t('title')}</h2>
            <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">{t('empty')}</p>
          </div>
        </Container>
      </section>
    )
  }
  return (
    <section id="positions" className="py-20 md:py-32 bg-muted/30">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">{t('title')}</h2>
          <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
        </div>

        <div className="grid gap-6">
          {positions.map((position) => (
            <div key={position.id} className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-bold">{position.title}</h3>
                    <Badge variant="secondary">{position.department}</Badge>
                  </div>

                  <p className="mb-4 text-muted-foreground">{position.description}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {position.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {position.type}
                    </div>
                  </div>
                </div>

                <Link href={`/${locale}/carrieres/${position.id}`}>
                  <Button className="group">
                    {t('apply')}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-chart-2/5 p-8 text-center">
          <h3 className="mb-3 text-2xl font-bold">{t('noMatch.title')}</h3>
          <p className="mb-6 text-muted-foreground">
            {t('noMatch.description')}
          </p>
          <Button size="lg" variant="outline" asChild>
            <Link href={locale === 'fr' ? `/${locale}/candidature-spontanee` : `/${locale}/spontaneous-application`}>
              {t('noMatch.button')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  )
}

