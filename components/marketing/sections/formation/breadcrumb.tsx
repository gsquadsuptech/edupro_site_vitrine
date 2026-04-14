import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface FormationBreadcrumbProps {
  category?: {
    name: string
    slug: string
  } | null
  courseTitle: string
}

export function FormationBreadcrumb({ category, courseTitle }: FormationBreadcrumbProps) {
  return (
    <div className="border-b border-border bg-muted/30 py-3">
      <div className="container">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-foreground transition-colors">
            Accueil
          </Link>
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
          <Link href="/catalogue/all" className="hover:text-foreground transition-colors">
            Catalogue
          </Link>
          {category && (
            <>
              <ChevronRight className="h-4 w-4 flex-shrink-0" />
              <Link
                href={`/catalogue/all?category=${category.slug}`}
                className="hover:text-foreground transition-colors"
              >
                {category.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
          <span className="text-foreground font-medium truncate max-w-[200px] md:max-w-md">
            {courseTitle}
          </span>
        </nav>
      </div>
    </div>
  )
}
