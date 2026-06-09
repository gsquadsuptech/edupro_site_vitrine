import { createClient } from '@/lib/supabase/client'
import { LearningPath } from '@/lib/supabase/types'

export interface LearningPathFilters {
    searchTerm?: string
    level?: string[]
    language?: string
    minPrice?: number
    maxPrice?: number
    limit?: number
    offset?: number
}

const parseJson = (val: any): any[] => {
    if (Array.isArray(val)) return val
    if (typeof val === 'string') {
        try { return JSON.parse(val) } catch { return [] }
    }
    if (typeof val === 'object' && val !== null) return Object.values(val)
    return []
}

const formatHours = (minutes: number | null | undefined): string => {
    if (!minutes || minutes <= 0) return 'Durée flexible'
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) return `${hours}h`
    return `${hours}h ${remainingMinutes}min`
}

const LEARNING_PATH_LIST_FIELDS = `
    id,
    title,
    slug,
    description,
    short_description,
    thumbnail,
    image_url,
    level,
    language,
    format,
    access_type,
    one_time_price,
    monthly_price,
    registration_fee,
    installments,
    pricing_modes,
    one_time_discount,
    estimated_duration,
    organization_id,
    enable_certificate,
    certificate_template_id,
    status,
    marketplace:marketplace_learning_paths!inner(
        review_status,
        searchable,
        publication_mode,
        featured,
        rating,
        review_count,
        student_count,
        published_at
    ),
    learning_path_courses(course_id)
`

const LEARNING_PATH_DETAIL_FIELDS = `
    id,
    title,
    slug,
    description,
    short_description,
    thumbnail,
    image_url,
    level,
    language,
    format,
    access_type,
    prerequisites,
    objectives,
    expected_results,
    preview_video,
    one_time_price,
    monthly_price,
    registration_fee,
    installments,
    pricing_modes,
    one_time_discount,
    estimated_duration,
    organization_id,
    enable_certificate,
    certificate_template_id,
    status,
    marketplace:marketplace_learning_paths!inner(
        review_status,
        searchable,
        publication_mode,
        featured,
        rating,
        review_count,
        student_count,
        published_at
    ),
    learning_path_courses(
        sequence_order,
        is_mandatory,
        course:courses(
            id,
            title,
            slug,
            description,
            thumbnail,
            level,
            duration
        )
    )
`

export const LearningPathService = {
    formatDuration: formatHours,

    mapLearningPathItem(item: any): LearningPath {
        const isFree = item.access_type === 'free'

        let pricingModes = item.pricing_modes
        if (typeof pricingModes === 'string') {
            try { pricingModes = JSON.parse(pricingModes) } catch { pricingModes = null }
        }

        const oneTimePrice = isFree ? null : (item.one_time_price ? Number(item.one_time_price) : null)

        const marketplace = Array.isArray(item.marketplace) ? item.marketplace[0] : item.marketplace
        const lpCourses = item.learning_path_courses || []

        const mappedCourses = lpCourses
            .filter((lpc: any) => lpc.course)
            .sort((a: any, b: any) => (a.sequence_order || 0) - (b.sequence_order || 0))
            .map((lpc: any) => ({
                id: lpc.course.id,
                title: lpc.course.title,
                slug: lpc.course.slug,
                description: lpc.course.description,
                duration: formatHours(lpc.course.duration),
                thumbnail: lpc.course.thumbnail,
                level: lpc.course.level,
                sequence_order: lpc.sequence_order || 0,
                is_mandatory: lpc.is_mandatory ?? true,
            }))

        const estimatedMinutes = item.estimated_duration ? Number(item.estimated_duration) : 0
        const hoursValue = estimatedMinutes > 0 ? Math.round(estimatedMinutes / 60) : 0

        return {
            id: item.id,
            title: item.title,
            slug: item.slug,
            description: item.description ?? null,
            short_description: item.short_description ?? null,
            image_url: item.thumbnail ?? item.image_url ?? null,
            price: oneTimePrice ?? 0,
            original_price: item.one_time_discount ? Number(item.one_time_discount) : null,
            currency: 'FCFA',
            hours: hoursValue,
            duration: formatHours(estimatedMinutes),
            projects_count: 0,
            courses_count: mappedCourses.length || lpCourses.length || 0,
            level: item.level ?? null,
            language: item.language ?? null,
            format: item.format ?? null,
            access_type: item.access_type ?? null,
            prerequisites: parseJson(item.prerequisites),
            objectives: parseJson(item.objectives),
            highlights: parseJson(item.expected_results),
            preview_video: item.preview_video ?? null,
            enable_certificate: !!item.enable_certificate,
            certificate_template_id: item.certificate_template_id ?? null,
            organization_id: item.organization_id ?? null,

            one_time_price: isFree ? null : oneTimePrice,
            monthly_price: isFree ? null : (item.monthly_price ? Number(item.monthly_price) : null),
            registration_fee: isFree ? null : (item.registration_fee ? Number(item.registration_fee) : null),
            installments: isFree ? [] : parseJson(item.installments),
            pricing_modes: isFree ? null : pricingModes,

            is_published: marketplace?.review_status === 'published' && item.status === 'published',
            is_featured: !!marketplace?.featured,
            publication_mode: marketplace?.publication_mode ?? null,
            rating: marketplace?.rating ? Number(marketplace.rating) : 0,
            reviewCount: marketplace?.review_count || 0,
            enrolled_count: marketplace?.student_count || 0,
            published_at: marketplace?.published_at || '',

            courses: mappedCourses.length ? mappedCourses : undefined,
        }
    },

    async getFeaturedLearningPaths(limit = 8): Promise<LearningPath[]> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('learning_paths')
            .select(LEARNING_PATH_LIST_FIELDS)
            .eq('status', 'published')
            .eq('marketplace.review_status', 'published')
            .eq('marketplace.searchable', true)
            .eq('marketplace.featured', true)
            // Exclure les parcours sur invitation (privés) — cf. visibilité cours.
            .or('access_type.is.null,access_type.neq.invitation')
            .order('featured_order', { foreignTable: 'marketplace_learning_paths', ascending: true, nullsFirst: false })
            .limit(limit)

        if (error) {
            console.error('Error fetching featured learning paths:', error)
            return []
        }

        return (data || []).map((item: any) => LearningPathService.mapLearningPathItem(item))
    },

    async searchLearningPaths(filters: LearningPathFilters): Promise<{ learningPaths: LearningPath[]; total: number }> {
        const supabase = createClient()
        const { searchTerm, level, language, minPrice, maxPrice, limit = 12, offset = 0 } = filters

        let query = supabase
            .from('learning_paths')
            .select(LEARNING_PATH_LIST_FIELDS, { count: 'exact' })
            .eq('status', 'published')
            .eq('marketplace.review_status', 'published')
            .eq('marketplace.searchable', true)
            .or('access_type.is.null,access_type.neq.invitation')

        if (searchTerm) query = query.ilike('title', `%${searchTerm}%`)
        if (level && level.length > 0) query = query.in('level', level)
        if (language) query = query.eq('language', language)
        if (minPrice !== undefined) query = query.gte('one_time_price', minPrice)
        if (maxPrice !== undefined) query = query.lte('one_time_price', maxPrice)

        const { data, error, count } = await query
            .range(offset, offset + limit - 1)
            .order('published_at', { foreignTable: 'marketplace_learning_paths', ascending: false })

        if (error) {
            console.error('Error searching learning paths:', error)
            return { learningPaths: [], total: 0 }
        }

        return {
            learningPaths: (data || []).map((item: any) => LearningPathService.mapLearningPathItem(item)),
            total: count || 0,
        }
    },

    async getAllLearningPaths(limit = 12): Promise<LearningPath[]> {
        const { learningPaths } = await LearningPathService.searchLearningPaths({ limit })
        return learningPaths
    },

    async getLearningPathBySlug(slug: string): Promise<LearningPath | null> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('learning_paths')
            .select(LEARNING_PATH_DETAIL_FIELDS)
            .eq('slug', slug)
            .eq('status', 'published')
            .eq('marketplace.review_status', 'published')
            .eq('marketplace.searchable', true)
            .or('access_type.is.null,access_type.neq.invitation')
            .maybeSingle()

        if (error) {
            console.error('Error fetching learning path by slug:', error)
            return null
        }
        if (!data) return null

        return LearningPathService.mapLearningPathItem(data)
    },

    async getLearningPathById(id: string): Promise<LearningPath | null> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('learning_paths')
            .select(LEARNING_PATH_DETAIL_FIELDS)
            .eq('id', id)
            .eq('status', 'published')
            .eq('marketplace.review_status', 'published')
            .eq('marketplace.searchable', true)
            .or('access_type.is.null,access_type.neq.invitation')
            .maybeSingle()

        if (error) {
            console.error('Error fetching learning path by id:', error)
            return null
        }
        if (!data) return null

        return LearningPathService.mapLearningPathItem(data)
    },
}
