import { Button } from "@/components/ui/button"
import Link from "next/link"

interface SubCategory {
  name: string
  slug: string
}

interface SubCategoriesProps {
  subCategories?: SubCategory[]
  parentSlug?: string
  currentSubCategory?: string
}

export function SubCategories({ subCategories = [], parentSlug, currentSubCategory }: SubCategoriesProps) {
  if (!subCategories || subCategories.length === 0) return null

  return (
    <section className="border-b border-border bg-background py-4">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Link href={`/${parentSlug ? `fr/catalogue/${parentSlug}` : '#'}`}>
            <Button
              variant={!currentSubCategory ? "default" : "outline"}
              size="sm"
              className={!currentSubCategory ? "bg-gradient-to-r from-primary to-chart-2 text-primary-foreground" : ""}
            >
              Toutes
            </Button>
          </Link>

          {subCategories.map((category, index) => (
            <Link key={category.slug} href={`/${parentSlug ? `fr/catalogue/${parentSlug}` : '#'}?subcategory=${category.slug}`}>
              <Button
                variant={currentSubCategory === category.slug ? "default" : "outline"}
                size="sm"
                className={currentSubCategory === category.slug ? "bg-gradient-to-r from-primary to-chart-2 text-primary-foreground" : ""}
              >
                {category.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
