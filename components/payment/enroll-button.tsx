"use client"

import { useState, ReactElement, cloneElement, MouseEvent } from "react"
import { useRouter } from "next/navigation"
import { useActiveBusinessOrg } from "@/hooks/use-active-business-org"
import { PurchaseModeDialog } from "./purchase-mode-dialog"

type EnrollTarget =
  | { kind: "course"; id: string; slug?: string }
  | { kind: "learning_path"; id: string; slug?: string }

interface EnrollButtonProps {
  target: EnrollTarget
  locale: string
  /** Query params supplémentaires à propager (ex: `cohort=…`). */
  extraQuery?: Record<string, string | undefined>
  /** Doit être un seul élément cliquable (Button, a, button…) qui sera cloné avec un onClick. */
  children: ReactElement<{ onClick?: (e: MouseEvent) => void }>
}

/**
 * Wrapper qui intercepte le clic sur l'enfant pour :
 * - ouvrir la modale « Pour qui voulez-vous acheter ? » si l'user est admin Business
 * - sinon rediriger directement vers le checkout individuel
 */
export function EnrollButton({ target, locale, extraQuery, children }: EnrollButtonProps) {
  const router = useRouter()
  const { isBusinessAdmin } = useActiveBusinessOrg()
  const [dialogOpen, setDialogOpen] = useState(false)

  const buildPath = (purchaseMode?: 'team') => {
    const base =
      target.kind === "learning_path"
        ? `/${locale}/checkout/learning-path/${target.id}`
        : `/${locale}/checkout/${target.id}`
    const params = new URLSearchParams()
    if (extraQuery) {
      Object.entries(extraQuery).forEach(([k, v]) => { if (v) params.set(k, v) })
    }
    if (purchaseMode === 'team') params.set('purchaseMode', 'team')
    const qs = params.toString()
    return qs ? `${base}?${qs}` : base
  }

  const handleClick = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isBusinessAdmin) {
      setDialogOpen(true)
    } else {
      router.push(buildPath())
    }
  }

  const cloned = cloneElement(children, { onClick: handleClick })

  return (
    <>
      {cloned}
      {isBusinessAdmin && (
        <PurchaseModeDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          target={target}
          locale={locale}
          extraQuery={extraQuery}
        />
      )}
    </>
  )
}
