
import { createClient } from './lib/supabase/client';
import { CourseService } from './services/course-service';

async function main() {
    const supabase = createClient();
    const slug = 'bootcamp-des-formateurs-edupro';

    console.log(`Fetching course with slug: ${slug}`);

    const course = await CourseService.getCourseBySlug(slug);

    if (!course) {
        console.error('Course not found');
        return;
    }

    console.log(`Course Found: ${course.title}, ID: ${course.id}, OrgID: ${course.instructor?.organization_id}`);

    console.log('--- Testing getRelatedCourses ---');
    const related = await CourseService.getRelatedCourses(
        course.category?.slug || 'general',
        course.id,
        course.instructor?.organization_id
    );

    console.log(`Found ${related.length} related courses.`);
    related.forEach(c => {
        console.log(`- ${c.title} (Org: ${c.instructor?.name || 'N/A'}, Category: ${c.category?.slug})`);
    });
}

main();
