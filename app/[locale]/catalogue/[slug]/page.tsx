import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryHero } from "@/components/marketing/sections/category/hero-section";
import { SubCategories } from "@/components/marketing/sections/category/sub-categories";
import { SearchFilters } from "@/components/marketing/sections/marketplace/search-filters";
import { SearchResults } from "@/components/marketing/sections/marketplace/search-results";

import { CourseService } from "@/services/course-service";
import { CategoryService } from "@/services/category-service";

export const metadata: Metadata = {
    title: "Catégorie - EduPro",
    description: "Découvrez nos formations dans cette catégorie.",
};

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;

    // Parallel fetching
    const [category, courses] = await Promise.all([
        CategoryService.getCategoryBySlug(slug),
        CourseService.getCoursesByCategory(slug)
    ]);

    if (!category) {
        notFound();
    }

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                <CategoryHero categorySlug={slug} courseCount={courses.length} />
                <SubCategories />
                <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
                    <div className="flex flex-col gap-6 lg:flex-row">
                        <SearchFilters />
                        <SearchResults courses={courses} />
                    </div>
                </div>
            </main>
        </div>
    );
}