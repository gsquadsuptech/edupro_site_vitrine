import { Container } from "@/components/marketing/layout/container"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { LegalContentDisplay } from "@/components/sections/legal/legal-content-display"

export const dynamic = 'force-dynamic'

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params
    return {
        title: locale === 'fr' ? "Mentions Légales | EduPro" : "Legal Notice | EduPro",
        description: locale === 'fr'
            ? "Mentions légales et conditions d'utilisation d'EduPro"
            : "Legal information and terms of use",
    }
}

export default async function MentionsLegalesPage({ params }: Props) {
    const { locale } = await params
    return (
        <main className="flex-1">
            <section className="bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 py-12">
                <Container>
                    <div className="text-center">
                        <h1 className="mb-3 text-4xl font-bold text-slate-900 md:text-5xl">
                            {locale === 'fr' ? 'Mentions Légales' : 'Legal Notice'}
                        </h1>
                        <p className="text-xl text-slate-600">
                            {locale === 'fr'
                                ? "Informations légales et conditions d'utilisation"
                                : "Legal information and terms of use"}
                        </p>
                    </div>
                </Container>
            </section>

            <section className="py-12 md:py-16">
                <Container>
                    <div className="mx-auto max-w-4xl">
                        <LegalContentDisplay locale={locale} />
                    </div>
                </Container>
            </section>
        </main>
    )
}
