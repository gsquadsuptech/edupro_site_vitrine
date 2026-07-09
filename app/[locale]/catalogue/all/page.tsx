import type { Metadata } from "next";
import { ContextualHero } from "@/components/marketing/sections/category/contextual-hero";
import { SubCategories } from "@/components/marketing/sections/category/sub-categories";
import { SearchFilters } from "@/components/marketing/sections/marketplace/search-filters";
import { InfiniteResults } from "@/components/marketing/sections/marketplace/infinite-results";
import { CatalogueToolbar } from "@/components/marketing/sections/marketplace/catalogue-toolbar";
import { CategoryService } from "@/services/category-service";
import { MarketplaceService } from "@/services/marketplace-service";
import { PricingService, pricingTargetsFromItems } from "@/services/pricing-service";
import type { CourseSort } from "@/services/course-service";
import type { CatalogueQuery } from "./actions";

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
    // Infinite scroll : l'URL ?page=N sert de point d'entrée (partage / refresh).
    // On charge donc d'emblée N pages depuis le début (offset 0) ; le chargement
    // incrémental côté client continue ensuite à partir de items.length.
    const page = Math.max(1, Number(resolvedSearchParams?.page) || 1);
    const initialLimit = page * PAGE_SIZE;

    // Filtres partagés entre le rendu serveur initial et la Server Action de
    // chargement incrémental — garantit la cohérence des lots suivants.
    const query: CatalogueQuery = {
        type: itemType,
        searchTerm: searchQuery,
        category: categoryQuery,
        minPrice,
        maxPrice,
        level: levels,
        sort,
    };

    // Le filtre par catégorie marketplace s'applique aux cours ET aux parcours :
    // on conserve donc le type demandé par l'utilisateur (cours / parcours / tout).
    const [categoriesData, marketplaceResult] = await Promise.all([
        CategoryService.getCategoriesWithCounts(),
        MarketplaceService.listMarketplaceItems({
            ...query,
            limit: initialLimit,
            offset: 0,
        }),
    ]);

    const { items, total } = marketplaceResult;

    // Prix effectifs (promos publiques) en UN seul appel batch pour la page courante.
    const promoPrices = await PricingService.getEffectivePrices(pricingTargetsFromItems(items));

    // Transform categories for filters. Le nombre de cours par catégorie est
    // déjà calculé par CategoryService.getCategoriesWithCounts() : on le réutilise
    // ici plutôt que d'afficher (0) partout.
    const filterCategories = categoriesData.map(c => ({
        id: c.slug,
        label: c.name,
        count: c.courses_count ?? 0
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
                            {/* key = signature des filtres : tout changement de
                                filtre relance un montage propre (reset du scroll
                                infini) au lieu d'empiler sur l'ancien jeu. */}
                            <InfiniteResults
                                key={`${itemType}|${searchQuery}|${categoryQuery}|${minPrice}|${maxPrice}|${levelQuery}|${sort}`}
                                initialItems={items}
                                initialPromoPrices={promoPrices}
                                total={total}
                                pageSize={PAGE_SIZE}
                                query={query}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
