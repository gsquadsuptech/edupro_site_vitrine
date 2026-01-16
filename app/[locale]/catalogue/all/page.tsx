import type { Metadata } from "next";
import { ContextualHero } from "@/components/marketing/sections/category/contextual-hero";
import { SubCategories } from "@/components/marketing/sections/category/sub-categories";
import { SearchFilters } from "@/components/marketing/sections/marketplace/search-filters";
import { SearchResults } from "@/components/marketing/sections/marketplace/search-results";

export const metadata: Metadata = {
    title: "Catalogue - EduPro",
    description: "Explorez notre catalogue complet de formations.",
};

export default async function CatalogueAllPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { locale } = await params;
    const resolvedSearchParams = await searchParams;
    const category = (resolvedSearchParams?.category as string) || "all";

    // Mock data for filtered results (simulating filter based on searchParams)
    const mockFilteredCourses = Array(9).fill(null).map((_, i) => ({
        id: `filtered-${i}`,
        slug: `formation-result-${i}`,
        title: `Formation ${category !== 'all' ? category : 'Générale'} - Niveau ${i + 1}`,
        thumbnail: '/placeholder.svg',
        level: i % 2 === 0 ? 'Intermédiaire' : 'Avancé',
        price: 25000 + (i * 5000),
        monthlyPrice: 0,
        duration: `${10 + i}h`,
        // Ensure category matches user intent or is generic
        category: category !== 'all' ? category : 'tech-digital',
        instructor: 'Expert Pro',
        rating: 4.5 + (i * 0.1),
        reviewCount: 15 + i,
        enrolledCount: 80 + (i * 10)
    }));

    // Map slug to display name
    const categoryNames: Record<string, string> = {
        'all': 'Catalogue Complet',
        'tech-digital': 'Tech & Digital',
        'business-management': 'Business & Management',
        'construction-durable': 'Construction Durable',
        'soft-skills': 'Soft Skills',
        'sante': 'Santé',
        'finance': 'Finance',
        'design': 'Design',
        'langues': 'Langues'
    };

    const categoryDisplayName = categoryNames[category] || category || 'Catégorie';

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                <ContextualHero categorySlug={category} />
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
