import { HeroSection } from "@/components/marketing/sections/about/hero-section"
import { MissionSection } from "@/components/marketing/sections/about/mission-section"
import { VisionSection } from "@/components/marketing/sections/about/vision-section"
import { PillarsSection } from "@/components/marketing/sections/about/pillars-section"
// import { TeamSection } from "@/components/marketing/sections/about/team-section"
import { ValuesSection } from "@/components/marketing/sections/about/values-section"
import { JoinSection } from "@/components/marketing/sections/about/join-section"
import { ContactSection } from "@/components/marketing/sections/about/contact-section"
import { FinalCTASection } from "@/components/marketing/sections/about/final-cta-section"

export default function AProposPage() {
  return (
    <>
      <HeroSection />
      <MissionSection />
      <VisionSection />
      <PillarsSection />
      {/* <TeamSection /> */}
      <ValuesSection />
      <JoinSection />
      <ContactSection />
      <FinalCTASection />
    </>
  )
}
