import type { Metadata } from "next";
import { ContextualHero } from "@/components/marketing/sections/category/contextual-hero";
import { SubCategories } from "@/components/marketing/sections/category/sub-categories";
import { SearchFilters } from "@/components/marketing/sections/marketplace/search-filters";
import { SearchResults } from "@/components/marketing/sections/marketplace/search-results";
import { CatalogueToolbar } from "@/components/marketing/sections/marketplace/catalogue-toolbar";
import { PaginationControls } from "@/components/marketing/shared/pagination-controls";
import { CategoryService } from "@/services/category-service";
import { MarketplaceService } from "@/services/marketplace-service";
import type { CourseSort } from "@/services/course-service";

const PAGE_SIZE = 12;
const SORT_VALUES: CourseSort[] = ["recent", "price_asc", "price_desc", "popular", "rating"];

export const metadata: Metadata = {
    title: "Catalogue - EduPro",
    description: "Explorez notre catalogue complet de formations et parcours.",
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
    const typeQuery = (resolvedSearchParams?.type as string) || "all";
    const itemType: 'course' | 'learning_path' | 'all' =
        typeQuery === 'course' || typeQuery === 'learning_path' ? typeQuery : 'all';

    const sortQuery = resolvedSearchParams?.sort as string;
    const sort: CourseSort = SORT_VALUES.includes(sortQuery as CourseSort) ? (sortQuery as CourseSort) : 'recent';
    const page = Math.max(1, Number(resolvedSearchParams?.page) || 1);
    const offset = (page - 1) * PAGE_SIZE;

    // Quand l'utilisateur filtre par catégorie, l'API courses est plus fine — on bascule en courses-only
    // (la taxonomie marketplace_categories ne s'applique pas encore aux learning_paths).
    const effectiveType: 'course' | 'learning_path' | 'all' =
        categoryQuery && categoryQuery !== 'all' ? 'course' : itemType;

    const [categoriesData, marketplaceResult] = await Promise.all([
        CategoryService.getCategoriesWithCounts(),
        MarketplaceService.listMarketplaceItems({
            type: effectiveType,
            searchTerm: searchQuery,
            category: categoryQuery,
            minPrice,
            maxPrice,
            level: levels,
            sort,
            limit: PAGE_SIZE,
            offset,
        }),
    ]);

    const { items, total } = marketplaceResult;

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
                <ContextualHero categorySlug={categoryQuery} categories={categoriesData} />
                <SubCategories />
                <div className="container py-8">
                    <div className="flex flex-col gap-6 lg:flex-row">
                        <SearchFilters categories={filterCategories} />
                        <div className="flex-1">
                            <CatalogueToolbar total={total} />
                            <SearchResults items={items} />
                            <PaginationControls totalCount={total} pageSize={PAGE_SIZE} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
