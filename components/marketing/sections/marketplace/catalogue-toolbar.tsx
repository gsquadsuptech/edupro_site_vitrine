"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const SORT_OPTIONS = [
  { value: "recent", label: "Plus récentes" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
  { value: "rating", label: "Mieux notées" },
  { value: "popular", label: "Plus populaires" },
]

export function CatalogueToolbar({ total }: { total: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get("sort") || "recent"

  const onSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("sort", value)
    params.delete("page") // tout nouveau tri repart en page 1
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{total}</span>{" "}
        formation{total > 1 ? "s" : ""} trouvée{total > 1 ? "s" : ""}
      </p>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Trier par :</span>
        <Select value={currentSort} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
