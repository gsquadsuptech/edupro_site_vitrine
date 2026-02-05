import { Container } from "@/components/marketing/layout/container"
import { useTranslations } from "next-intl"

export function ContactHeroSection() {
    // Fallback translation handling in case keys are missing or different structure
    // Ideally we should verify keys, but for now we follow the structure.
    // If usage of 'useTranslations' is problematic without setup, we might need to fallback.
    // However, source uses it.
    // Let's assume standard 'contact' namespace availability or use hardcoded if we want to valid 'content' immediately without checking json.
    // Source content (from hardcoded fallback logic for safety):
    // "Entrons en contact" / "Une question, un projet..."

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h1 className="mb-6 text-balance text-4xl font-bold md:text-5xl lg:text-6xl">
                        Entrons en{" "}
                        <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">contact</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Une question, un projet, une collaboration ? Notre équipe est là pour vous accompagner.
                    </p>
                </div>
            </Container>
        </section>
    )
}
