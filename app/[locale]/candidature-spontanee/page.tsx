import { SpontaneousApplicationForm } from "@/components/marketing/spontaneous-application-form"
import { Container } from "@/components/marketing/layout/container"
import { SpontaneousHeroSection } from "@/components/sections/careers/spontaneous-hero-section"
import { Metadata } from "next"
import { getNamespaceMessages, Locale } from "@/i18n"

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
    const { locale } = await params
    const messages = await getNamespaceMessages(locale, "careers")
    const t = messages as any

    return {
        title: t.spontaneous?.meta?.title ?? "Candidature spontanée | Edupro",
        description: t.spontaneous?.meta?.description ?? "Postulez chez Edupro",
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
