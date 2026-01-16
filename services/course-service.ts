import { createClient } from '@/lib/supabase/client'
import { Course } from '@/lib/supabase/types'

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
        duration,
        level,
        status,
        created_at,
        category:categories!inner(name, slug),
        instructor:instructors(name, avatar_url),
        marketplace:marketplace_courses!inner(featured, rating, review_count)
      `, { count: 'exact' })
            .eq('status', 'published')

        if (searchTerm) {
            query = query.ilike('title', `%${searchTerm}%`)
        }

        if (category && category !== 'all') {
            query = query.eq('categories.slug', category)
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

        const courses = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            description: item.description,
            image_url: item.thumbnail,
            price: item.price,
            original_price: null,
            currency: 'FCFA',
            duration: item.duration ? `${Math.round(item.duration / 60)}h` : '20h',
            level: item.level,
            is_featured: item.marketplace?.featured || false,
            published_at: item.created_at,
            category: item.category,
            instructor: item.instructor ? { name: item.instructor.name, avatar_url: item.instructor.avatar_url } : null
        }))

        return { courses, total: count || 0 }
    },

    async getFeaturedCourses(): Promise<Course[]> {
        const supabase = createClient()

        // 1. Get featured course IDs from marketplace_courses
        const { data: featuredData, error: featuredError } = await supabase
            .from('marketplace_courses')
            .select('course_id, featured, rating, review_count')
            .eq('featured', true)

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
        duration,
        level,
        status,
        created_at,
        category:categories(name, slug),
        instructor:instructors(name, avatar_url),
        marketplace:marketplace_courses(featured, rating, review_count)
      `)
            .in('id', featuredIds)
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .limit(6)

        if (error) {
            console.error('Error fetching featured courses:', error)
            return []
        }

        // Filter for featured manually if join filtering is tricky (supa simplified)
        // Or better, let's just map what we get, assuming strict query later.
        // MAPPING
        return data.map((item: any) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            description: item.description,
            image_url: item.thumbnail,
            price: item.price,
            original_price: null,
            currency: 'FCFA', // Default
            duration: item.duration ? `${Math.round(item.duration / 60)}h` : '20h',
            level: item.level,
            is_featured: item.marketplace?.featured || false,
            published_at: item.created_at,
            category: item.category,
            instructor: item.instructor ? { name: item.instructor.name, avatar_url: item.instructor.avatar_url } : null
        }))
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
        duration,
        level,
        status,
        created_at,
        category:categories(name, slug),
        instructor:instructors(name, avatar_url),
        marketplace:marketplace_courses(featured, rating, review_count)
      `)
            .eq('status', 'published')
            .limit(limit)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching courses:', error)
            return []
        }

        return data.map((item: any) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            description: item.description,
            image_url: item.thumbnail,
            price: item.price,
            original_price: null,
            currency: 'FCFA',
            duration: item.duration ? `${Math.round(item.duration / 60)}h` : '20h',
            level: item.level,
            is_featured: item.marketplace?.featured || false,
            published_at: item.created_at,
            category: item.category,
            instructor: item.instructor ? { name: item.instructor.name, avatar_url: item.instructor.avatar_url } : null
        }))
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
        duration,
        level,
        status,
        created_at,
        category:categories!inner(name, slug),
        instructor:instructors(name, avatar_url),
        marketplace:marketplace_courses(featured, rating, review_count)
      `)
            .eq('status', 'published')
            .eq('categories.slug', categorySlug)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching courses by category:', error)
            return []
        }

        return data.map((item: any) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            description: item.description,
            image_url: item.thumbnail,
            price: item.price,
            original_price: null,
            currency: 'FCFA',
            duration: item.duration ? `${Math.round(item.duration / 60)}h` : '20h',
            level: item.level,
            is_featured: item.marketplace?.featured || false,
            published_at: item.created_at,
            category: item.category,
            instructor: item.instructor ? { name: item.instructor.name, avatar_url: item.instructor.avatar_url } : null
        }))
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
        duration,
        level,
        status,
        preview_video,
        expected_results,
        objectives,
        prerequisites,
        created_at,
        category:categories(name, slug),
        instructor:instructors(name, avatar_url),
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
            created_at: r.created_at
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

        return {
            id: item.id,
            title: item.title,
            slug: item.slug,
            description: item.description,
            image_url: item.thumbnail,
            price: item.price || 0,
            original_price: null,
            currency: 'FCFA',
            rating: item.marketplace?.rating || 0,
            reviewCount: item.marketplace?.review_count || reviews.length,
            duration: item.duration ? `${Math.round(item.duration / 60)}h` : '10h',
            level: item.level,
            published_at: item.created_at,
            instructor: {
                name: item.instructor?.name || 'Algorix',
                avatar_url: item.instructor?.avatar_url || null,
                role: 'Instructor'
            },
            category: {
                name: item.category?.name || 'Général',
                slug: item.category?.slug || 'general'
            },
            highlights: parseJson(item.expected_results),
            objectives: parseJson(item.objectives),
            prerequisites: parseJson(item.prerequisites),
            preview_video: item.preview_video || null,
            sections: sections,
            reviews: reviews,
            is_published: item.status === 'published',
            is_featured: item.marketplace?.featured || false
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
        duration,
        level,
        status,
        preview_video,
        expected_results,
        objectives,
        prerequisites,
        created_at,
        category:categories(name, slug),
        instructor:instructors(name, avatar_url),
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
            .select('*')
            .eq('course_id', item.id)
            .order('created_at', { ascending: false })
            .limit(5) // Limit for performance

        const reviews = reviewsData?.map((r: any) => ({
            id: r.id,
            user: {
                name: 'Étudiant', // anonymity or join user profile if needed
                avatar_url: null
            },
            rating: r.rating,
            comment: r.comment,
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

        return {
            id: item.id,
            title: item.title,
            slug: item.slug,
            description: item.description,
            image_url: item.thumbnail,
            price: item.price || 0,
            original_price: null,
            currency: 'FCFA',
            rating: item.marketplace?.rating || 0,
            reviewCount: item.marketplace?.review_count || reviews.length,
            duration: item.duration ? `${Math.round(item.duration / 60)}h` : '10h',
            level: item.level,
            published_at: item.created_at,
            instructor: {
                name: item.instructor?.name || 'Algorix',
                avatar_url: item.instructor?.avatar_url || null,
                role: 'Instructor'
            },
            category: {
                name: item.category?.name || 'Général',
                slug: item.category?.slug || 'general'
            },
            highlights: parseJson(item.expected_results),
            objectives: parseJson(item.objectives),
            prerequisites: parseJson(item.prerequisites),
            preview_video: item.preview_video || null,
            sections: sections,
            reviews: reviews,
            is_published: item.status === 'published',
            is_featured: item.marketplace?.featured || false
        }
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
        duration,
        level,
        status,
        created_at,
        category:categories!inner(name, slug),
        instructor:instructors(name, avatar_url),
        marketplace:marketplace_courses!inner(featured, rating, review_count)
      `)
            .eq('status', 'published')
            .eq('categories.slug', categorySlug)
            .neq('id', excludeCourseId)
            .limit(4)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching similar courses:', error)
            return []
        }

        return data.map((item: any) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            description: item.description,
            image_url: item.thumbnail,
            price: item.price,
            original_price: null,
            currency: 'FCFA',
            duration: item.duration ? `${Math.round(item.duration / 60)}h` : '20h',
            level: item.level,
            is_featured: item.marketplace?.featured || false,
            published_at: item.created_at,
            category: item.category,
            instructor: item.instructor ? { name: item.instructor.name, avatar_url: item.instructor.avatar_url } : null
        }))
    },

    async getCohortsByCourseId(courseId: string): Promise<Cohort[]> {
        const supabase = createClient()

        // Try fetching via cohort_courses junction table first
        // Assuming structure: cohort_courses (cohort_id, course_id)
        const { data, error } = await supabase
            .from('cohort_courses')
            .select(`
                cohort:cohorts (
                    id,
                    name,
                    description,
                    start_date,
                    end_date,
                    status,
                    max_students,
                    pricing_modes
                )
            `)
            .eq('course_id', courseId)
            .eq('cohort.status', 'active') // Only active cohorts

        if (error) {
            console.error('Error fetching cohorts:', error)

            // Fallback: try querying cohorts table directly if it has course_id column (1-to-N)
            const { data: directData, error: directError } = await supabase
                .from('cohorts')
                .select('*')
                .eq('course_id', courseId) // This might fail if column doesn't exist
                .eq('status', 'active')

            if (directError) {
                console.error('Fallback fetch failed:', directError)
                return []
            }

            return (directData as any[]).map(item => ({
                ...item,
                registration_deadline: item.registration_deadline || null, // Ensure field exists
                sessions: []
            }))
        }

        // Map the junction result
        const cohorts = (data as any[])
            .map(item => item.cohort)
            .filter(Boolean) // Filter out nulls if filtering on joined table
        // Note: .eq('cohort.status', 'active') on outer query might return rows with null cohort if inner join fails or left join. 
        // Better to filter in JS if not using !inner

        return cohorts.map((c: any) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            start_date: c.start_date,
            end_date: c.end_date,
            registration_deadline: c.registration_deadline || null,
            status: c.status,
            max_students: c.max_students,
            pricing_modes: c.pricing_modes,
            sessions: [] // Could fetch sessions separately if needed
        }))
    }
}
