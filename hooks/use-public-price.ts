"use client"

import { useEffect, useState } from "react"
import type { PublicPrice } from "@/lib/pricing"

/**
 * Récupère le « prix effectif » (promo publique) d'un item via le proxy serveur
 * `/api/marketplace/pricing`. Renvoie `null` s'il n'y a pas de promo, si l'item
 * est inconnu, ou en cas d'erreur réseau — l'appel ne doit JAMAIS bloquer le
 * checkout (repli silencieux sur le prix normal).
 *
 * @param enabled  permet de désactiver l'appel (ex. achat équipe).
 */
export function usePublicPrice(
    itemType: "course" | "learning_path" | undefined,
    itemId: string | undefined,
    enabled = true,
): PublicPrice | null {
    const [publicPrice, setPublicPrice] = useState<PublicPrice | null>(null)

    useEffect(() => {
        if (!enabled || !itemId || !itemType) {
            setPublicPrice(null)
            return
        }
        let active = true
        ;(async () => {
            try {
                const res = await fetch("/api/marketplace/pricing", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        items: [{ type: itemType === "learning_path" ? "learning-path" : "course", id: itemId }],
                    }),
                })
                const data = await res.json().catch(() => ({}))
                const p = data?.prices?.[itemId]
                if (!active) return
                if (p && p.hasPublicPromo && Number(p.discountedPrice) < Number(p.originalPrice)) {
                    setPublicPrice({
                        originalPrice: Number(p.originalPrice) || 0,
                        discountedPrice: Number(p.discountedPrice) || 0,
                        discountAmount: Number(p.discountAmount) || 0,
                        percentageOff: Number(p.percentageOff) || 0,
                        hasPublicPromo: true,
                        promo: p.promo ?? null,
                    })
                } else {
                    setPublicPrice(null)
                }
            } catch {
                // Repli silencieux : prix normal.
            }
        })()
        return () => {
            active = false
        }
    }, [itemType, itemId, enabled])

    return publicPrice
}
