"use client"

import { useState, useEffect } from "react"
import { Container } from "@/components/marketing/layout/container"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Clock, ArrowLeft, Share2, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"

interface BlogArticle {
    id: string
    title: string
    slug: string
    excerpt?: string
    content: string
    category?: string
    image_url?: string
    author_name?: string
    author_role?: string
    author_avatar_url?: string
    read_time?: number
    published_at?: string
    locale: string
}

export default function BlogArticlePage() {
    const params = useParams()
    const locale = (params?.locale as string) || 'fr'
    const articleSlug = params?.id as string
    const [article, setArticle] = useState<BlogArticle | null>(null)
    const [relatedArticles, setRelatedArticles] = useState<BlogArticle[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true)
                // Vérifier si le paramètre preview est présent dans l'URL
                const urlParams = new URLSearchParams(window.location.search)
                const preview = urlParams.get('preview') === 'true'
                const apiUrl = `/api/public/blog/${articleSlug}?locale=${locale}${preview ? '&preview=true' : ''}`

                const response = await fetch(apiUrl)
                if (response.ok) {
                    const data = await response.json()
                    setArticle(data)

                    // Charger les articles connexes (uniquement publiés)
                    const relatedResponse = await fetch(`/api/public/blog?locale=${locale}&limit=4`)
                    if (relatedResponse.ok) {
                        const relatedData = await relatedResponse.json()
                        setRelatedArticles(relatedData.filter((a: BlogArticle) => a.slug !== articleSlug).slice(0, 3))
                    }
                }
            } catch (error) {
                console.error('Erreur lors du chargement de l\'article:', error)
            } finally {
                setLoading(false)
            }
        }

        if (articleSlug) {
            fetchArticle()
        }
    }, [articleSlug, locale])

    if (loading) {
        return (
            <main className="flex-1">
                <Container className="py-20">
                    <div className="flex items-center justify-center h-64">
                        <p className="text-muted-foreground">Chargement de l'article...</p>
                    </div>
                </Container>
            </main>
        )
    }

    if (!article) {
        return (
            <main className="flex-1">
                <Container className="py-20">
                    <div className="text-center">
                        <h1 className="mb-4 text-3xl font-bold">Article non trouvé</h1>
                        <Button asChild>
                            <Link href={`/${locale}/blog`}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Retour au blog
                            </Link>
                        </Button>
                    </div>
                </Container>
            </main>
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
        <main className="flex-1">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-background to-primary/5 py-12">
                <Container>
                    <Button variant="ghost" asChild className="mb-6">
                        <Link href={`/${locale}/blog`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Retour au blog
                        </Link>
                    </Button>

                    <div className="mx-auto max-w-4xl">
                        {article.category && <Badge className="mb-4">{article.category}</Badge>}

                        <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight lg:text-5xl">{article.title}</h1>

                        <div className="mb-8 flex items-center gap-6 text-muted-foreground">
                            {article.published_at && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{formatDate(article.published_at)}</span>
                                </div>
                            )}
                            {article.read_time && (
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>{article.read_time} min</span>
                                </div>
                            )}
                        </div>

                        {(article.author_name || article.author_avatar_url) && (
                            <div className="mb-8 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {article.author_avatar_url && (
                                        <Image
                                            src={article.author_avatar_url}
                                            alt={article.author_name || "Auteur"}
                                            width={48}
                                            height={48}
                                            className="rounded-full"
                                        />
                                    )}
                                    {article.author_name && (
                                        <div>
                                            <div className="font-semibold">{article.author_name}</div>
                                            {article.author_role && (
                                                <div className="text-sm text-muted-foreground">{article.author_role}</div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <Button variant="outline" size="icon">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        {article.image_url && (
                            <div className="relative aspect-video overflow-hidden rounded-lg">
                                <Image src={article.image_url} alt={article.title} fill className="object-cover" />
                            </div>
                        )}
                    </div>
                </Container>
            </section>

            {/* Article Content */}
            <section className="bg-background py-12 lg:py-20">
                <Container>
                    <article
                        className="mx-auto max-w-4xl prose prose-slate"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </Container>
            </section>

            <section className="border-t border-border bg-gradient-to-b from-background to-primary/5 py-12 lg:py-20">
                <Container>
                    {relatedArticles.length > 0 && (
                        <>
                            <h2 className="mb-8 text-center text-3xl font-bold">Ces articles pourraient vous intéresser aussi</h2>
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {relatedArticles.map((related) => (
                                    <Card
                                        key={related.id}
                                        className="group overflow-hidden border border-border bg-card transition-all hover:shadow-lg"
                                    >
                                        <Link href={`/${locale}/blog/${related.slug}`} className="block">
                                            <div className="relative aspect-[16/10] overflow-hidden">
                                                <Image
                                                    src={related.image_url || "/placeholder.svg"}
                                                    alt={related.title}
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-105"
                                                />
                                                {related.category && (
                                                    <Badge className="absolute right-4 top-4 border-0 bg-background/95 font-semibold text-foreground shadow-md backdrop-blur-sm">
                                                        {related.category}
                                                    </Badge>
                                                )}
                                            </div>
                                        </Link>

                                        <div className="p-6">
                                            <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
                                                {related.published_at && (
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{formatDate(related.published_at)}</span>
                                                    </div>
                                                )}
                                                {related.read_time && (
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{related.read_time} min</span>
                                                    </div>
                                                )}
                                            </div>

                                            <h3 className="mb-3 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                                                {related.title}
                                            </h3>

                                            {related.excerpt && (
                                                <p className="mb-4 text-muted-foreground">{related.excerpt}</p>
                                            )}

                                            <Button variant="ghost" className="group/btn p-0 text-primary hover:bg-transparent" asChild>
                                                <Link href={`/${locale}/blog/${related.slug}`}>
                                                    Lire l'article
                                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </>
                    )}
                </Container>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-b from-primary/5 to-background py-12 lg:py-20">
                <Container>
                    <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 text-center lg:p-12">
                        <h2 className="mb-4 text-3xl font-bold">Prêt à transformer votre passion en business ?</h2>
                        <p className="mb-6 text-lg text-muted-foreground">
                            Rejoignez les 120+ entrepreneures qui ont déjà développé leur marque grâce à nos formations
                        </p>
                        <Button size="lg" className="bg-gradient-to-r from-primary to-chart-2" asChild>
                            <Link href={`/${locale}/catalogue`}>Découvrir nos formations</Link>
                        </Button>
                    </div>
                </Container>
            </section>
        </main>
    )
}
