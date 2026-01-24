import { HeroSection } from "@/components/sections/about/hero-section"
import { MissionSection } from "@/components/sections/about/mission-section"
import { VisionSection } from "@/components/sections/about/vision-section"
import { PillarsSection } from "@/components/sections/about/pillars-section"
import { TeamSection } from "@/components/sections/about/team-section"
import { ValuesSection } from "@/components/sections/about/values-section"
import { JoinSection } from "@/components/sections/about/join-section"
import { ContactSection } from "@/components/sections/about/contact-section"
import { FinalCTASection } from "@/components/sections/about/final-cta-section"

export default function AboutPage() {
    return (
        <>
            <HeroSection />
            <MissionSection />
            <VisionSection />
            <PillarsSection />
            <TeamSection />
            <ValuesSection />
            <JoinSection />
            <ContactSection />
            <FinalCTASection />
        </>
    )
}
