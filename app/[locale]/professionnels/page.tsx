import { ProfessionalsHeroSection } from "@/components/sections/professionals/hero-section"
import { WhyEduProSection } from "@/components/sections/professionals/why-edupro-section"
import { SkillPacksSection } from "@/components/sections/professionals/skill-packs-section"
import { HowItWorksSection } from "@/components/sections/professionals/how-it-works-section"
import { CertificationsSection } from "@/components/sections/professionals/certifications-section"
import { ProfessionalsTestimonialsSection } from "@/components/sections/professionals/testimonials-section"
import { FAQSection } from "@/components/sections/professionals/faq-section"
import { ProfessionalsCTASection } from "@/components/sections/professionals/cta-section"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Pour les Professionnels - EduPro",
    description: "Transformez vos ambitions en succès concrets avec nos formations certifiantes 100% en ligne.",
}

export default function ProfessionnelsPage() {
    return (
        <>
            <ProfessionalsHeroSection />
            <WhyEduProSection />
            <SkillPacksSection />
            <HowItWorksSection />
            <CertificationsSection />
            <ProfessionalsTestimonialsSection />
            <FAQSection />
            <ProfessionalsCTASection />
        </>
    )
}
