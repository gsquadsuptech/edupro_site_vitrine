import { createClient } from '@/lib/supabase/client'
import { Course, Cohort } from '@/lib/supabase/types'

export interface CourseFilters {
    searchTerm?: string
    category?: string
    minPrice?: number
    maxPrice?: number
    level?: string[]
    limit?: number
    offset?: number
}

export const CourseService = {
    async searchCourses(filters: CourseFilters): Promise<{ courses: Course[], total: number }> {
        const supabase = createClient()
        const { searchTerm, category, minPrice, maxPrice, level, limit = 12, offset = 0 } = filters

        let query = supabase
            .from('courses')
            .select(`
        id,
        title,
        slug,
        description,
        thumbnail,
        price,
        one_time_price,
        monthly_price,
        registration_fee,
        monthly_fee,
        installments,
        pricing_modes,
        duration,
        level,
        status,
        format,
        created_at,
        category:categories!inner(name, slug),
        instructor:instructors(name, avatar_url, organization:organizations(name)),
        marketplace:marketplace_courses!inner(featured, rating, review_count)
      `, { count: 'exact' })
            .eq('status', 'published')

        if (searchTerm) {
            query = query.ilike('title', `%${searchTerm}%`)
        }

        if (category && category !== 'all') {
            query = query.eq('category.slug', category)
        }

        if (minPrice !== undefined) {
            // Handle 0 price correctly
            query = query.gte('price', minPrice)
        }

        if (maxPrice !== undefined) {
            query = query.lte('price', maxPrice)
        }

        if (level && level.length > 0) {
            // "level" in DB might be single string. If UI sends array, we use .in()
            query = query.in('level', level)
        }

        const { data, error, count } = await query
            .range(offset, offset + limit - 1)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error searching courses:', error)
            return { courses: [], total: 0 }
        }

        const courses = data.map((item: any) => CourseService.mapCourseItem(item))

        return { courses, total: count || 0 }
    },

    mapCourseItem(item: any): Course {
        const oneTimePrice = item.one_time_price ? Number(item.one_time_price) : null;
        const legacyPrice = item.price ? Number(item.price) : 0;

        // Use one_time_price if available and legacy price is 0 or less
        const displayPrice = (legacyPrice <= 0 && oneTimePrice && oneTimePrice > 0) ? oneTimePrice : legacyPrice;

        return {
            id: item.id,
            format: item.format,
            title: item.title,
            slug: item.slug,
            description: item.description,
            image_url: item.thumbnail,
            price: displayPrice,
            original_price: item.one_time_discount ? Number(item.one_time_discount) : null,
            currency: 'FCFA',
            duration: item.duration ? `${Math.round(item.duration / 60)}h` : '20h',
            level: item.level,

            one_time_price: item.one_time_price ? Number(item.one_time_price) : null,
            monthly_price: item.monthly_price ? Number(item.monthly_price) : null,
            registration_fee: item.registration_fee ? Number(item.registration_fee) : null,
            monthly_fee: item.monthly_fee ? Number(item.monthly_fee) : null,
            installments: item.installments || [],
            pricing_modes: item.pricing_modes || null,

            is_featured: item.marketplace?.featured || false,
            is_published: item.status === 'published',
            published_at: item.created_at,
            category: item.category,
            instructor: item.instructor ? {
                name: item.instructor.name,
                avatar_url: item.instructor.avatar_url,
                institute: item.instructor.organization?.name || (item.instructor.organizations?.[0]?.name) || null
            } : null
        }
    },

    async getFeaturedCourses(): Promise<Course[]> {
        const supabase = createClient()

        // 1. Get featured course IDs from marketplace_courses
        const { data: featuredData, error: featuredError } = await supabase
            .from('marketplace_courses')
            .select('course_id, featured, rating, review_count')
            .eq('featured', true)
            .limit(8)

        if (featuredError) {
            console.error('Error fetching featured IDs:', featuredError)
            return []
        }

        const featuredIds = featuredData?.map((item: any) => item.course_id) || []

        if (featuredIds.length === 0) {
            return []
        }

        // 2. Fetch courses details
        const { data, error } = await supabase
            .from('courses')
            .select(`
        id,
        title,
        slug,
        description,
        thumbnail,
        price,
        one_time_price,
        monthly_price,
        registration_fee,
        monthly_fee,
        installments,
        pricing_modes,
        duration,
        level,
        status,
        format,
        created_at,
        category:categories(name, slug),
        instructor:instructors(name, avatar_url, organization:organizations(name)),
        marketplace:marketplace_courses(featured, rating, review_count)
      `)
            .in('id', featuredIds)
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .limit(8)

        if (error) {
            console.error('Error fetching featured courses:', error)
            return []
        }

        // Filter for featured manually if join filtering is tricky (supa simplified)
        // Or better, let's just map what we get, assuming strict query later.
        // MAPPING
        return data.map((item: any) => CourseService.mapCourseItem(item))
    },

    async getAllCourses(limit = 12): Promise<Course[]> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('courses')
            .select(`
        id,
        title,
        slug,
        description,
        thumbnail,
        price,
        one_time_price,
        monthly_price,
        registration_fee,
        monthly_fee,
        installments,
        pricing_modes,
        duration,
        level,
        status,
        format,
        created_at,
        category:categories(name, slug),
        instructor:instructors(name, avatar_url, organization:organizations(name)),
        marketplace:marketplace_courses(featured, rating, review_count)
      `)
            .eq('status', 'published')
            .limit(limit)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching courses:', error)
            return []
        }

        return data.map((item: any) => CourseService.mapCourseItem(item))
    },

    async getCoursesByCategory(categorySlug: string): Promise<Course[]> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('courses')
            .select(`
        id,
        title,
        slug,
        description,
        thumbnail,
        price,
        one_time_price,
        monthly_price,
        registration_fee,
        monthly_fee,
        installments,
        pricing_modes,
        duration,
        level,
        status,
        format,
        created_at,
        category:categories!inner(name, slug),
        instructor:instructors(name, avatar_url, organization:organizations(name)),
        marketplace:marketplace_courses(featured, rating, review_count)
      `)
            .eq('status', 'published')
            .eq('category.slug', categorySlug)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching courses by category:', error)
            return []
        }

        return data.map((item: any) => CourseService.mapCourseItem(item))
    },

    async getCourseById(id: string): Promise<Course | null> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('courses')
            .select(`
        id,
        title,
        slug,
        description,
        thumbnail,
        price,
        one_time_price,
        monthly_price,
        registration_fee,
        monthly_fee,
        installments,
        pricing_modes,
        one_time_discount,
        duration,
        level,
        status,
        format,
        preview_video,
        expected_results,
        objectives,
        prerequisites,
        created_at,
        category:categories(name, slug),
        instructor:instructors(name, avatar_url, organization:organizations(name)),
        marketplace:marketplace_courses(featured, rating, review_count),
        sections(
             id,
             title,
             position,
             lessons(
                 id,
                 title,
                 duration,
                 is_preview,
                 type,
                 position
             )
        )
      `)
            .eq('id', id)
            .eq('status', 'published')
            .single()

        if (error) {
            console.error('Error fetching course by id:', error)
            return null
        }

        const item = data as any

        // Fetch reviews separately
        const { data: reviewsData } = await supabase
            .from('course_reviews')
            .select('*')
            .eq('course_id', item.id)
            .order('created_at', { ascending: false })
            .limit(5)

        const reviews = reviewsData?.map((r: any) => ({
            id: r.id,
            user: {
                name: 'Étudiant',
                avatar_url: null
            },
            rating: r.rating,
            comment: r.comment,
            created_at: r.created_at,
            date: r.created_at,
            helpful: 0
        })) || []

        // Map sections/lessons
        const sortedSections = item.sections?.sort((a: any, b: any) => (a.position || 0) - (b.position || 0)) || []

        const sections = sortedSections.map((sec: any) => {
            const sortedLessons = sec.lessons?.sort((a: any, b: any) => (a.position || 0) - (b.position || 0)) || []

            return {
                id: sec.id,
                title: sec.title,
                sort_order: sec.position || 0,
                lessons: sortedLessons.map((les: any) => ({
                    id: les.id,
                    title: les.title,
                    slug: les.id,
                    duration: les.duration ? `${les.duration} min` : '5 min',
                    video_url: null,
                    is_preview: les.is_preview || false,
                    type: les.type || 'video'
                }))
            }
        })

        // Helper for JSON parsing
        const parseJson = (val: any) => {
            if (Array.isArray(val)) return val
            if (typeof val === 'string') {
                try { return JSON.parse(val) } catch { return [] }
            }
            if (typeof val === 'object' && val !== null) return Object.values(val)
            return []
        }

        const baseCourse = CourseService.mapCourseItem(item)

        return {
            ...baseCourse,
            rating: item.marketplace?.rating || 0,
            reviewCount: item.marketplace?.review_count || reviews.length,
            duration: item.duration ? `${Math.round(item.duration / 60)}h` : '10h',
            highlights: parseJson(item.expected_results),
            objectives: parseJson(item.objectives),
            prerequisites: parseJson(item.prerequisites),
            preview_video: item.preview_video || null,
            sections: sections,
            reviews: reviews
        }
    },

    async getCourseBySlug(slug: string): Promise<Course | null> {
        const supabase = createClient()

        // Note: Joining sections might require specific table names, assume 'sections' exists as per schema line 1040
        const { data, error } = await supabase
            .from('courses')
            .select(`
        id,
        title,
        slug,
        description,
        thumbnail,
        price,
        one_time_price,
        monthly_price,
        registration_fee,
        monthly_fee,
        installments,
        pricing_modes,
        one_time_discount,
        duration,
        level,
        status,
        format,
        preview_video,
        expected_results,
        objectives,
        prerequisites,
        created_at,
        category:categories(name, slug),
        instructor:instructors(name, avatar_url, rating, students_count, courses_count, organization_id, organization:organizations(name)),
        marketplace:marketplace_courses(featured, rating, review_count),
        sections(
             id,
             title,
             position,
             lessons(
                 id,
                 title,
                 duration,
                 is_preview,
                 type,
                 position
             )
        )
      `)
            .eq('slug', slug)
            .eq('status', 'published')
            .single()

        if (error) {
            console.error('Error fetching course by slug:', error)
            return null
        }

        const item = data as any

        // Fetch reviews separately
        const { data: reviewsData } = await supabase
            .from('course_reviews')
            .select(`
                *,
                user:profiles(full_name, avatar_url)
            `)
            .eq('course_id', item.id)
            .order('created_at', { ascending: false })
            .limit(10) // Limit for performance

        const reviews = reviewsData?.map((r: any) => ({
            id: r.id,
            user: {
                name: r.user?.full_name || 'Étudiant', // anonymity or join user profile if needed
                avatar_url: r.user?.avatar_url || null
            },
            rating: r.rating,
            comment: r.comment,
            location: r.location || "En ligne",
            date: new Date(r.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
            helpful: r.helpful_count || 0,
            created_at: r.created_at
        })) || []

        // Map sections/lessons
        // Sort sections by position
        const sortedSections = item.sections?.sort((a: any, b: any) => (a.position || 0) - (b.position || 0)) || []

        const sections = sortedSections.map((sec: any) => {
            // Sort lessons by position
            const sortedLessons = sec.lessons?.sort((a: any, b: any) => (a.position || 0) - (b.position || 0)) || []

            return {
                id: sec.id,
                title: sec.title,
                sort_order: sec.position || 0,
                lessons: sortedLessons.map((les: any) => ({
                    id: les.id,
                    title: les.title,
                    slug: les.id,
                    duration: les.duration ? `${les.duration} min` : '5 min',
                    video_url: null,
                    is_preview: les.is_preview || false,
                    type: les.type || 'video'
                }))
            }
        })

        // Helper for JSON parsing
        const parseJson = (val: any) => {
            if (Array.isArray(val)) return val
            if (typeof val === 'string') {
                try { return JSON.parse(val) } catch { return [] }
            }
            if (typeof val === 'object' && val !== null) return Object.values(val)
            return []
        }

        const baseCourse = CourseService.mapCourseItem(item)

        return {
            ...baseCourse,
            rating: item.marketplace?.rating || 0,
            reviewCount: item.marketplace?.review_count || reviews.length,
            duration: item.duration ? `${Math.round(item.duration / 60)}h` : '10h',
            highlights: parseJson(item.expected_results),
            objectives: parseJson(item.objectives),
            prerequisites: parseJson(item.prerequisites),
            preview_video: item.preview_video || null,
            sections: sections,
            reviews: reviews,
            instructor: {
                ...baseCourse.instructor,
                role: 'Instructor',
                rating: item.instructor?.rating || 0,
                students_count: item.instructor?.students_count || 0,
                courses_count: item.instructor?.courses_count || 0,
                organization_id: item.instructor?.organization_id || null
            } as any
        }
    },
    async getRelatedCourses(categorySlug: string, excludeCourseId: string, organizationId?: string | null): Promise<Course[]> {
        const supabase = createClient()
        const limit = 4;
        let courses: any[] = [];

        // 1. Try to fetch courses from the same institute (organization)
        if (organizationId) {
            const { data: instituteCourses, error: instError } = await supabase
                .from('courses')
                .select(`
                    id,
                    title,
                    slug,
                    description,
                    thumbnail,
                    price,
                    one_time_price,
                    monthly_price,
                    registration_fee,
                    monthly_fee,
                    installments,
                    pricing_modes,
                    duration,
                    level,
                    status,
                    format,
                    created_at,
                    category:categories!inner(name, slug),
                    instructor:instructors!inner(name, avatar_url, organization_id, organization:organizations(name)),
                    marketplace:marketplace_courses!inner(featured, rating, review_count)
                `)
                .eq('status', 'published')
                .eq('instructor.organization_id', organizationId)
                .neq('id', excludeCourseId)
                .limit(limit)
                .order('created_at', { ascending: false });

            if (!instError && instituteCourses) {
                courses = [...instituteCourses];
            }
        }

        // 2. If we don't have enough courses, fill with category matches
        if (courses.length < limit) {
            const needed = limit - courses.length;
            const existingIds = courses.map(c => c.id);
            existingIds.push(excludeCourseId);

            const { data: categoryCourses, error: catError } = await supabase
                .from('courses')
                .select(`
                    id,
                    title,
                    slug,
                    description,
                    thumbnail,
                    price,
                    one_time_price,
                    monthly_price,
                    registration_fee,
                    monthly_fee,
                    installments,
                    pricing_modes,
                    duration,
                    level,
                    status,
                    format,
                    created_at,
                    category:categories!inner(name, slug),
                    instructor:instructors(name, avatar_url, organization:organizations(name)),
                    marketplace:marketplace_courses!inner(featured, rating, review_count)
                `)
                .eq('status', 'published')
                .eq('category.slug', categorySlug)
                .not('id', 'in', `(${existingIds.join(',')})`)
                .limit(needed)
                .order('created_at', { ascending: false });

            if (!catError && categoryCourses) {
                courses = [...courses, ...categoryCourses];
            }
        }

        return courses.map((item: any) => CourseService.mapCourseItem(item))
    },

    async getSimilarCourses(categorySlug: string, excludeCourseId: string): Promise<Course[]> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('courses')
            .select(`
        id,
        title,
        slug,
        description,
        thumbnail,
        price,
        one_time_price,
        monthly_price,
        registration_fee,
        monthly_fee,
        installments,
        pricing_modes,
        duration,
        level,
        status,
        format,
        created_at,
        category:categories!inner(name, slug),
        instructor:instructors(name, avatar_url, organization:organizations(name)),
        marketplace:marketplace_courses!inner(featured, rating, review_count)
      `)
            .eq('status', 'published')
            .eq('category.slug', categorySlug)
            .neq('id', excludeCourseId)
            .limit(4)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching similar courses:', error)
            return []
        }

        return data.map((item: any) => CourseService.mapCourseItem(item))
    },

    async getCohortsByCourseId(courseId: string): Promise<Cohort[]> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('cohorts')
            .select(`
                id,
                name,
                description,
                start_date,
                end_date,
                status,
                max_participants,
                pricing_modes,
                registration_deadline,
                one_time_price,
                monthly_price,
                registration_fee,
                monthly_fee,
                installments,
                use_course_price
            `)
            .eq('course_id', courseId)
            .eq('status', 'active')

        if (error) {
            console.error('Error fetching cohorts:', error)
            return []
        }

        return (data as any[]).map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            start_date: item.start_date,
            end_date: item.end_date,
            registration_deadline: item.registration_deadline || null,
            status: item.status,
            max_students: item.max_participants || null,
            pricing_modes: item.pricing_modes,
            one_time_price: item.one_time_price ? Number(item.one_time_price) : null,
            monthly_price: item.monthly_price ? Number(item.monthly_price) : null,
            registration_fee: item.registration_fee ? Number(item.registration_fee) : null,
            monthly_fee: item.monthly_fee ? Number(item.monthly_fee) : null,
            installments: item.installments || [],
            use_course_price: item.use_course_price || false,
            sessions: []
        }))
    },

    async addToWaitlist(courseId: string, userId: string): Promise<{ success: boolean; error?: any }> {
        const supabase = createClient()

        try {
            const { error } = await supabase
                .from('waitlist')
                .insert({
                    course_id: courseId,
                    user_id: userId
                });

            if (error) {
                // Ignore duplicates gracefully
                if (error.code === '23505') { // Unique violation
                    return { success: true };
                }
                console.error('Error adding to waitlist:', error);
                return { success: false, error };
            }

            return { success: true };
        } catch (err) {
            console.error('Exception adding to waitlist:', err);
            return { success: false, error: err };
        }
    }
}
