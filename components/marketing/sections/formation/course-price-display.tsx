"use client"

import { Course } from "@/lib/supabase/types"
import { getAvailableModes, parseInstallments, type PricingModeKey } from "@/lib/pricing"
import { cn } from "@/lib/utils"

interface CoursePriceDisplayProps {
    course: Course
    variant?: "sidebar" | "compact"
    className?: string
}

const formatFCFA = (amount: number) =>
    new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XOF",
        maximumFractionDigits: 0,
    })
        .format(Math.round(amount))
        .replace("XOF", "FCFA")

const modePriority: PricingModeKey[] = [
    "oneTime",
    "installments",
    "registrationMonthly",
    "subscription",
]

export function CoursePriceDisplay({ course, variant = "sidebar", className }: CoursePriceDisplayProps) {
    const modes = getAvailableModes(course)
    const activeModes = modePriority.filter((m) => modes[m])
    const primary: PricingModeKey = activeModes[0] ?? "oneTime"

    const num = (v: any) => (v == null ? 0 : Number(v) || 0)
    const oneTimePrice = num((course as any).one_time_price ?? course.price)
    const monthlyPrice = num((course as any).monthly_price)
    const registrationFee = num((course as any).registration_fee)
    const monthlyFee = num((course as any).monthly_fee)
    const installmentsList = parseInstallments((course as any).installments)
    const installmentsTotal = installmentsList.reduce(
        (acc: number, item: any) => acc + num(item?.amount),
        0
    )
    const installmentCount = installmentsList.length

    const hasVaryingPrices = (course as any).has_varying_prices || false
    const isFree = course.access_type === "free" || oneTimePrice <= 0

    const bigSize = variant === "sidebar" ? "text-4xl" : "text-2xl"
    const subSize = variant === "sidebar" ? "text-sm" : "text-xs"

    if (isFree && primary === "oneTime") {
        return (
            <div className={cn("flex flex-col", className)}>
                <span className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Investissement</span>
                <span className={cn("font-extrabold text-foreground", bigSize)}>Gratuit</span>
            </div>
        )
    }

    // Render label + main amount + optional sub line
    let label = "Investissement"
    let mainNode: React.ReactNode = null
    let subNode: React.ReactNode = null

    switch (primary) {
        case "oneTime":
            label = hasVaryingPrices ? "À partir de" : "Investissement"
            mainNode = (
                <span className={cn("font-extrabold text-foreground", bigSize)}>{formatFCFA(oneTimePrice)}</span>
            )
            break
        case "subscription":
            label = "Abonnement mensuel"
            mainNode = (
                <span className={cn("font-extrabold text-foreground", bigSize)}>
                    {formatFCFA(monthlyPrice)}
                    <span className={cn("font-semibold text-muted-foreground", subSize)}> /mois</span>
                </span>
            )
            break
        case "installments":
            label = installmentCount > 0 ? `Paiement en ${installmentCount} fois` : "Paiement échelonné"
            mainNode = (
                <span className={cn("font-extrabold text-foreground", bigSize)}>{formatFCFA(installmentsTotal)}</span>
            )
            if (installmentsList[0]?.amount) {
                subNode = (
                    <div className={cn("mt-1 font-medium text-muted-foreground", subSize)}>
                        dès <span className="text-foreground">{formatFCFA(num(installmentsList[0].amount))}</span> à la
                        1<sup>re</sup> échéance
                    </div>
                )
            }
            break
        case "registrationMonthly":
            label = "Inscription + mensualités"
            mainNode = (
                <span className={cn("font-extrabold text-foreground", bigSize)}>
                    {formatFCFA(registrationFee)}
                    <span className={cn("font-semibold text-muted-foreground", subSize)}> d'inscription</span>
                </span>
            )
            subNode = (
                <div className={cn("mt-1 font-medium text-muted-foreground", subSize)}>
                    puis <span className="text-foreground">{formatFCFA(monthlyFee)}</span>/mois
                </div>
            )
            break
    }

    return (
        <div className={cn("flex flex-col", className)}>
            <span className="mb-1 text-xs font-bold text-primary uppercase tracking-widest">{label}</span>
            <div className="flex items-baseline gap-2">{mainNode}</div>
            {subNode}
        </div>
    )
}
