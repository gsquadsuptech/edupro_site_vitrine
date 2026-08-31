import { EnterprisesHeroSection } from "@/components/sections/enterprises/hero-section"
import { ChallengesSection } from "@/components/sections/enterprises/challenges-section"
import { SolutionSection } from "@/components/sections/enterprises/solution-section"
import { FeaturesSection } from "@/components/sections/enterprises/features-section"
import { CaseStudySection } from "@/components/sections/enterprises/case-study-section"
import { PricingSection } from "@/components/sections/enterprises/pricing-section"
import { LivePricingPlans } from "@/components/marketing/pricing/live-pricing-plans"
import { PaymentSection } from "@/components/sections/enterprises/payment-section"
import { FAQSection } from "@/components/sections/enterprises/faq-section"
import { ExtendedFAQSection } from "@/components/sections/enterprises/extended-faq-section"
import { FinalCTASection } from "@/components/sections/enterprises/final-cta-section"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Pour les Entreprises - EduPro",
    description: "Transformez vos équipes avec EduPro : Onboarding, Upskilling, et mesure de l'impact en temps réel.",
}

export default async function EntreprisePage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params

    return (
        <>
            <EnterprisesHeroSection />
            <ChallengesSection />
            <SolutionSection />
            <CaseStudySection />
            <FeaturesSection />
            {/* Plans lus depuis le SaaS : l'heritage est deja resolu, donc
                plus de « Tout BUSINESS Essentials + ». La section statique
                sert de secours si l'API ne repond pas. */}
            <LivePricingPlans
                category="business"
                locale={locale}
                fallback={<PricingSection />}
            />
            <PaymentSection />
            <FAQSection />
            <ExtendedFAQSection />
            <FinalCTASection />
        </>
    )
}
