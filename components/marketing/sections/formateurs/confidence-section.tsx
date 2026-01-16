import { Container } from "@/components/marketing/layout/container"

export function FormateursConfidenceSection() {
  return (
    <section className="py-12 md:py-16 border-t border-border">
      <Container>
        <div className="text-center">
          <p className="mb-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Ils nous font confiance
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">150+</p>
              <p className="text-xs text-muted-foreground">Formateurs actifs</p>
            </div>
            <div className="h-12 w-px bg-border"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">10K+</p>
              <p className="text-xs text-muted-foreground">Apprenants formés</p>
            </div>
            <div className="h-12 w-px bg-border"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">3</p>
              <p className="text-xs text-muted-foreground">Pays couverts</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
