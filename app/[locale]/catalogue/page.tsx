import { MarketplaceHero } from "@/components/marketing/sections/marketplace/hero-section";
import { MarketplaceStats } from "@/components/marketing/sections/marketplace/stats-section";
import { FeaturedCourses } from "@/components/marketing/sections/marketplace/featured-courses";
import { CategoriesGrid } from "@/components/marketing/sections/marketplace/categories-grid";
import { SkillPacksSection } from "@/components/marketing/sections/marketplace/skill-packs-section";
import { PartnerInstitutes } from "@/components/marketing/sections/marketplace/partner-institutes";
import { LearnerTestimonials } from "@/components/marketing/sections/marketplace/learner-testimonials";
import { MarketplaceCTA } from "@/components/marketing/sections/marketplace/marketplace-cta";

export default function CataloguePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                <MarketplaceHero />
                <MarketplaceStats />
                <FeaturedCourses />
                <CategoriesGrid />
                <SkillPacksSection />
                <PartnerInstitutes />
                <LearnerTestimonials />
                <MarketplaceCTA />
            </main>
        </div>
    );
}
