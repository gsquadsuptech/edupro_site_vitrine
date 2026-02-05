import { BlogHeroSection } from "@/components/sections/blog/hero-section"
import { BlogArticlesSection } from "@/components/sections/blog/articles-section"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { type Locale } from "@/i18n"

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: "blog.meta" })

    return {
        title: t("title"),
        description: t("description"),
    }
}

export const dynamic = 'force-dynamic'

export default function BlogPage() {
    return (
        <>
            <BlogHeroSection />
            <BlogArticlesSection />
        </>
    )
}
