"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Sparkles, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { PublicAddon, PublicPlan } from "@/services/plans-service"

/**
 * Grille de prix.
 *
 * Composant client car la bascule mensuel/annuel doit reellement changer les
 * montants affiches : un toggle qui ne modifie rien est pire que pas de toggle.
 * Les donnees restent celles du SaaS, ce composant ne calcule aucun prix.
 */

/** Au-dela, la carte devient illisible : le reste passe derriere un bouton. */
const VISIBLE_FEATURES = 7

/**
 * Affichage des prix desactive tant que la tarification n'est pas finalisee :
 * on montre les offres (limites, fonctionnalites, CTA) sans les montants, la
 * bascule mensuel/annuel ni les prix d'extensions. Repasser a true pour tout
 * reafficher — aucune autre modification requise.
 */
const SHOW_PRICES = false

interface PricingGridProps {
    plans: PublicPlan[]
    addons?: PublicAddon[]
    locale: string
    /** Masque la bascule pour les offres sans tarif recurrent. */
    showBillingToggle?: boolean
}

export function PricingGrid({
    plans,
    addons = [],
    locale,
    showBillingToggle = true,
}: PricingGridProps) {
    const [annual, setAnnual] = useState(false)

    // La bascule n'a de sens que si au moins une offre a un tarif annuel distinct.
    const hasAnnualOffer = plans.some((p) => p.annualDiscount != null)

    const gridCols =
        plans.length >= 4
            ? "md:grid-cols-2 xl:grid-cols-4"
            : plans.length === 3
              ? "md:grid-cols-3"
              : plans.length === 2
                ? "md:grid-cols-2"
                : "md:max-w-md md:mx-auto"

    return (
        <>
            {SHOW_PRICES && showBillingToggle && hasAnnualOffer && (
                <div className="mb-10 flex items-center justify-center gap-3">
                    <Label
                        htmlFor="billing-cycle"
                        className={cn("text-sm", !annual && "font-semibold")}
                    >
                        Mensuel
                    </Label>
                    <Switch id="billing-cycle" checked={annual} onCheckedChange={setAnnual} />
                    <Label
                        htmlFor="billing-cycle"
                        className={cn("text-sm", annual && "font-semibold")}
                    >
                        Annuel
                    </Label>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        jusqu&apos;a 2 mois offerts
                    </span>
                </div>
            )}

            <div className={cn("grid gap-8", gridCols)}>
                {plans.map((plan) => (
                    <PlanCard
                        key={plan.fullName}
                        plan={plan}
                        locale={locale}
                        annual={annual}
                    />
                ))}
            </div>

            {addons.length > 0 && (
                <div className="mt-16">
                    <h3 className="mb-2 text-xl font-bold">Extensions disponibles</h3>
                    <p className="mb-6 text-sm text-muted-foreground">
                        Ajoutez uniquement ce dont vous avez besoin, quand vous en avez besoin.
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {addons.map((addon) => (
                            <div key={addon.name} className="rounded-xl border bg-card p-4">
                                <p className="font-semibold">{addon.name}</p>
                                {addon.description && (
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {addon.description}
                                    </p>
                                )}
                                {SHOW_PRICES && (
                                    <p className="mt-3 text-sm font-medium">
                                        {addon.price}{" "}
                                        <span className="font-normal text-muted-foreground">
                                            {addon.periodLabel}
                                        </span>
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

function PlanCard({
    plan,
    locale,
    annual,
}: {
    plan: PublicPlan
    locale: string
    annual: boolean
}) {
    const [expanded, setExpanded] = useState(false)

    const price = annual ? plan.price?.yearly : plan.price?.monthly
    const features = plan.features ?? []
    const hidden = Math.max(0, features.length - VISIBLE_FEATURES)
    const shown = expanded ? features : features.slice(0, VISIBLE_FEATURES)

    return (
        <div
            className={cn(
                "relative flex flex-col rounded-2xl border p-6 sm:p-8",
                plan.highlighted ? "border-primary bg-primary/5" : "border-border bg-card"
            )}
        >
            {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Le plus choisi
                </span>
            )}

            <h3 className="mb-1 text-xl font-bold">{plan.name}</h3>
            {plan.tagline && (
                <p className="mb-1 text-sm text-muted-foreground">{plan.tagline}</p>
            )}
            {plan.audience && (
                <p className="mb-4 text-xs text-muted-foreground">{plan.audience}</p>
            )}

            {/* Prix — masques tant que la tarification n'est pas finalisee (SHOW_PRICES). */}
            {SHOW_PRICES && price && (
                <div className="mb-6">
                    <p className="text-3xl font-bold leading-tight">
                        <span className="break-words">{price.amount}</span>
                        <span className="text-base font-normal text-muted-foreground">
                            {price.unit}
                        </span>
                    </p>
                    {price.note && (
                        <p className="mt-1 text-sm text-muted-foreground">{price.note}</p>
                    )}
                    {annual && plan.annualDiscount && (
                        <p className="mt-1 text-sm font-medium text-primary">
                            {plan.annualDiscount.monthsFree
                                ? `${plan.annualDiscount.monthsFree} mois offerts`
                                : `Economisez ${plan.annualDiscount.percent}%`}
                            {plan.annualDiscount.savings != null && (
                                <span className="font-normal text-muted-foreground">
                                    {" "}
                                    ({plan.annualDiscount.savings.toLocaleString("fr-FR")} FCFA)
                                </span>
                            )}
                        </p>
                    )}
                </div>
            )}

            {/* Limites.
                « Utilisateurs » est le total des comptes de l'organisation ;
                les administrateurs en font partie. Les presenter comme deux
                lignes de meme niveau laisserait croire a deux quotas qui
                s'additionnent. Une absence de plafond se lit « Illimite »,
                jamais « Non defini ». */}
            {plan.limits && (
                <ul className="mb-6 space-y-1 border-y py-4 text-sm">
                    <LimitLine label="Utilisateurs" value={plan.limits.utilisateurs} />
                    <LimitLine
                        label="dont administrateurs"
                        value={plan.limits.administrateurs}
                        nested
                    />
                    <LimitLine label="Cours creables" value={plan.limits.cours} />
                </ul>
            )}

            {/* Fonctionnalites : les principales, le reste sur demande */}
            <ul className="mb-4 flex-1 space-y-2">
                {shown.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                    </li>
                ))}
                {expanded &&
                    plan.claims.map((claim) => (
                        <li key={claim} className="flex items-start gap-2 text-sm">
                            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="text-muted-foreground">{claim}</span>
                        </li>
                    ))}
            </ul>

            {hidden > 0 && !expanded && (
                <button
                    type="button"
                    onClick={() => setExpanded(true)}
                    className="mb-6 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                    + {hidden} fonctionnalite{hidden > 1 ? "s" : ""}
                    <ChevronDown className="h-4 w-4" />
                </button>
            )}
            {expanded && <div className="mb-6" />}

            <Button
                asChild
                className="w-full"
                variant={plan.highlighted ? "default" : "outline"}
            >
                <Link href={ctaHref(plan, locale)}>{ctaLabel(plan)}</Link>
            </Button>
        </div>
    )
}

/**
 * Destination du bouton, pilotee par le type de CTA defini en back-office.
 * Un partenariat n'envoie pas vers une demo, une certification non plus.
 */
function ctaHref(plan: PublicPlan, locale: string): string {
    switch (plan.ctaType) {
        case "signup":
            return `/${locale}/inscription`
        case "contact":
            return `/${locale}/contact`
        case "bootcamp":
            return `/${locale}/contact?sujet=certification`
        case "demo":
            return `/${locale}/demande-demo`
        default:
            return plan.free ? `/${locale}/inscription` : `/${locale}/demande-demo`
    }
}

function ctaLabel(plan: PublicPlan): string {
    if (plan.cta) return plan.cta
    if (plan.free) return "Commencer gratuitement"
    if (plan.family === "partnership") return "Contacter notre equipe"
    if (plan.family === "certification") return "S'inscrire au programme"
    if (plan.fromPrice) return "Demander un devis"
    return "Demander une demo"
}

function LimitLine({
    label,
    value,
    nested = false,
}: {
    label: string
    value: string
    nested?: boolean
}) {
    return (
        <li className="flex items-baseline justify-between gap-2">
            <span className={cn("text-muted-foreground", nested && "pl-3 text-xs")}>
                {label}
            </span>
            <span className={cn("font-medium", nested && "text-xs")}>{value}</span>
        </li>
    )
}
