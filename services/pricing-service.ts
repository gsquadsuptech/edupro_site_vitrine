import "server-only"

import { unstable_cache } from "next/cache"

import type { MarketplaceItem } from "@/lib/supabase/types"
import type {
    PricingItemType,
    PricingTarget,
    PublicPrice,
    PublicPriceMap,
} from "@/lib/pricing"

/**
 * Lecture du « prix effectif » (meilleure promo publique applicable) via l'API
 * SaaS `POST /api/marketplace/pricing`.
 *
 * - Aucune authentification ni clé API : les prix publics sont... publics. On ne
 *   gate donc PAS sur `MARKETPLACE_API_KEY` (contrairement aux autres services
 *   SaaS), seulement sur l'URL de base.
 * - Robustesse : en cas d'erreur réseau / réponse invalide, on renvoie une map
 *   vide. Les appelants se rabattent alors sur le prix normal déjà connu de la
 *   vitrine — l'appel pricing ne doit JAMAIS bloquer le rendu.
 * - Cache court (60 s) : les promos changent rarement en temps réel. Le cache ne
 *   mémorise QUE les succès (l'échec lève une exception interne, jamais cachée).
 */

const SAAS_URL = process.env.SAAS_API_URL || process.env.NEXT_PUBLIC_SAAS_URL

const PRICING_REVALIDATE_SECONDS = 60

/** Map le type interne (`learning_path`) vers le type attendu par l'API (`learning-path`). */
function toApiType(type: PricingItemType): "course" | "learning-path" {
    return type === "learning_path" ? "learning-path" : "course"
}

/** Normalise un item de réponse défensive (champs numériques, flag promo cohérent). */
function normalizePublicPrice(raw: any): PublicPrice | null {
    if (!raw || typeof raw !== "object") return null
    const originalPrice = Number(raw.originalPrice) || 0
    const discountedPrice = Number(raw.discountedPrice ?? originalPrice) || 0
    return {
        originalPrice,
        discountedPrice,
        discountAmount: Number(raw.discountAmount) || 0,
        percentageOff: Number(raw.percentageOff) || 0,
        // Double garde-fou : on ne considère la promo active que si le serveur
        // l'annonce ET que le prix remisé est réellement inférieur.
        hasPublicPromo: !!raw.hasPublicPromo && discountedPrice < originalPrice,
        promo: raw.promo ?? null,
    }
}

/** Déduplique + ordonne les cibles pour des clés de cache stables. */
function dedupeTargets(targets: PricingTarget[]): PricingTarget[] {
    const seen = new Set<string>()
    const out: PricingTarget[] = []
    for (const t of targets) {
        if (!t?.id) continue
        const key = `${t.type}:${t.id}`
        if (seen.has(key)) continue
        seen.add(key)
        out.push({ type: t.type, id: t.id })
    }
    out.sort((a, b) => `${a.type}:${a.id}`.localeCompare(`${b.type}:${b.id}`))
    return out
}

/** Lève en cas d'échec : `unstable_cache` ne mémorise alors pas l'erreur. */
async function fetchPricesUncached(targets: PricingTarget[]): Promise<PublicPriceMap> {
    if (!SAAS_URL) throw new Error("PricingService: SAAS_URL absente")

    const res = await fetch(`${SAAS_URL}/api/marketplace/pricing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            items: targets.map((t) => ({ type: toApiType(t.type), id: t.id })),
        }),
        // Borne le temps d'attente : l'appel pricing ne doit jamais bloquer le
        // rendu de la page. Un timeout lève → fallback prix normal (non caché).
        signal: AbortSignal.timeout(4000),
    })
    // 404 = endpoint pricing absent (ex. SaaS local sans la route promos).
    // Ce n'est pas une erreur : pas de promo publique → on renvoie une map vide
    // et les appelants gardent le prix normal. On évite ainsi de polluer la
    // console (et l'overlay d'erreur Next en dev) pour un cas dégradé attendu.
    if (res.status === 404) {
        console.warn("PricingService: endpoint /api/marketplace/pricing absent (404) — promos publiques ignorées")
        return {}
    }
    if (!res.ok) throw new Error(`PricingService: réponse ${res.status}`)

    const data = await res.json()
    const prices = data?.prices
    if (!prices || typeof prices !== "object") return {}

    const out: PublicPriceMap = {}
    for (const [id, raw] of Object.entries(prices)) {
        const normalized = normalizePublicPrice(raw)
        if (normalized) out[id] = normalized
    }
    return out
}

const cachedFetchPrices = unstable_cache(
    fetchPricesUncached,
    ["marketplace-pricing"],
    { revalidate: PRICING_REVALIDATE_SECONDS },
)

export const PricingService = {
    /**
     * Récupère les prix effectifs d'un lot d'items en UN SEUL appel (recommandé
     * pour les listes catalogue). Renvoie une map `itemId -> PublicPrice`, vide
     * si l'API est indisponible.
     */
    async getEffectivePrices(targets: PricingTarget[]): Promise<PublicPriceMap> {
        const unique = dedupeTargets(targets)
        if (unique.length === 0) return {}
        try {
            return await cachedFetchPrices(unique)
        } catch (error) {
            console.error("PricingService.getEffectivePrices:", error)
            return {}
        }
    },

    /** Récupère le prix effectif d'un seul item (pages détail). `null` si indisponible. */
    async getEffectivePrice(type: PricingItemType, id: string): Promise<PublicPrice | null> {
        if (!id) return null
        const map = await this.getEffectivePrices([{ type, id }])
        return map[id] ?? null
    },
}

/** Extrait les cibles `{type,id}` d'une liste de `MarketplaceItem` pour un appel batch. */
export function pricingTargetsFromItems(items: MarketplaceItem[]): PricingTarget[] {
    return items.map((item) => ({
        type: item.kind === "learning_path" ? "learning_path" : "course",
        id: item.data.id,
    }))
}
