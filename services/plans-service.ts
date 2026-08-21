import "server-only"

/**
 * Lecture du catalogue d'offres (plans d'abonnement) via l'API SaaS.
 *
 * Source unique : le SaaS resout deja l'heritage entre plans et les overrides.
 * La vitrine ne recalcule rien et n'affiche que ce qu'elle recoit — c'est ce
 * qui garantit qu'une modification faite par un superadmin se reflete ici sans
 * intervention.
 *
 * Pas de cle API, comme `pricing-service` : les tarifs publics sont publics.
 * L'API SaaS restreint deja les origines et ne renvoie aucune donnee technique
 * (pas de code de permission, pas d'identifiant, pas de chaine d'heritage).
 */

const SAAS_URL = process.env.SAAS_API_URL || process.env.NEXT_PUBLIC_SAAS_URL

export type PlanCategoryCode = "business" | "teach"

export interface PlanPriceView {
    amount: string
    unit: string
    note?: string
}

export interface PlanLimitsView {
    administrateurs: string
    apprenants: string
    utilisateurs: string
    cours: string
    stockage: string
}

/** Economie reelle de l'engagement annuel, calculee par le SaaS. */
export interface AnnualDiscountView {
    percent: number
    monthsFree: number | null
    savings: number
}

/**
 * Famille commerciale. Un abonnement, une certification et un partenariat ne
 * se presentent pas dans la meme grille : ce champ pilote la separation.
 */
export type PlanFamily = "subscription" | "certification" | "partnership"

export interface PublicPlan {
    name: string
    fullName: string
    tagline: string | null
    description: string | null
    audience: string | null
    highlighted: boolean
    free: boolean
    family: PlanFamily
    cta: string | null
    /** demo | signup | contact | bootcamp */
    ctaType: string | null
    /** Le tarif est un plancher : le prix se negocie selon le volume. */
    fromPrice: boolean
    annualDiscount: AnnualDiscountView | null
    price: { monthly: PlanPriceView; yearly: PlanPriceView }
    limits: PlanLimitsView | null
    /** Liste nominative et complete : l'heritage est deja resolu cote SaaS. */
    features: string[]
    /** Mentions commerciales, sans effet technique. */
    claims: string[]
}

export interface PublicAddon {
    name: string
    description: string | null
    price: string
    period: string
    /** Libelle pret a afficher : "par mois", "paiement unique". */
    periodLabel: string
}

export interface PublicPlanCatalog {
    category: { code: string; name: string; subtitle: string | null }
    plans: PublicPlan[]
    addons: PublicAddon[]
}

export const PlansService = {
    /**
     * Catalogue d'une gamme. Renvoie `null` en cas d'indisponibilite : les
     * appelants retombent alors sur le contenu statique des fichiers de
     * traduction, pour qu'une panne de l'API ne vide jamais la page.
     */
    async getCatalog(category: PlanCategoryCode): Promise<PublicPlanCatalog | null> {
        if (!SAAS_URL) {
            console.error("PlansService: SAAS_API_URL / NEXT_PUBLIC_SAAS_URL manquante")
            return null
        }

        try {
            const res = await fetch(
                `${SAAS_URL}/api/public/pricing?category=${encodeURIComponent(category)}`,
                // Le catalogue bouge rarement : 5 minutes suffisent, et une
                // modification superadmin se propage sans redeploiement.
                { next: { revalidate: 300 } },
            )

            if (!res.ok) return null

            const data = await res.json()
            if (!Array.isArray(data?.plans)) return null

            return data as PublicPlanCatalog
        } catch (error) {
            console.error("PlansService.getCatalog:", error)
            return null
        }
    },
}
