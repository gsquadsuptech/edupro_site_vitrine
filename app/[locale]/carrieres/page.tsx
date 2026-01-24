import { CareersHeroSection } from "@/components/sections/careers/hero-section"
import { CareersValuesSection } from "@/components/sections/careers/values-section"
import { CareersPositionsSection } from "@/components/sections/careers/positions-section"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Carrières | Edupro",
    description: "Rejoignez l'équipe Edupro et participez à la transformation de la formation professionnelle en Afrique.",
}

export default function CareersPage() {
    return (
        <>
            <CareersHeroSection />
            <CareersValuesSection />
            <CareersPositionsSection />
        </>
    )
}
