import { FormateursHeroSection } from "@/components/sections/formateurs/hero-section"
import { FormateursProblemsSection } from "@/components/sections/formateurs/problems-section"
import { FormateursSolutionSection } from "@/components/sections/formateurs/solution-section"
import { FormateursWhySection } from "@/components/sections/formateurs/why-section"
import { FormateursFeaturesSection } from "@/components/sections/formateurs/features-section"
import { FormateursTestimonialsSection } from "@/components/sections/formateurs/testimonials-section"
import { FormateursProcessSection } from "@/components/sections/formateurs/process-section"
import { FormateursPricingSection } from "@/components/sections/formateurs/pricing-section"
import { LivePricingPlans } from "@/components/marketing/pricing/live-pricing-plans"
import { FormateursResourcesSection } from "@/components/sections/formateurs/resources-section"
import { FormateursFAQSection } from "@/components/sections/formateurs/faq-section"
import { FormateursFinalCTASection } from "@/components/sections/formateurs/final-cta-section"
import { FormateursConfidenceSection } from "@/components/sections/formateurs/confidence-section"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Formateurs & Instituts | Digitalisez votre Expertise - EduPro",
    description:
        "Rejoignez 150+ formateurs sur EduPro. Créez vos formations 40% plus vite avec l'IA, touchez une audience panafricaine. Commission jusqu'à 70%. 🇸🇳 🇨🇮 🇷🇼",
}

export default async function FormateursPage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params

    return (
        <>
            <FormateursHeroSection />
            <FormateursProblemsSection />
            <FormateursSolutionSection />
            <FormateursWhySection />
            <FormateursFeaturesSection />
            <FormateursTestimonialsSection />
            <FormateursProcessSection />
            {/* Idem entreprises : offres lues depuis le SaaS, section
                statique conservee en secours. */}
            <LivePricingPlans
                category="teach"
                locale={locale}
                fallback={<FormateursPricingSection />}
            />
            <FormateursResourcesSection />
            <FormateursFAQSection />
            <FormateursFinalCTASection />
            {/* <FormateursConfidenceSection /> */}
        </>
    )
}
