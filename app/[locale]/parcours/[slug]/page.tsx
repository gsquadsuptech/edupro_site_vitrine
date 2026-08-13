import { notFound } from "next/navigation"
import { ParcoursHero } from "@/components/marketing/sections/parcours/hero-section"
import { ParcoursOverview } from "@/components/marketing/sections/parcours/overview-section"
import { ParcoursCurriculum } from "@/components/marketing/sections/parcours/curriculum-section"
import { ParcoursInstructors } from "@/components/marketing/sections/parcours/instructors-section"
import { ParcoursCertification } from "@/components/marketing/sections/parcours/certification-section"
import { ParcoursTestimonials } from "@/components/marketing/sections/parcours/testimonials-section"
import { ParcoursPricing } from "@/components/marketing/sections/parcours/pricing-section"
import { ParcoursFAQ } from "@/components/marketing/sections/parcours/faq-section"
import { ParcoursCTA } from "@/components/marketing/sections/parcours/cta-section"
import { ParcoursCatalogs } from "@/components/marketing/sections/parcours/catalogs-section"
import { LearningPathService } from "@/services/learning-path-service"
import { CatalogService } from "@/services/catalog-service"
import { PricingService } from "@/services/pricing-service"

export default async function ParcoursPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>
}) {
    const { locale, slug } = await params
    const learningPath = await LearningPathService.getLearningPathBySlug(slug)

    if (!learningPath) {
        notFound()
    }

    const catalogs = await CatalogService.getByLearningPath(learningPath.id)
    const promo = await PricingService.getEffectivePrice('learning_path', learningPath.id)

    return (
        <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50">
            <ParcoursHero learningPath={learningPath} locale={locale} promo={promo ?? undefined} />
            <ParcoursOverview learningPath={learningPath} />
            <ParcoursCurriculum learningPath={learningPath} />
            <ParcoursInstructors learningPath={learningPath} />
            <ParcoursCertification learningPath={learningPath} />
            <ParcoursTestimonials learningPath={learningPath} />
            <ParcoursCatalogs catalogs={catalogs} locale={locale} />
            <ParcoursPricing learningPath={learningPath} locale={locale} promo={promo ?? undefined} />
            <ParcoursFAQ learningPath={learningPath} />
            <ParcoursCTA learningPath={learningPath} locale={locale} />
        </div>
    )
}
