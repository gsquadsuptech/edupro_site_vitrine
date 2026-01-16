"use client"

import { useState, useEffect } from "react"
import { Container } from "@/components/marketing/layout/container"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"

interface BlogArticle {
  id: string
  title: string
  slug: string
  excerpt?: string
  category?: string
  image_url?: string
  read_time?: number
  published_at?: string
  locale: string
}

export function BlogArticlesSection() {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const t = useTranslations("blog")
  const [articles, setArticles] = useState<BlogArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/public/blog?locale=${locale}`)
        if (response.ok) {
          const data = await response.json()
          setArticles(data)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des articles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [locale])

  if (loading) {
    return (
      <section className="bg-background py-20 lg:py-32">
        <Container>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">{t("articles.loading")}</p>
          </div>
        </Container>
      </section>
    )
  }

  if (articles.length === 0) {
    return (
      <section className="bg-background py-20 lg:py-32">
        <Container>
          <div className="text-center">
            <p className="text-muted-foreground">{t("articles.empty")}</p>
          </div>
        </Container>
      </section>
    )
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <section className="bg-background py-20 lg:py-32">
      <Container>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="group overflow-hidden border border-border bg-card transition-all hover:shadow-lg"
            >
              <Link href={`/${locale}/blog/${article.slug}`} className="block">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={article.image_url || "/placeholder.svg"}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {article.category && (
                    <Badge className="absolute right-4 top-4 border-0 bg-background/95 font-semibold text-foreground shadow-md backdrop-blur-sm">
                      {article.category}
                    </Badge>
                  )}
                </div>
              </Link>

              <div className="p-6">
                <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
                  {article.published_at && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(article.published_at)}</span>
                    </div>
                  )}
                  {article.read_time && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{article.read_time} min</span>
                    </div>
                  )}
                </div>

                <h3 className="mb-3 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                  {article.title}
                </h3>

                {article.excerpt && (
                  <p className="mb-4 text-muted-foreground">{article.excerpt}</p>
                )}

                <Button variant="ghost" className="group/btn p-0 text-primary hover:bg-transparent" asChild>
                  <Link href={`/${locale}/blog/${article.slug}`}>
                    {t("articles.readArticle")}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}

