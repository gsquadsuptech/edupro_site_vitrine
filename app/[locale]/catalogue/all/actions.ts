"use server"

import { MarketplaceService } from "@/services/marketplace-service"
import { PricingService, pricingTargetsFromItems } from "@/services/pricing-service"
import type { CourseSort } from "@/services/course-service"
import type { MarketplaceItem } from "@/lib/supabase/types"
import type { PublicPriceMap } from "@/lib/pricing"

/**
 * Paramètres de filtrage du catalogue, sans la fenêtre de pagination
 * (`offset`/`limit` sont fournis à part par le chargement incrémental).
 */
export interface CatalogueQuery {
    type: "course" | "learning_path" | "all"
    searchTerm: string
    category: string
    minPrice?: number
    maxPrice?: number
    level?: string[]
    sort: CourseSort
}

/**
 * Server Action de chargement incrémental (infinite scroll / « Charger plus »).
 *
 * Le prix effectif (promos publiques) étant `server-only`, on ne peut pas le
 * lire depuis le navigateur : cette action renvoie donc le lot d'items ET leurs
 * prix promo en un seul aller-retour, exactement comme le rendu serveur initial.
 */
export async function loadCatalogueItems(
    query: CatalogueQuery,
    offset: number,
    limit: number,
): Promise<{ items: MarketplaceItem[]; promoPrices: PublicPriceMap; total: number }> {
    const { items, total } = await MarketplaceService.listMarketplaceItems({
        ...query,
        offset,
        limit,
    })
    const promoPrices = await PricingService.getEffectivePrices(pricingTargetsFromItems(items))
    return { items, promoPrices, total }
}
