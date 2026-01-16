import { Container } from "@/components/marketing/layout/container"
import { HelpCircle } from "lucide-react"

export function SupportHeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background to-primary/5 py-20 lg:py-32">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-primary/20 blur-3xl" />
        <div
          className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-chart-2/20 blur-3xl"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-balance text-4xl font-bold leading-tight text-foreground lg:text-5xl xl:text-6xl">
            Centre d'Aide
          </h1>
          <p className="mt-6 text-pretty text-xl leading-relaxed text-muted-foreground">
            Trouvez rapidement des réponses à vos questions ou contactez notre équipe d'assistance
          </p>
        </div>
      </Container>
    </section>
  )
}

