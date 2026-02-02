import { BlogHeroSection } from "@/components/marketing/sections/blog/hero-section"
import { BlogArticlesSection } from "@/components/marketing/sections/blog/articles-section"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Blog & Actualités | EduPro",
    description: "Découvrez nos articles, conseils pratiques et tendances sur la formation professionnelle en Afrique.",
}

export default function BlogPage() {
    return (
        <>
            <BlogHeroSection />
            <BlogArticlesSection />
        </>
    )
}
