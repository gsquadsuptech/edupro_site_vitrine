import { ContactForm } from "@/components/sections/contact/contact-form"
import { ContactInfo } from "@/components/sections/contact/contact-info"
import type { Metadata } from "next"
import { Container } from "@/components/marketing/layout/container"

export const metadata: Metadata = {
    title: "Contact | Edupro",
    description: "Contactez l'équipe Edupro pour vos besoins en formation professionnelle.",
}

export default function ContactPage() {
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

                <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
                    <ContactInfo />
                    <ContactForm />
                </div>
            </Container>
        </section>
    )
}
