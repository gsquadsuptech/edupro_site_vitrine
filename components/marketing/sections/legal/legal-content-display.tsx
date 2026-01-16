"use client"

import { useEffect, useState } from "react"
import { Loader2, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface LegalContentDisplayProps {
  locale: string
}

interface LegalContent {
  id: string
  locale: string
  content: string
  updated_at: string
}

export function LegalContentDisplay({ locale }: LegalContentDisplayProps) {
  const [content, setContent] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/legal?locale=${locale}`)
        
        if (!response.ok) {
          throw new Error("Erreur lors du chargement du contenu")
        }

        const data: LegalContent | null = await response.json()

        if (data && data.content) {
          setContent(data.content)
        } else {
          // Contenu par défaut si aucun contenu n'est défini
          setContent(
            locale === 'fr'
              ? "<p>Le contenu des mentions légales sera bientôt disponible.</p>"
              : "<p>Legal notice content will be available soon.</p>"
          )
        }
      } catch (err) {
        console.error('Erreur lors du chargement du contenu légal:', err)
        setError(err instanceof Error ? err.message : "Une erreur est survenue")
        setContent(
          locale === 'fr'
            ? "<p>Erreur lors du chargement du contenu. Veuillez réessayer plus tard.</p>"
            : "<p>Error loading content. Please try again later.</p>"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [locale])

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              {locale === 'fr' ? 'Chargement...' : 'Loading...'}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="py-8">
        {error && (
          <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}
        <div 
          className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-strong:text-slate-900 prose-ul:text-slate-700 prose-ol:text-slate-700 prose-li:text-slate-700 prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </CardContent>
    </Card>
  )
}

