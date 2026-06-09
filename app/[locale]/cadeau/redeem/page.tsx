"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Gift, Loader2, CheckCircle2, AlertTriangle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface GiftPreview {
  status: 'pending_payment' | 'paid' | 'redeemed' | 'expired' | 'cancelled'
  courseId: string | null
  cohortId: string | null
  recipientEmail: string
  recipientName: string | null
  message: string | null
  expiresAt: string | null
  redeemable: boolean
}

export default function GiftRedeemPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const searchParams = useSearchParams()
  const code = searchParams.get('code') || ''

  const [loading, setLoading] = useState(true)
  const [redeeming, setRedeeming] = useState(false)
  const [gift, setGift] = useState<GiftPreview | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [course, setCourse] = useState<{ title: string; slug: string } | null>(null)
  const [redeemed, setRedeemed] = useState(false)

  const loadCourse = useCallback(async (courseId: string) => {
    const supabase = createClient()
    const { data } = await supabase
      .from('courses')
      .select('title, slug')
      .eq('id', courseId)
      .maybeSingle()
    if (data) setCourse(data as any)
  }, [])

  useEffect(() => {
    if (!code) {
      setError("Aucun code de cadeau fourni.")
      setLoading(false)
      return
    }
    let active = true
    ;(async () => {
      try {
        const res = await fetch(`/api/gift/redeem?code=${encodeURIComponent(code)}`)
        const data = await res.json().catch(() => ({}))
        if (!active) return
        if (!res.ok) {
          setError(data?.error || "Code de cadeau invalide.")
        } else {
          setGift(data)
          if (data.courseId) loadCourse(data.courseId)
        }
      } catch {
        if (active) setError("Service indisponible. Réessayez plus tard.")
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [code, loadCourse])

  const handleRedeem = async () => {
    setRedeeming(true)
    try {
      const res = await fetch('/api/gift/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.success) {
        setRedeemed(true)
        toast.success("Cadeau activé ! L'accès a été ajouté à votre compte.")
      } else {
        toast.error(data?.error || "Impossible d'activer ce cadeau.")
      }
    } catch {
      toast.error("Service indisponible. Réessayez.")
    } finally {
      setRedeeming(false)
    }
  }

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Gift className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold">Votre cadeau EduPro</h1>
        </div>

        {loading && (
          <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Vérification du code...</span>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <AlertTriangle className="h-8 w-8 text-orange-500" />
            <p className="text-muted-foreground">{error}</p>
            <Link href={`/${locale}/catalogue`}>
              <Button variant="outline">Découvrir le catalogue</Button>
            </Link>
          </div>
        )}

        {!loading && gift && !error && (
          <div className="space-y-5">
            {course && (
              <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
                <p className="text-sm text-muted-foreground">Formation offerte</p>
                <p className="text-lg font-bold">{course.title}</p>
              </div>
            )}

            {gift.message && (
              <blockquote className="border-l-2 border-primary/40 pl-4 text-sm italic text-muted-foreground">
                « {gift.message} »
              </blockquote>
            )}

            {/* États */}
            {redeemed || gift.status === 'redeemed' ? (
              <div className="flex flex-col items-center gap-3 py-2 text-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                <p className="font-medium">
                  {redeemed ? "Accès activé avec succès !" : "Ce cadeau a déjà été activé."}
                </p>
                {course && (
                  <Link href={`/${locale}/formation/${course.slug}`}>
                    <Button>Accéder à la formation</Button>
                  </Link>
                )}
              </div>
            ) : gift.status === 'paid' || gift.redeemable ? (
              <Button className="w-full" onClick={handleRedeem} disabled={redeeming}>
                {redeeming ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Gift className="mr-2 h-4 w-4" />}
                Activer mon cadeau
              </Button>
            ) : gift.status === 'pending_payment' ? (
              <div className="flex items-center gap-2 rounded-lg bg-orange-50 p-3 text-sm text-orange-700 dark:bg-orange-950/30 dark:text-orange-400">
                <Clock className="h-4 w-4 shrink-0" />
                Le paiement de ce cadeau n'est pas encore confirmé.
              </div>
            ) : gift.status === 'expired' ? (
              <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Ce cadeau a expiré.
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Ce cadeau a été annulé.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
