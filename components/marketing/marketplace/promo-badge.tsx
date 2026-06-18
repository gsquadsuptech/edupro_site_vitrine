import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PromoBadgeProps {
  /** Pourcentage de réduction arrondi (`percentageOff` de l'API). */
  percentageOff?: number | null
  /** Nom de la promo (`promo.name`). Repli sur « Promotion » si absent. */
  name?: string | null
  /** `sm` pour les cartes catalogue, `md` pour les pages détail / checkout. */
  size?: "sm" | "md"
  className?: string
}

/**
 * Badges de promotion publique : `-XX%` (plein) + libellé de l'offre (contour).
 * Composant présentiel pur, réutilisable côté serveur comme client.
 */
export function PromoBadge({ percentageOff, name, size = "sm", className }: PromoBadgeProps) {
  const pct = Math.round(Number(percentageOff) || 0)
  const label = (name || "").trim() || "Promotion"
  const text = size === "sm" ? "text-[10px]" : "text-xs"

  return (
    <span className={cn("inline-flex flex-wrap items-center gap-1.5", className)}>
      {pct > 0 && (
        <Badge className={cn("border-transparent bg-rose-600 text-white hover:bg-rose-600", text)}>
          -{pct}%
        </Badge>
      )}
      <Badge
        variant="outline"
        className={cn("border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-50", text)}
      >
        {label}
      </Badge>
    </span>
  )
}
