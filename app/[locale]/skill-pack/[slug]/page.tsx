import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SkillPackHeroNew } from "@/components/marketing/sections/skill-pack-new/hero-section";
import { SkillPackHighlights } from "@/components/marketing/sections/skill-pack-new/highlights-section";
import { SkillPackPathways } from "@/components/marketing/sections/skill-pack-new/pathways-section";
import { SkillPackImpact } from "@/components/marketing/sections/skill-pack-new/impact-section";
import { SkillPackTestimonialsNew } from "@/components/marketing/sections/skill-pack-new/testimonials-section";
import { SkillPackPricingNew } from "@/components/marketing/sections/skill-pack-new/pricing-section";
import { SkillPackCTA } from "@/components/marketing/sections/skill-pack-new/cta-section";
import { SkillPackService } from "@/services/skill-pack-service";

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

    const skillPack = await SkillPackService.getSkillPackBySlug(slug);

    if (!skillPack) {
        notFound();
    }

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            <main className="flex-1">
                <SkillPackHeroNew skillPack={skillPack} />
                <SkillPackHighlights skillPack={skillPack} />
                <SkillPackPathways skillPack={skillPack} />
                <SkillPackImpact skillPack={skillPack} />
                <SkillPackTestimonialsNew skillPack={skillPack} />
                <SkillPackPricingNew skillPack={skillPack} />
                <SkillPackCTA skillPack={skillPack} />
            </main>
        </div>
    );
}
