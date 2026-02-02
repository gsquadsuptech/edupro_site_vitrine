import { EnterprisesHeroSection } from "@/components/sections/enterprises/hero-section"
import { ChallengesSection } from "@/components/sections/enterprises/challenges-section"
import { SolutionSection } from "@/components/sections/enterprises/solution-section"
import { FeaturesSection } from "@/components/sections/enterprises/features-section"
import { CaseStudySection } from "@/components/sections/enterprises/case-study-section"
import { PricingSection } from "@/components/sections/enterprises/pricing-section"
import { PaymentSection } from "@/components/sections/enterprises/payment-section"
import { FAQSection } from "@/components/sections/enterprises/faq-section"
import { ExtendedFAQSection } from "@/components/sections/enterprises/extended-faq-section"
import { FinalCTASection } from "@/components/sections/enterprises/final-cta-section"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Pour les Entreprises - EduPro",
    description: "Transformez vos équipes avec EduPro : Onboarding, Upskilling, et mesure de l'impact en temps réel.",
}

export default function EntreprisePage() {
    return (
        <>
            <EnterprisesHeroSection />
            <ChallengesSection />
            <SolutionSection />
            <CaseStudySection />
            <FeaturesSection />
            stech
            <PricingSection />
            lalalalalalalalalalala
            <PaymentSection />
            <FAQSection />
            <ExtendedFAQSection />
            <FinalCTASection />
        </>
    )
}
