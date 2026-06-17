import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FormationBreadcrumb } from "@/components/marketing/sections/formation/breadcrumb";
import { FormationHero } from "@/components/marketing/sections/formation/hero-section";
import { FormationTabs } from "@/components/marketing/sections/formation/formation-tabs";
import { CourseSidebar } from "@/components/marketing/sections/formation/course-sidebar";
import { SimilarCourses } from "@/components/marketing/sections/formation/similar-courses";
import { MobilePurchaseBar } from "@/components/marketing/sections/formation/mobile-purchase-bar";
import { CatalogBelongsSection } from "@/components/marketing/sections/parcours/catalogs-section";
import { CourseService } from "@/services/course-service";
import { CatalogService } from "@/services/catalog-service";

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

    const course = await CourseService.getCourseBySlug(slug);

    if (!course) {
        notFound();
    }

    // Recommandations via l'endpoint SaaS dédié ; fallback sur l'heuristique
    // locale (même institut → même catégorie) si l'API ne renvoie rien.
    let similarCourses = await CourseService.getSimilarCoursesFromApi(course.id, 4);
    if (similarCourses.length === 0) {
        similarCourses = await CourseService.getRelatedCourses(
            course.category?.slug || 'general',
            course.id,
            course.instructor?.organization_id
        );
    }

    const cohorts = await CourseService.getCohortsByCourseId(course.id);
    const catalogs = await CatalogService.getByCourse(course.id);

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <main className="flex-1">
                <FormationBreadcrumb
                    category={course.category}
                    courseTitle={course.title}
                />

                <div className="container pb-20">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
                        {/* Left Column - Main Content */}
                        <div className="min-w-0 space-y-4">
                            <FormationHero course={course} />
                            <FormationTabs course={course} cohorts={cohorts} />
                        </div>

                        {/* Right Column - Sticky Sidebar (Desktop Only) */}
                        <aside className="hidden lg:block">
                            <div className="sticky top-24 self-start">
                                <CourseSidebar course={course} cohorts={cohorts} />
                            </div>
                        </aside>
                    </div>
                </div>

                <CatalogBelongsSection catalogs={catalogs} locale={locale} kind="cours" />

                <SimilarCourses courses={similarCourses} />
            </main>

            <MobilePurchaseBar course={course} cohorts={cohorts} />
        </div>
    );
}
