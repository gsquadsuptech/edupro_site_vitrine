import { MarketplaceHero } from "@/components/marketing/sections/marketplace/hero-section";
import { MarketplaceStats } from "@/components/marketing/sections/marketplace/stats-section";
import { FeaturedCourses } from "@/components/marketing/sections/marketplace/featured-courses";
import { CategoriesGrid } from "@/components/marketing/sections/marketplace/categories-grid";
import { SkillPacksSection } from "@/components/marketing/sections/marketplace/skill-packs-section";
import { PartnerInstitutes } from "@/components/marketing/sections/marketplace/partner-institutes";
import { LearnerTestimonials } from "@/components/marketing/sections/marketplace/learner-testimonials";
import { MarketplaceCTA } from "@/components/marketing/sections/marketplace/marketplace-cta";

import { CourseService } from "@/services/course-service";
import { CategoryService } from "@/services/category-service";
import { SkillPackService } from "@/services/skill-pack-service";

export default async function CataloguePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Parallel data fetching
    const [featuredCourses, categories, skillPacks] = await Promise.all([
        CourseService.getFeaturedCourses(),
        CategoryService.getCategoriesWithCounts(),
        SkillPackService.getAllSkillPacks()
    ]);

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                <MarketplaceHero />
                <MarketplaceStats />
                <FeaturedCourses locale={locale} courses={featuredCourses} />
                <CategoriesGrid locale={locale} categories={categories} />
                <SkillPacksSection locale={locale} skillPacks={skillPacks} />
                <PartnerInstitutes />
                <LearnerTestimonials />
                <MarketplaceCTA />
            </main>
        </div>
    );
}
