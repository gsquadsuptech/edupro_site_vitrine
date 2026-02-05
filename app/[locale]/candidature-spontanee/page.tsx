import { SpontaneousApplicationForm } from "@/components/marketing/spontaneous-application-form"
import { Container } from "@/components/marketing/layout/container"
import { SpontaneousHeroSection } from "@/components/sections/careers/spontaneous-hero-section"
import { getTranslations } from "next-intl/server"
import { Locale } from "@/i18n"

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: "careers.spontaneous.meta" })

    return {
        title: t("title"),
        description: t("description"),
    }
}

export default function SpontaneousApplicationPage() {
    return (
        <>
            <SpontaneousHeroSection />
            <div className="min-h-screen bg-background py-12 md:py-20">
                <Container>
                    <SpontaneousApplicationForm />
                </Container>
            </div>
        </>
    )
}
