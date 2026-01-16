import type { Metadata } from "next";
import { FormationBreadcrumb } from "@/components/marketing/sections/formation/breadcrumb";
import { FormationHero } from "@/components/marketing/sections/formation/hero-section";
import { FormationTabs } from "@/components/marketing/sections/formation/formation-tabs";
import { SimilarCourses } from "@/components/marketing/sections/formation/similar-courses";
import { MOCK_COURSE } from "@/data/mock-formation";

export const metadata: Metadata = {
    title: "Détails Formation - EduPro",
    description: "Découvrez le programme complet de cette formation.",
};

export default async function FormationPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;

    // In a real app, we would fetch data based on slug
    // const course = await getCourseBySlug(slug);

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                <FormationBreadcrumb />
                <FormationHero course={MOCK_COURSE} />
                <FormationTabs />
                <SimilarCourses />
            </main>
        </div>
    );
}
