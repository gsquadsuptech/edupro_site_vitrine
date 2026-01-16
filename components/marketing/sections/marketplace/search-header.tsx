"use client"

import { Search, X, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SearchHeader() {
  const activeFilters = [
    { label: "intelligence artificielle", type: "search" },
    { label: "Niveau: Intermédiaire", type: "filter" },
  ]

  return (
    <div className="border-b border-border bg-background py-6">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="relative mb-4 flex items-center gap-2 rounded-lg border border-border bg-background p-2">
          <Search className="ml-2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher une formation..."
            defaultValue="intelligence artificielle"
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button size="icon" variant="ghost">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {activeFilters.map((filter, index) => (
              <Badge key={index} variant="secondary" className="gap-2">
                {filter.label}
                <button className="hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Results Count & Sort */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">48 formations</span> trouvées
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="lg:hidden bg-transparent">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filtres
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Trier par:</span>
              <Select defaultValue="pertinence">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pertinence">Pertinence</SelectItem>
                  <SelectItem value="prix-asc">Prix croissant</SelectItem>
                  <SelectItem value="prix-desc">Prix décroissant</SelectItem>
                  <SelectItem value="rating">Mieux notées</SelectItem>
                  <SelectItem value="recent">Plus récentes</SelectItem>
                  <SelectItem value="popular">Plus populaires</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
