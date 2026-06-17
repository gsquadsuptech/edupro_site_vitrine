import { MarketplaceHero } from "@/components/marketing/sections/marketplace/hero-section";
import { MarketplaceStats } from "@/components/marketing/sections/marketplace/stats-section";
import { FeaturedCourses } from "@/components/marketing/sections/marketplace/featured-courses";
import { CategoriesGrid } from "@/components/marketing/sections/marketplace/categories-grid";
// import { SkillPacksSection } from "@/components/marketing/sections/marketplace/skill-packs-section";
import { CoCertifiedCatalogs } from "@/components/marketing/sections/marketplace/co-certified-catalogs";
import { PartnerInstitutes } from "@/components/marketing/sections/marketplace/partner-institutes";
// import { LearnerTestimonials } from "@/components/marketing/sections/marketplace/learner-testimonials";
import { MarketplaceCTA } from "@/components/marketing/sections/marketplace/marketplace-cta";

import { CategoryService } from "@/services/category-service";
import { SkillPackService } from "@/services/skill-pack-service";
import { OrganizationService } from "@/services/organization-service";
import { MarketplaceService } from "@/services/marketplace-service";
import { CatalogService } from "@/services/catalog-service";

export default async function CataloguePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Parallel data fetching
    const [featuredItems, categories, skillPacks, institutes, coCertifiedCatalogs] = await Promise.all([
        MarketplaceService.getFeaturedItems(8),
        CategoryService.getCategoriesWithCounts(),
        SkillPackService.getAllSkillPacks(),
        OrganizationService.getPartnerInstitutes(),
        CatalogService.getPublicCatalogs()
    ]);

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                <MarketplaceHero />
                <MarketplaceStats />
                <FeaturedCourses locale={locale} items={featuredItems} />
                <CategoriesGrid locale={locale} categories={categories} />
                {/* <SkillPacksSection locale={locale} skillPacks={skillPacks} /> */}
                <CoCertifiedCatalogs locale={locale} catalogs={coCertifiedCatalogs} />
                <PartnerInstitutes institutes={institutes} />
                {/* <LearnerTestimonials /> */}
                <MarketplaceCTA />
            </main>
        </div>
    );
}
