import { Search, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function MarketplaceHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-chart-2/10 to-accent/10 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-balance text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            Développez vos compétences avec les meilleurs formateurs d'Afrique
          </h1>
          <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
            Accédez à plus de 500 formations certifiantes dans les domaines les plus demandés du marché africain
          </p>

          {/* Search Bar */}
          <div className="relative mx-auto mb-8 max-w-3xl">
            <div className="relative flex items-center gap-2 rounded-xl border-2 border-border bg-background p-2 shadow-lg transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              <Search className="ml-2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cherchez une formation, une compétence, un domaine..."
                className="flex-1 border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button size="icon" variant="ghost" className="h-10 w-10">
                <Mic className="h-5 w-5" />
              </Button>
              <Button className="bg-gradient-to-r from-primary to-chart-2 px-6 text-primary-foreground hover:opacity-90">
                Rechercher
              </Button>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-muted-foreground">Recherches populaires:</span>
            <Button variant="outline" size="sm" className="rounded-full bg-transparent">
              Intelligence Artificielle
            </Button>
            <Button variant="outline" size="sm" className="rounded-full bg-transparent">
              Data Science
            </Button>
            <Button variant="outline" size="sm" className="rounded-full bg-transparent">
              Leadership
            </Button>
            <Button variant="outline" size="sm" className="rounded-full bg-transparent">
              Marketing Digital
            </Button>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute right-0 top-0 -z-10 h-full w-1/2 opacity-20">
        <img src="/african-professionals-learning-online-with-laptops.jpg" alt="" className="h-full w-full object-cover" />
      </div>
    </section>
  )
}
