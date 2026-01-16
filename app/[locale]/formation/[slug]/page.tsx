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

    const similarCourses = course.category?.slug
        ? await CourseService.getSimilarCourses(course.category.slug, course.id)
        : [];

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                <FormationBreadcrumb />
                <FormationHero course={course} />
                <FormationTabs course={course} />
                <SimilarCourses courses={similarCourses} />
            </main>
        </div>
    );
}
