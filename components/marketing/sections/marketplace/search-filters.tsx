"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

export function SearchFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Read initial state from URL
  const initialMinPrice = Number(searchParams.get('minPrice')) || 0
  const initialMaxPrice = Number(searchParams.get('maxPrice')) || 100000

  const [priceRange, setPriceRange] = useState([initialMinPrice, initialMaxPrice])

  // Helper to update URL params
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === null || value === "") {
        params.delete(name)
      } else {
        params.set(name, value)
      }
      return params.toString()
    },
    [searchParams]
  )

  const updateFilter = (section: string, value: string, checked: boolean | number[]) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentValues = params.get(section)?.split(',') || []

    let newValues: string[] = []

    if (Array.isArray(checked)) {
      // Range slider case (removed generic handling for slider here for clarity, handled separately)
      return
    }

    if (checked) {
      if (!currentValues.includes(value)) {
        newValues = [...currentValues, value]
      } else {
        newValues = currentValues
      }
    } else {
      newValues = currentValues.filter(v => v !== value)
    }

    if (newValues.length > 0) {
      params.set(section, newValues.join(','))
    } else {
      params.delete(section)
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
  }

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('minPrice', priceRange[0].toString())
    params.set('maxPrice', priceRange[1].toString())
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const resetFilters = () => {
    setPriceRange([0, 100000])
    router.push(pathname, { scroll: false })
  }

  const isChecked = (section: string, value: string) => {
    const currentValues = searchParams.get(section)?.split(',') || []
    return currentValues.includes(value)
  }

  const categories = [
    { id: "tech-digital", label: "Tech & Digital", count: 120 }, // Updated IDs to match slugs
    { id: "business-management", label: "Business & Management", count: 85 },
    { id: "construction-durable", label: "Construction Durable", count: 45 },
    { id: "soft-skills", label: "Soft Skills", count: 90 },
    { id: "sante", label: "Santé", count: 30 },
    { id: "finance", label: "Finance", count: 55 },
  ]

  const levels = [
    { id: "Débutant", label: "Débutant" }, // Updated IDs to match likely DB values or mapped values
    { id: "Intermédiaire", label: "Intermédiaire" },
    { id: "Avancé", label: "Avancé" },
    { id: "Expert", label: "Expert" },
  ]

  const durations = [
    { id: "short", label: "< 5 heures" },
    { id: "medium", label: "5-20 heures" },
    { id: "long", label: "20-50 heures" },
    { id: "verylong", label: "> 50 heures" },
  ]

  const languages = [
    { id: "fr", label: "Français" },
    { id: "en", label: "Anglais" },
    { id: "ar", label: "Arabe" },
    { id: "other", label: "Autres" },
  ]

  const countries = [
    { id: "sn", label: "Sénégal" },
    { id: "ci", label: "Côte d'Ivoire" },
    { id: "rw", label: "Rwanda" },
    { id: "all", label: "Tous pays" },
  ]

  return (
    <aside className="hidden w-full lg:block lg:w-64">
      <div className="sticky top-24 rounded-lg border border-border bg-card p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Filtres</h3>
          <Button onClick={resetFilters} variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary hover:bg-transparent">
            Réinitialiser
          </Button>
        </div>

        <Accordion type="multiple" defaultValue={["prix", "categorie", "niveau"]} className="w-full">
          {/* Prix */}
          <AccordionItem value="prix">
            <AccordionTrigger className="text-sm font-medium">Prix</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <Slider value={priceRange} onValueChange={handlePriceChange} max={100000} step={1000} className="w-full" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{priceRange[0].toLocaleString()} FCFA</span>
                  <span>{priceRange[1].toLocaleString()} FCFA</span>
                </div>
                <Button onClick={applyPriceFilter} size="sm" className="w-full">
                  Appliquer
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Catégorie */}
          <AccordionItem value="category"> {/* Changed value to match logic if needed, or keep section name consistent */}
            <AccordionTrigger className="text-sm font-medium">Catégorie</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={isChecked('subcategory', category.id) || isChecked('category', category.id)} // Check both params as fallback
                      onCheckedChange={(checked) => updateFilter('subcategory', category.id, checked === true)}
                    />
                    <Label
                      htmlFor={category.id}
                      className="flex flex-1 cursor-pointer items-center justify-between text-sm font-normal"
                    >
                      <span>{category.label}</span>
                      <span className="text-xs text-muted-foreground">({category.count})</span>
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Niveau */}
          <AccordionItem value="niveau">
            <AccordionTrigger className="text-sm font-medium">Niveau</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {levels.map((level) => (
                  <div key={level.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={level.id}
                      checked={isChecked('level', level.id)}
                      onCheckedChange={(checked) => updateFilter('level', level.id, checked === true)}
                    />
                    <Label htmlFor={level.id} className="cursor-pointer text-sm font-normal">
                      {level.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Durée */}
          <AccordionItem value="duree">
            <AccordionTrigger className="text-sm font-medium">Durée</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {durations.map((duration) => (
                  <div key={duration.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={duration.id}
                      checked={isChecked('duration', duration.id)}
                      onCheckedChange={(checked) => updateFilter('duration', duration.id, checked === true)}
                    />
                    <Label htmlFor={duration.id} className="cursor-pointer text-sm font-normal">
                      {duration.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Langue */}
          <AccordionItem value="langue">
            <AccordionTrigger className="text-sm font-medium">Langue</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {languages.map((language) => (
                  <div key={language.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={language.id}
                      checked={isChecked('language', language.id)}
                      onCheckedChange={(checked) => updateFilter('language', language.id, checked === true)}
                    />
                    <Label htmlFor={language.id} className="cursor-pointer text-sm font-normal">
                      {language.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Pays Formateur */}
          <AccordionItem value="pays">
            <AccordionTrigger className="text-sm font-medium">Pays Formateur</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {countries.map((country) => (
                  <div key={country.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={country.id}
                      checked={isChecked('country', country.id)}
                      onCheckedChange={(checked) => updateFilter('country', country.id, checked === true)}
                    />
                    <Label htmlFor={country.id} className="cursor-pointer text-sm font-normal">
                      {country.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </aside>
  )
}
