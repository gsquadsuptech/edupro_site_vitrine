import type { Metadata } from "next";
import { CategoryHero } from "@/components/marketing/sections/category/hero-section";
import { SubCategories } from "@/components/marketing/sections/category/sub-categories";
import { SearchFilters } from "@/components/marketing/sections/marketplace/search-filters";
import { SearchResults } from "@/components/marketing/sections/marketplace/search-results";

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

    // Mock data for filtered results
    const mockFilteredCourses = Array(9).fill(null).map((_, i) => ({
        id: `filtered-${i}`,
        slug: `formation-result-${i}`,
        title: `Formation ${slug} - Niveau ${i + 1}`,
        thumbnail: '/placeholder.svg',
        level: i % 2 === 0 ? 'Intermédiaire' : 'Avancé',
        price: 25000 + (i * 5000),
        monthlyPrice: 0,
        duration: `${10 + i}h`,
        category: slug,
        instructor: 'Expert Pro',
        rating: 4.5 + (i * 0.1),
        reviewCount: 15 + i,
        enrolledCount: 80 + (i * 10)
    }));

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                <CategoryHero categorySlug={slug} courseCount={mockFilteredCourses.length} />
                <SubCategories />
                <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
                    <div className="flex flex-col gap-6 lg:flex-row">
                        <SearchFilters />
                        <SearchResults courses={mockFilteredCourses} />
                    </div>
                </div>
            </main>
        </div>
    );
}

//stech