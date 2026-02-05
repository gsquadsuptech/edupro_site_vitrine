import { SupportHeroSection } from "@/components/sections/support/hero-section"
import { SupportFAQSection } from "@/components/sections/support/faq-section"
import { SupportContactSection } from "@/components/sections/support/contact-section"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Centre d'Aide & Support | Edupro",
    description:
        "Besoin d'aide ? Consultez notre FAQ ou contactez notre équipe support. Nous sommes là pour répondre à toutes vos questions.",
}

export default function SupportPage() {
    return (
        <>
            <SupportHeroSection />
            <SupportFAQSection />
            <SupportContactSection />
        </>
    )
}
