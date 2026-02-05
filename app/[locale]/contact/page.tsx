import { ContactHeroSection } from "@/components/sections/contact/hero-section"
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
        <>
            <ContactHeroSection />
            <section className="py-20 md:py-32">
                <Container>
                    <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
                        <ContactInfo />
                        <ContactForm />
                    </div>
                </Container>
            </section>
        </>
    )
}
