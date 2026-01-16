import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function FormationBreadcrumb() {
  return (
    <div className="border-b border-border bg-muted/30 py-3">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Accueil
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/catalogue" className="hover:text-foreground">
            Catalogue
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/catalogue/tech-digital" className="hover:text-foreground">
            Tech & Digital
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Intelligence Artificielle Pratique</span>
        </nav>
      </div>
    </div>
  )
}
