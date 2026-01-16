import { Star, Users, BookOpen, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TrainerHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-chart-2/10 to-accent/10 py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
          {/* Avatar */}
          <img
            src="/placeholder.svg?key=rvqxh"
            alt="Dr. Aminata Diallo"
            className="h-48 w-48 rounded-full border-4 border-background object-cover shadow-xl"
          />

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="mb-2 text-4xl font-bold md:text-5xl">Dr. Aminata Diallo</h1>
            <p className="mb-3 text-xl text-muted-foreground">
              Docteure en Intelligence Artificielle • Chercheuse & Formatrice
            </p>
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Dakar, Sénégal</span>
              </div>
            </div>

            {/* Stats */}
            <div className="mb-6 flex flex-wrap justify-center gap-6 md:justify-start">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-semibold">4.9</span>
                <span className="text-muted-foreground">(2,345 avis)</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="text-lg font-semibold">12,456</span>
                <span className="text-muted-foreground">étudiants</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <span className="text-lg font-semibold">18</span>
                <span className="text-muted-foreground">formations</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              <Button size="lg" className="bg-gradient-to-r from-primary to-chart-2 text-primary-foreground">
                Suivre
              </Button>
              <Button size="lg" variant="outline">
                Contacter
              </Button>
              <Button size="lg" variant="outline">
                Partager
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
