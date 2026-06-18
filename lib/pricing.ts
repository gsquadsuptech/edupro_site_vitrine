export type PricingModes = {
    oneTime: boolean
    installments: boolean
    subscription: boolean
    registrationMonthly: boolean
}

export type PricingModeKey = keyof PricingModes

/** Type d'item tel qu'utilisé en interne sur la vitrine. */
export type PricingItemType = "course" | "learning_path"

/** Cible d'un calcul de prix effectif (un cours ou un parcours). */
export interface PricingTarget {
    type: PricingItemType
    id: string
}

/**
 * Prix effectif renvoyé par l'API SaaS `POST /api/marketplace/pricing`.
 * Quand `hasPublicPromo === false`, `discountedPrice === originalPrice` et
 * `discountAmount === 0` : on affiche alors le prix normal sans badge.
 */
export interface PublicPrice {
    originalPrice: number
    discountedPrice: number
    discountAmount: number
    /** Pourcentage déjà arrondi côté serveur, prêt pour le badge `-XX%`. */
    percentageOff: number
    hasPublicPromo: boolean
    promo?: {
        discountId: string
        name: string
        type: string
        value: number
        /** Plafond de remise (promo %) si renvoyé par l'API. */
        maxDiscount?: number | null
        /** Montant minimum d'achat si renvoyé par l'API. */
        minPurchase?: number | null
    } | null
}

/** Map `itemId -> PublicPrice` telle que renvoyée par l'API (champ `prices`). */
export type PublicPriceMap = Record<string, PublicPrice>

/**
 * Calcule la remise d'une promo publique pour un montant donné, en répliquant
 * EXACTEMENT la logique serveur (`getEffectivePrice` côté SaaS, appliquée par
 * `/api/payments/initialize` sur le montant envoyé) :
 *  - pourcentage : `montant * value / 100`, plafonné par `maxDiscount` ;
 *  - fixe : `min(value, montant)` ;
 *  - ignorée si `montant < minPurchase`.
 *
 * Permet d'afficher au checkout le MÊME montant remisé que celui que le serveur
 * facturera, quel que soit le plan (paiement unique, échéance, mensualité…).
 */
export function computePublicPromoDiscount(
    amount: number,
    promo: PublicPrice["promo"] | null | undefined,
): number {
    if (!promo || !(amount > 0)) return 0
    const value = Number(promo.value) || 0
    const minPurchase = Number(promo.minPurchase ?? 0)
    if (amount < minPurchase) return 0

    let discount = promo.type === "percentage" ? (amount * value) / 100 : Math.min(value, amount)
    if (promo.type === "percentage" && promo.maxDiscount != null && discount > promo.maxDiscount) {
        discount = promo.maxDiscount
    }
    return Math.min(Math.max(0, Math.round(discount)), amount)
}

/**
 * Formatage FCFA cohérent avec l'existant : séparateurs de milliers fr-FR,
 * pas de décimales, suffixe « FCFA ». Pour un montant nul, renvoie « Gratuit »
 * (convention de la vitrine) sauf si `freeLabel` est explicitement désactivé.
 */
export function formatFCFA(amount: number | null | undefined, opts?: { zeroAsFree?: boolean }): string {
    const n = Math.round(Number(amount) || 0)
    if (n <= 0 && opts?.zeroAsFree) return "Gratuit"
    return `${new Intl.NumberFormat("fr-FR").format(n)} FCFA`
}

export function parsePricingModes(raw: any): Record<string, any> {
    if (!raw) return {}
    if (typeof raw === "object" && !Array.isArray(raw)) return raw
    if (typeof raw === "string") {
        try {
            return JSON.parse(raw)
        } catch {
            return {}
        }
    }
    return {}
}

export function parseInstallments(raw: any): any[] {
    if (Array.isArray(raw)) return raw
    if (typeof raw === "string") {
        try {
            const parsed = JSON.parse(raw)
            return Array.isArray(parsed) ? parsed : []
        } catch {
            return []
        }
    }
    return []
}

/**
 * Resolve the active pricing modes for a course, optionally overridden by a
 * selected cohort that doesn't reuse the course price (`use_course_price === false`).
 */
export function getAvailableModes(course: any, cohort?: any): PricingModes {
    const courseModes = parsePricingModes(course?.pricing_modes)
    const cohortModes = parsePricingModes(cohort?.pricing_modes)
    const useCoursePrice = !cohort || cohort.use_course_price !== false
    const src = useCoursePrice ? courseModes : cohortModes

    return {
        oneTime: !!(src.oneTime || src.one_time),
        installments: !!src.installments,
        subscription: !!src.subscription,
        registrationMonthly: !!(src.registration_monthly || src.registrationMonthly),
    }
}

export function getEnabledModeCount(modes: PricingModes): number {
    return (Object.values(modes) as boolean[]).filter(Boolean).length
}

/**
 * Pick the cohort whose pricing should drive the marketing display so it stays
 * aligned with what the checkout will actually offer. Only applies when there
 * is exactly one cohort overriding the course (use_course_price === false) —
 * otherwise the course-level config remains the source of truth.
 */
export function pickDisplayCohort<T extends { use_course_price?: boolean | null }>(
    cohorts: T[] | undefined | null
): T | undefined {
    if (!cohorts || cohorts.length !== 1) return undefined
    return cohorts[0].use_course_price === false ? cohorts[0] : undefined
}

export function getOnlyEnabledMode(modes: PricingModes): PricingModeKey | null {
    const entries = Object.entries(modes) as [PricingModeKey, boolean][]
    const enabled = entries.filter(([, v]) => v)
    return enabled.length === 1 ? enabled[0][0] : null
}

/**
 * Build a plan-details payload compatible with PaymentProcess.getInitialPaymentAmount.
 */
export function derivePlanDetails(mode: PricingModeKey, course: any, cohort?: any): any {
    const useCoursePrice = !cohort || cohort.use_course_price !== false
    const num = (v: any) => (v == null ? 0 : Number(v) || 0)

    const oneTimePrice = useCoursePrice
        ? num(course?.one_time_price ?? course?.price)
        : num(cohort?.one_time_price ?? course?.one_time_price ?? course?.price)
    const monthlyPrice = useCoursePrice
        ? num(course?.monthly_price)
        : num(cohort?.monthly_price ?? course?.monthly_price)
    const registrationFee = useCoursePrice
        ? num(course?.registration_fee)
        : num(cohort?.registration_fee ?? course?.registration_fee)
    const monthlyFee = useCoursePrice
        ? num(course?.monthly_fee)
        : num(cohort?.monthly_fee ?? course?.monthly_fee)
    const installments = parseInstallments(
        useCoursePrice ? course?.installments : cohort?.installments ?? course?.installments
    )

    switch (mode) {
        case "oneTime":
            return { price: oneTimePrice, originalPrice: oneTimePrice }
        case "installments":
            return {
                installments,
                totalAmount: installments.reduce(
                    (acc: number, item: any) => acc + num(item?.amount),
                    0
                ),
            }
        case "subscription":
            return { monthlyPrice }
        case "registrationMonthly":
            return { registrationFee, monthlyFee }
    }
}
