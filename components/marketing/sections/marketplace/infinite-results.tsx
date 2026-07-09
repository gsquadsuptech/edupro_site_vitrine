"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

import { FormationCard } from "@/components/marketing/marketplace/formation-card"
import { EmptyState } from "@/components/marketing/sections/marketplace/search-results"
import { Button } from "@/components/ui/button"
import type { MarketplaceItem } from "@/lib/supabase/types"
import type { PublicPriceMap } from "@/lib/pricing"
import { loadCatalogueItems, type CatalogueQuery } from "@/app/[locale]/catalogue/all/actions"

interface InfiniteResultsProps {
    initialItems: MarketplaceItem[]
    initialPromoPrices: PublicPriceMap
    total: number
    pageSize: number
    query: CatalogueQuery
}

const itemKey = (i: MarketplaceItem) => `${i.kind}-${i.data.id}`

export function InfiniteResults({
    initialItems,
    initialPromoPrices,
    total,
    pageSize,
    query,
}: InfiniteResultsProps) {
    const [items, setItems] = useState<MarketplaceItem[]>(initialItems)
    const [promoPrices, setPromoPrices] = useState<PublicPriceMap>(initialPromoPrices)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const sentinelRef = useRef<HTMLDivElement>(null)
    // Garde-fou synchrone contre les appels concurrents (StrictMode qui invoque
    // deux fois, ou la sentinelle qui reste visible entre deux lots).
    const loadingRef = useRef(false)
    const hasMore = items.length < total

    const loadMore = useCallback(async () => {
        if (loadingRef.current || items.length >= total) return
        loadingRef.current = true
        setLoading(true)
        setError(false)
        try {
            const res = await loadCatalogueItems(query, items.length, pageSize)
            setItems((prev) => {
                const seen = new Set(prev.map(itemKey))
                const fresh = res.items.filter((i) => !seen.has(itemKey(i)))
                return [...prev, ...fresh]
            })
            setPromoPrices((prev) => ({ ...prev, ...res.promoPrices }))
        } catch {
            setError(true)
        } finally {
            loadingRef.current = false
            setLoading(false)
        }
    }, [query, pageSize, items.length, total])

    // Chargement automatique : dès que la sentinelle approche du viewport
    // (marge de 400px pour précharger avant d'atteindre le bas), on charge la
    // suite. Le bouton « Charger plus » sert de repli manuel / accessibilité.
    useEffect(() => {
        if (!hasMore || loading) return
        const el = sentinelRef.current
        if (!el) return
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) loadMore()
            },
            { rootMargin: "400px" },
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [hasMore, loading, loadMore])

    if (items.length === 0) {
        return (
            <div className="flex-1">
                <EmptyState />
            </div>
        )
    }

    return (
        <div className="flex-1">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((entry) => (
                    <FormationCard key={itemKey(entry)} item={entry} promo={promoPrices?.[entry.data.id]} />
                ))}
            </div>

            {hasMore ? (
                <div ref={sentinelRef} className="mt-10 flex flex-col items-center gap-3">
                    {loading ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Chargement…
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center gap-2">
                            <p className="text-sm text-muted-foreground">Impossible de charger la suite.</p>
                            <Button variant="outline" onClick={loadMore}>
                                Réessayer
                            </Button>
                        </div>
                    ) : (
                        <Button variant="outline" onClick={loadMore}>
                            Charger plus de formations
                        </Button>
                    )}
                </div>
            ) : (
                <p className="mt-10 text-center text-sm text-muted-foreground">
                    Vous avez parcouru les {total} formations.
                </p>
            )}
        </div>
    )
}
