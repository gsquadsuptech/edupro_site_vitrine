import { DemoHeroSection } from "@/components/sections/demo/hero-section"
import { DemoForm } from "@/components/sections/demo/demo-form"
import type { Metadata } from "next"
import { Container } from "@/components/marketing/layout/container"

export const metadata: Metadata = {
    title: "Demander une Démo | Edupro",
    description: "Découvrez EduPro lors d'une démo personnalisée de 30 minutes.",
}

export default function DemoPage() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 md:py-32">
            <Container>
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-24 items-center">
                    <DemoHeroSection />
                    <DemoForm />
                </div>
            </Container>
        </section>
    )
}
