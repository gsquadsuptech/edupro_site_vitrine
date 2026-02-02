import { SpontaneousHeroSection } from "@/components/marketing/sections/careers/spontaneous-hero-section"
import { Container } from "@/components/marketing/layout/container"
import { useTranslations } from "next-intl"

export default function SpontaneousApplicationPage() {
    const t = useTranslations('careers.spontaneous')

    return (
        <>
            <SpontaneousHeroSection />
            <div className="py-20">
                <Container>
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-muted-foreground">{t("form.description") || "Envoyez-nous votre CV à jobs@edupro.africa"}</p>
                        {/* Placeholder for form if needed later */}
                    </div>
                </Container>
            </div>
        </>
    )
}
