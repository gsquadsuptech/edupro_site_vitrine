import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FormationBreadcrumb } from "@/components/marketing/sections/formation/breadcrumb";
import { FormationHero } from "@/components/marketing/sections/formation/hero-section";
import { FormationTabs } from "@/components/marketing/sections/formation/formation-tabs";
import { CourseSidebar } from "@/components/marketing/sections/formation/course-sidebar";
import { SimilarCourses } from "@/components/marketing/sections/formation/similar-courses";
import { CourseService } from "@/services/course-service";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

    const similarCourses = await CourseService.getRelatedCourses(
        course.category?.slug || 'general',
        course.id,
        course.instructor?.organization_id
    );

    const cohorts = await CourseService.getCohortsByCourseId(course.id);

    // Derived values for mobile purchase bar
    const price = course.price || 0;
    const isAutoFormation = course.format === 'auto-formation' || !course.format;
    const hasAvailableCohort = cohorts.some(c => c.status === 'active' || c.status === 'published');
    const showBuyButton = isAutoFormation || hasAvailableCohort;

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <main className="flex-1">
                <FormationBreadcrumb
                    category={course.category}
                    courseTitle={course.title}
                />
                
                <div className="container mx-auto px-4 md:px-6 lg:px-8 pb-20">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                        {/* Left Column - Main Content */}
                        <div className="lg:col-span-2 space-y-4">
                            <FormationHero course={course} />
                            <FormationTabs course={course} cohorts={cohorts} />
                        </div>

                        {/* Right Column - Sticky Sidebar (Desktop Only) */}
                        <aside className="hidden lg:block lg:col-span-1">
                            <div className="sticky top-24 self-start">
                                <CourseSidebar course={course} cohorts={cohorts} />
                            </div>
                        </aside>
                    </div>
                </div>

                <SimilarCourses courses={similarCourses} />
            </main>

            {/* Mobile Purchase Bar (Sticky Bottom) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 p-4 backdrop-blur-lg lg:hidden shadow-[0_-8px_30px_rgb(0,0,0,0.12)]">
                <div className="container mx-auto flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Prix</span>
                        <span className="text-xl font-extrabold text-foreground">
                            {price >= 1
                                ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(Math.round(price))
                                : "Gratuit"}
                        </span>
                    </div>
                    {showBuyButton ? (
                        <Link href={`/checkout/${course.id}`} className="flex-1 sm:max-w-xs">
                            <Button className="w-full bg-gradient-to-r from-primary to-chart-2 text-base font-bold text-primary-foreground shadow-lg h-12">
                                S'inscrire
                            </Button>
                        </Link>
                    ) : (
                        <div className="flex-1 sm:max-w-xs px-4 py-2 bg-muted rounded-lg text-center text-sm font-semibold text-muted-foreground">
                            Liste d'attente
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
