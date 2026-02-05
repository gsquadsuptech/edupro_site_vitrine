import { ParcoursHero } from "@/components/sections/parcours/hero-section"
import { ParcoursOverview } from "@/components/sections/parcours/overview-section"
import { ParcoursCurriculum } from "@/components/sections/parcours/curriculum-section"
import { ParcoursInstructors } from "@/components/sections/parcours/instructors-section"
import { ParcoursCertification } from "@/components/sections/parcours/certification-section"
import { ParcoursTestimonials } from "@/components/sections/parcours/testimonials-section"
import { ParcoursPricing } from "@/components/sections/parcours/pricing-section"
import { ParcoursFAQ } from "@/components/sections/parcours/faq-section"
import { ParcoursCTA } from "@/components/sections/parcours/cta-section"

export default function ParcoursPage() {
    return (
        <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50">
            <ParcoursHero />
            <ParcoursOverview />
            <ParcoursCurriculum />
            <ParcoursInstructors />
            <ParcoursCertification />
            <ParcoursTestimonials />
            <ParcoursPricing />
            <ParcoursFAQ />
            <ParcoursCTA />
        </div>
    )
}
