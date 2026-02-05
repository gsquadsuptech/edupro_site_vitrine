import { CareersHeroSection } from "@/components/sections/careers/hero-section"
import { CareersValuesSection } from "@/components/sections/careers/values-section"
import { CareersPositionsSection } from "@/components/sections/careers/positions-section"
import { getTranslations } from "next-intl/server"
import { Locale } from "@/i18n"

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: "careers.meta" })

    return {
        title: t("title"),
        description: t("description"),
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
