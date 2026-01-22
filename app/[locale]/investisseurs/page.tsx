import { InvestorsHeroSection } from "@/components/sections/investors/hero-section"
import { OpportunitySection } from "@/components/sections/investors/opportunity-section"
import { WhyEduProSection } from "@/components/sections/investors/why-edupro-section"
import { SeedRoundSection } from "@/components/sections/investors/seed-round-section"
import { TeamSection } from "@/components/sections/investors/team-section"
import { TimingSection } from "@/components/sections/investors/timing-section"
import { VisionSection } from "@/components/sections/investors/vision-section"
import { InvestorFormSection } from "@/components/sections/investors/investor-form-section"
import { InvestorFAQSection } from "@/components/sections/investors/investor-faq-section"
import { InvestorCTASection } from "@/components/sections/investors/investor-cta-section"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Investisseurs | EduPro - SaaS de Formation Panafricain",
    description:
        "Découvrez EduPro, la plateforme qui révolutionne la formation professionnelle en Afrique. Levée de fonds SEED en cours.",
}

export default function InvestorsPage() {
    return (
        <>
            <InvestorsHeroSection />
            <OpportunitySection />
            <WhyEduProSection />
            <SeedRoundSection />
            <TeamSection />
            <TimingSection />
            <VisionSection />
            <InvestorFormSection />
            <InvestorFAQSection />
            <InvestorCTASection />
        </>
    )
}
