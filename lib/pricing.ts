export type PricingModes = {
    oneTime: boolean
    installments: boolean
    subscription: boolean
    registrationMonthly: boolean
}

export type PricingModeKey = keyof PricingModes

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
