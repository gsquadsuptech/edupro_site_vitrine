import { CareersHeroSection } from "@/components/sections/careers/hero-section"
import { CareersValuesSection } from "@/components/sections/careers/values-section"
import { CareersPositionsSection } from "@/components/sections/careers/positions-section"
import { Metadata } from "next"
import { getNamespaceMessages, Locale } from "@/i18n"

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
    const { locale } = await params
    const messages = await getNamespaceMessages(locale, "careers")
    const t = messages as any

    return {
        title: t.meta?.title ?? "Carrières | Edupro",
        description: t.meta?.description ?? "Rejoignez l'équipe Edupro",
    }
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
