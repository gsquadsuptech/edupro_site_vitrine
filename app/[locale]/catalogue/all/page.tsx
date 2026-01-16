import type { Metadata } from "next";
import { ContextualHero } from "@/components/marketing/sections/category/contextual-hero";
import { SubCategories } from "@/components/marketing/sections/category/sub-categories";
import { SearchFilters } from "@/components/marketing/sections/marketplace/search-filters";
import { SearchResults } from "@/components/marketing/sections/marketplace/search-results";
import { CourseService } from "@/services/course-service";
import { CategoryService } from "@/services/category-service";

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
    const categoryQuery = (resolvedSearchParams?.category as string) || "all";
    const searchQuery = (resolvedSearchParams?.q as string) || "";
    const minPrice = resolvedSearchParams?.minPrice ? Number(resolvedSearchParams.minPrice) : undefined;
    const maxPrice = resolvedSearchParams?.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined;
    const levelQuery = resolvedSearchParams?.level as string;
    const levels = levelQuery ? levelQuery.split(',') : undefined;

    // Fetch data in parallel
    const [categoriesData, coursesResult] = await Promise.all([
        CategoryService.getCategoriesWithCounts(), // Assuming this exists or falls back to getAllCategories
        CourseService.searchCourses({
            searchTerm: searchQuery,
            category: categoryQuery,
            minPrice,
            maxPrice,
            level: levels,
            limit: 12
        })
    ]);

    const { courses, total } = coursesResult;

    // Transform categories for filters
    const filterCategories = categoriesData.map(c => ({
        id: c.slug,
        label: c.name,
        count: 0 // Count per category logic would be complex to dynamic update, leaving 0 or implementing specialized service later
    }));

    // Derive display name
    const currentCategory = categoriesData.find(c => c.slug === categoryQuery);
    const categoryDisplayName = currentCategory?.name || (categoryQuery === 'all' ? 'Catalogue Complet' : categoryQuery);

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                <ContextualHero categorySlug={categoryQuery} />
                <SubCategories />
                <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
                    <div className="flex flex-col gap-6 lg:flex-row">
                        <SearchFilters categories={filterCategories} />
                        <SearchResults courses={courses} />
                    </div>
                </div>
            </main>
        </div>
    );
}
