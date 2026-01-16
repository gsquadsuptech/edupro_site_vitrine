"use client"

import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/marketing/layout/container"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import Image from "next/image"

export function CareersHeroSection() {
  const params = useParams()
  const locale = params?.locale || 'fr'
  const t = useTranslations('careers.hero')

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 md:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{t('badge')}</span>
            </div>

            <h1 className="mb-6 text-balance text-4xl font-bold md:text-5xl lg:text-6xl">
              {t('title')}{" "}
              <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                {t('titleHighlight')}
              </span>
            </h1>

            <p className="mb-8 text-xl text-muted-foreground">
              {t('subtitle')}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="group bg-gradient-to-r from-primary to-chart-2" asChild>
                <Link href="#positions">
                  {t('cta.viewPositions')}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={locale === 'fr' ? `/${locale}/candidature-spontanee` : `/${locale}/spontaneous-application`}>{t('cta.spontaneous')}</Link>
              </Button>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-8 border-t border-border pt-8">
              <div>
                <p className="text-3xl font-bold text-primary">3</p>
                <p className="text-xs font-medium text-muted-foreground">{t('stats.countries')}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">100%</p>
                <p className="text-xs font-medium text-muted-foreground">{t('stats.remote')}</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-chart-2/20 relative">
              <Image
                src="/images/edupro-entreprise1.png"
                alt={t('imageAlt')}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

