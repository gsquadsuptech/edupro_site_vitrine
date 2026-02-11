import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FormationBreadcrumb } from "@/components/marketing/sections/formation/breadcrumb";
import { FormationHero } from "@/components/marketing/sections/formation/hero-section";
import { FormationTabs } from "@/components/marketing/sections/formation/formation-tabs";
import { SimilarCourses } from "@/components/marketing/sections/formation/similar-courses";
import { CourseService } from "@/services/course-service";

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

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                <FormationBreadcrumb
                    category={course.category}
                    courseTitle={course.title}
                />
                <FormationHero course={course} cohorts={cohorts} />
                <FormationTabs course={course} />
                <SimilarCourses courses={similarCourses} />
            </main>
        </div>
    );
}
