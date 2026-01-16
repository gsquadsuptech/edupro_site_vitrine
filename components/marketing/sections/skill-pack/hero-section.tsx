import { CheckCircle2, Clock, BookOpen, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function SkillPackHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-chart-2/10 to-accent/10 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-accent text-accent-foreground">Parcours Complet</Badge>
          <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">Skill Pack : Tech & Digital</h1>
          <p className="mb-8 text-xl text-muted-foreground">
            Maîtrisez les compétences digitales les plus demandées sur le marché africain
          </p>

          {/* Key Features */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card p-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-semibold">15 formations</div>
                <div className="text-xs text-muted-foreground">incluses</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card p-4">
              <Clock className="h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-semibold">80h de contenu</div>
                <div className="text-xs text-muted-foreground">vidéo</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card p-4">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-semibold">3 projets</div>
                <div className="text-xs text-muted-foreground">pratiques</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card p-4">
              <Award className="h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-semibold">Certificat</div>
                <div className="text-xs text-muted-foreground">de compétences</div>
              </div>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="mb-6 flex flex-col items-center justify-center gap-2">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold">49 000 FCFA</span>
              <span className="text-xl text-muted-foreground line-through">75 000 FCFA</span>
            </div>
            <Badge variant="secondary" className="text-sm">
              Économisez 35% avec ce pack
            </Badge>
          </div>

          <Button size="lg" className="bg-gradient-to-r from-primary to-chart-2 text-lg text-primary-foreground">
            S'inscrire au Skill Pack
          </Button>
        </div>
      </div>
    </section>
  )
}
