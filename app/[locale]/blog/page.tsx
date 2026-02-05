import { BlogHeroSection } from "@/components/sections/blog/hero-section"
import { BlogArticlesSection } from "@/components/sections/blog/articles-section"
import type { Metadata } from "next"
import { getNamespaceMessages, type Locale } from "@/i18n"

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
    const { locale } = await params
    const messages = await getNamespaceMessages(locale, "blog")

    return {
        title: messages?.meta?.title ?? "Blog | EduPro",
        description: messages?.meta?.description ?? "EduPro Blog",
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
