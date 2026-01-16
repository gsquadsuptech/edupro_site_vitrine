import type { Metadata } from "next";
import { SkillPackHeroNew } from "@/components/marketing/sections/skill-pack-new/hero-section";
import { SkillPackHighlights } from "@/components/marketing/sections/skill-pack-new/highlights-section";
import { SkillPackPathways } from "@/components/marketing/sections/skill-pack-new/pathways-section";
import { SkillPackImpact } from "@/components/marketing/sections/skill-pack-new/impact-section";
import { SkillPackTestimonialsNew } from "@/components/marketing/sections/skill-pack-new/testimonials-section";
import { SkillPackPricingNew } from "@/components/marketing/sections/skill-pack-new/pricing-section";
import { SkillPackCTA } from "@/components/marketing/sections/skill-pack-new/cta-section";

export const metadata: Metadata = {
    title: "Parcours Complet - EduPro",
    description: "Maîtrisez un métier complet avec nos Skill Packs.",
};

export default async function SkillPackPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            <main className="flex-1">
                <SkillPackHeroNew />
                <SkillPackHighlights />
                <SkillPackPathways />
                <SkillPackImpact />
                <SkillPackTestimonialsNew />
                <SkillPackPricingNew />
                <SkillPackCTA />
            </main>
        </div>
    );
}
