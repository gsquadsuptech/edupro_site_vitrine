import { createClient } from '@/lib/supabase/client'
import { Course, Cohort, CohortAvailability } from '@/lib/supabase/types'

export function getCohortAvailability(cohort: Cohort): CohortAvailability {
    const now = new Date()
    const isDeadlinePassed = cohort.registration_deadline
        ? new Date(cohort.registration_deadline) < now
        : false
    const remainingPlaces = cohort.max_students != null
        ? cohort.max_students - cohort.current_students_count
        : null
    const isFull = remainingPlaces != null && remainingPlaces <= 0
    const isOpen = !isDeadlinePassed && !isFull

    return { isOpen, isFull, isDeadlinePassed, remainingPlaces }
}

export type CourseSort = 'recent' | 'price_asc' | 'price_desc' | 'popular' | 'rating'

export interface CourseFilters {
    searchTerm?: string
    category?: string
    minPrice?: number
    maxPrice?: number
    level?: string[]
    sort?: CourseSort
    limit?: number
    offset?: number
}

// ---------------------------------------------------------------------------
// Champs sélectionnés (fragments partagés) — évite les divergences entre
// requêtes et garantit que la visibilité / l'institut / le compteur d'inscrits
// sont disponibles partout.
// ---------------------------------------------------------------------------
const ORG_EMBED = `organization:organizations(id, name, logo_url, description, website_url)`
const COHORTS_EMBED = `cohorts(one_time_price, monthly_price, status, use_course_price, cohort_participants(count))`

const COURSE_CARD_FIELDS = `
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
    access_type,
    created_at,
    organization_id,
    category:categories(name, slug),
    instructor:instructors(name, avatar_url, organization:organizations(name)),
    ${ORG_EMBED},
    marketplace:marketplace_courses!inner(featured, rating, review_count, student_count, category_id),
    ${COHORTS_EMBED}
`

// Variante avec category en INNER JOIN — requise quand on filtre par
// `category.slug` (cours similaires / recommandés), sinon le filtre embarqué
// n'exclut pas les lignes parentes.
const COURSE_CARD_FIELDS_CAT_INNER = COURSE_CARD_FIELDS.replace(
    'category:categories(name, slug)',
    'category:categories!inner(name, slug)'
)

const COURSE_DETAIL_FIELDS = `
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
    access_type,
    preview_video,
    expected_results,
    objectives,
    prerequisites,
    created_at,
    organization_id,
    category:categories(name, slug),
    instructor:instructors(name, avatar_url, bio, specialization, rating, students_count, courses_count, organization_id, organization:organizations(name, logo_url)),
    ${ORG_EMBED},
    marketplace:marketplace_courses(featured, rating, review_count, student_count, searchable, review_status),
    ${COHORTS_EMBED},
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
`

/**
 * Filtres de visibilité publique appliqués à TOUTES les requêtes catalogue :
 * - cours publié
 * - entrée marketplace "searchable" et "published" (dépublication / archivage)
 * - exclusion des cours sur invitation (privés)
 *
 * Nécessite que le select utilise `marketplace:marketplace_courses!inner(...)`.
 */
function applyCourseVisibility<T>(query: T): T {
    return (query as any)
        .eq('status', 'published')
        .eq('marketplace.searchable', true)
        .eq('marketplace.review_status', 'published')
        // access_type peut être NULL (anciens cours) → on garde ceux non-invitation
        .or('access_type.is.null,access_type.neq.invitation') as T
}

const parseJson = (val: any): any[] => {
    if (Array.isArray(val)) return val
    if (typeof val === 'string') {
        try { return JSON.parse(val) } catch { return [] }
    }
    if (typeof val === 'object' && val !== null) return Object.values(val)
    return []
}

export const CourseService = {
    formatDuration(minutes: number | null | undefined): string {
        if (!minutes || minutes <= 0) return 'Durée flexible'
        if (minutes < 60) return `${minutes} min`
        const hours = Math.floor(minutes / 60)
        const remainingMinutes = minutes % 60
        if (remainingMinutes === 0) return `${hours}h`
        return `${hours}h ${remainingMinutes}min`
    },

    async searchCourses(filters: CourseFilters): Promise<{ courses: Course[], total: number }> {
        const supabase = createClient()
        const { searchTerm, category, minPrice, maxPrice, level, sort = 'recent', limit = 12, offset = 0 } = filters

        let marketplaceCategoryId: string | null = null
        if (category && category !== 'all') {
            const { data: mcat } = await supabase
                .from('marketplace_categories')
                .select('id')
                .eq('slug', category)
                .maybeSingle()
            if (!mcat) {
                return { courses: [], total: 0 }
            }
            marketplaceCategoryId = (mcat as any).id
        }

        let query = supabase
            .from('courses')
            .select(COURSE_CARD_FIELDS, { count: 'exact' })

        query = applyCourseVisibility(query)

        if (searchTerm) {
            query = query.ilike('title', `%${searchTerm}%`)
        }

        if (marketplaceCategoryId) {
            query = query.eq('marketplace.category_id', marketplaceCategoryId)
        }

        if (minPrice !== undefined) {
            query = query.gte('price', minPrice)
        }

        if (maxPrice !== undefined) {
            query = query.lte('price', maxPrice)
        }

        if (level && level.length > 0) {
            query = query.in('level', level)
        }

        // Tri
        switch (sort) {
            case 'price_asc':
                query = query.order('price', { ascending: true, nullsFirst: true })
                break
            case 'price_desc':
                query = query.order('price', { ascending: false, nullsFirst: false })
                break
            case 'popular':
                query = query.order('student_count', { foreignTable: 'marketplace_courses', ascending: false, nullsFirst: false })
                break
            case 'rating':
                query = query.order('rating', { foreignTable: 'marketplace_courses', ascending: false, nullsFirst: false })
                break
            case 'recent':
            default:
                query = query.order('created_at', { ascending: false })
                break
        }

        // Clé de tri secondaire déterministe : évite les doublons/sauts de la
        // pagination OFFSET lorsque la colonne de tri primaire a des ex-aequo.
        query = query.order('id', { ascending: true })

        const { data, error, count } = await query.range(offset, offset + limit - 1)

        if (error) {
            console.error('Error searching courses:', error)
            return { courses: [], total: 0 }
        }

        const courses = data.map((item: any) => CourseService.mapCourseWithPricing(item))

        return { courses, total: count || 0 }
    },

    /**
     * Résout l'objet "instructor" affiché. Si aucun formateur n'est assigné,
     * on retombe sur l'INSTITUT propriétaire du cours (organisation) avec un
     * drapeau is_institute pour adapter les libellés côté UI.
     */
    resolveInstructor(item: any): Course['instructor'] {
        const org = item.organization || item.instructor?.organization || null

        if (item.instructor) {
            return {
                name: item.instructor.name,
                avatar_url: item.instructor.avatar_url,
                institute: item.instructor.organization?.name || org?.name || null,
                is_institute: false,
            }
        }

        if (org) {
            return {
                name: org.name,
                avatar_url: org.logo_url || null,
                institute: org.name,
                is_institute: true,
            }
        }

        return null
    },

    /** Nombre réel d'inscrits : pour les cours à cohortes = Σ participants. */
    resolveEnrolledCount(item: any): number {
        if (item.format === 'session' && Array.isArray(item.cohorts)) {
            return item.cohorts
                .filter((c: any) => c.status === 'active' || c.status === 'published')
                .reduce((acc: number, c: any) => acc + (c.cohort_participants?.[0]?.count || 0), 0)
        }
        return item.marketplace?.student_count || 0
    },

    mapCourseItem(item: any): Course {
        const isFree = item.access_type === 'free';

        const oneTimePrice = isFree ? null : (item.one_time_price ? Number(item.one_time_price) : null);
        const legacyPrice = isFree ? 0 : (item.price ? Number(item.price) : 0);

        let displayPrice = 0;

        if (!isFree) {
            displayPrice = (legacyPrice <= 0 && oneTimePrice && oneTimePrice > 0) ? oneTimePrice : legacyPrice;

            if (displayPrice <= 0) {
                const monthlyPrice = item.monthly_price ? Number(item.monthly_price) : 0;
                const registrationFee = item.registration_fee ? Number(item.registration_fee) : 0;
                const monthlyFee = item.monthly_fee ? Number(item.monthly_fee) : 0;
                if (monthlyPrice > 0) displayPrice = monthlyPrice;
                else if (registrationFee > 0) displayPrice = registrationFee;
                else if (monthlyFee > 0) displayPrice = monthlyFee;
            }
        }

        let pricingModes = item.pricing_modes;
        if (typeof pricingModes === 'string') {
            try {
                pricingModes = JSON.parse(pricingModes);
            } catch (e) {
                pricingModes = null;
            }
        }

        const org = item.organization || null

        return {
            id: item.id,
            format: item.format,
            access_type: item.access_type || null,
            title: item.title,
            slug: item.slug,
            description: item.description,
            image_url: item.thumbnail,
            price: displayPrice,
            original_price: item.one_time_discount ? Number(item.one_time_discount) : null,
            currency: 'FCFA',
            duration: CourseService.formatDuration(item.duration),
            level: item.level,

            one_time_price: isFree ? null : oneTimePrice,
            monthly_price: isFree ? null : (item.monthly_price ? Number(item.monthly_price) : null),
            registration_fee: isFree ? null : (item.registration_fee ? Number(item.registration_fee) : null),
            monthly_fee: isFree ? null : (item.monthly_fee ? Number(item.monthly_fee) : null),
            installments: isFree ? [] : (item.installments || []),
            pricing_modes: isFree ? null : pricingModes,

            is_featured: item.marketplace?.featured || false,
            rating: item.marketplace?.rating ? Number(item.marketplace.rating) : 0,
            reviewCount: item.marketplace?.review_count || 0,
            enrolled_count: CourseService.resolveEnrolledCount(item),
            is_published: item.status === 'published',
            published_at: item.created_at,
            category: item.category,
            organization: org ? {
                id: org.id,
                name: org.name,
                logo_url: org.logo_url || null,
                description: org.description || null,
                website_url: org.website_url || null,
            } : null,
            instructor: CourseService.resolveInstructor(item),
        }
    },

    mapCourseWithPricing(item: any): Course {
        const baseCourse = CourseService.mapCourseItem(item);

        if (baseCourse.access_type === 'free') {
            return baseCourse;
        }

        const cohorts = (item.cohorts || []).filter((c: any) => c.status === 'active' || c.status === 'published');

        if (baseCourse.format === 'session' && cohorts.length > 0) {
            const cohortPrices = cohorts
                .map((c: any) => {
                    if (c.use_course_price) return baseCourse.one_time_price || baseCourse.price || 0;
                    return c.one_time_price ? Number(c.one_time_price) : 0;
                })
                .filter((p: number) => p > 0);

            if (cohortPrices.length > 0) {
                const minPrice = Math.min(...cohortPrices);
                const maxPrice = Math.max(...cohortPrices);

                baseCourse.price = minPrice;
                baseCourse.lowest_price = minPrice;
                baseCourse.has_varying_prices = minPrice < maxPrice;
            }
        }

        return baseCourse;
    },

    async getFeaturedCourses(): Promise<Course[]> {
        const supabase = createClient()

        // "À la une" = toggle "Vedette" (featured) coché par le superadmin
        const { data: featuredData, error: featuredError } = await supabase
            .from('marketplace_courses')
            .select('course_id, featured, featured_order, rating, review_count')
            .eq('featured', true)
            .eq('searchable', true)
            .eq('review_status', 'published')
            .order('featured_order', { ascending: true, nullsFirst: false })
            .limit(8)

        if (featuredError) {
            console.error('Error fetching featured IDs:', featuredError)
            return []
        }

        const featuredIds = featuredData?.map((item: any) => item.course_id) || []

        if (featuredIds.length === 0) {
            return []
        }

        let query = supabase
            .from('courses')
            .select(COURSE_CARD_FIELDS)
            .in('id', featuredIds)

        query = applyCourseVisibility(query)

        const { data, error } = await query.limit(featuredIds.length)

        if (error) {
            console.error('Error fetching featured courses:', error)
            return []
        }

        // Respecter l'ordre de mise en avant (featured_order) défini par le
        // superadmin : .in() ne préserve pas l'ordre du tableau d'ids.
        const ordered = featuredIds
            .map((id: string) => data.find((d: any) => d.id === id))
            .filter(Boolean)

        return ordered.map((item: any) => CourseService.mapCourseWithPricing(item))
    },

    async getAllCourses(limit = 12): Promise<Course[]> {
        const supabase = createClient()

        let query = supabase
            .from('courses')
            .select(COURSE_CARD_FIELDS)

        query = applyCourseVisibility(query)

        const { data, error } = await query
            .limit(limit)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching courses:', error)
            return []
        }

        return data.map((item: any) => CourseService.mapCourseWithPricing(item))
    },

    async getCoursesByCategory(categorySlug: string): Promise<Course[]> {
        const supabase = createClient()

        const { data: mcat } = await supabase
            .from('marketplace_categories')
            .select('id')
            .eq('slug', categorySlug)
            .maybeSingle()

        if (!mcat) {
            return []
        }

        let query = supabase
            .from('courses')
            .select(COURSE_CARD_FIELDS)

        query = applyCourseVisibility(query)
            .eq('marketplace.category_id', (mcat as any).id)

        const { data, error } = await query.order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching courses by category:', error)
            return []
        }

        return data.map((item: any) => CourseService.mapCourseWithPricing(item))
    },

    /** Construit le bloc instructor/institut enrichi pour la page détail. */
    buildDetailInstructor(item: any, baseInstructor: Course['instructor']): Course['instructor'] {
        if (!baseInstructor) return null
        const org = item.organization || item.instructor?.organization || null

        if (baseInstructor.is_institute) {
            // Institut : on s'appuie sur les infos de l'organisation
            return {
                ...baseInstructor,
                role: 'Institute',
                bio: org?.description || null,
                website_url: org?.website_url || null,
                organization_id: item.organization_id || org?.id || null,
            }
        }

        return {
            ...baseInstructor,
            role: 'Instructor',
            bio: item.instructor?.bio || null,
            specialization: item.instructor?.specialization || null,
            rating: item.instructor?.rating || 0,
            students_count: item.instructor?.students_count || 0,
            courses_count: item.instructor?.courses_count || 0,
            organization_id: item.instructor?.organization_id || null,
        }
    },

    mapCourseDetail(item: any, reviews: any[]): Course {
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
                    duration: CourseService.formatDuration(les.duration),
                    // L'URL n'est exposée que pour les leçons en aperçu gratuit ;
                    // elle est injectée plus tard (getCourseBySlug) via une requête
                    // restreinte aux leçons is_preview.
                    video_url: null,
                    is_preview: les.is_preview || false,
                    type: les.type || 'video'
                }))
            }
        })

        const baseCourse = CourseService.mapCourseWithPricing(item)

        return {
            ...baseCourse,
            rating: item.marketplace?.rating || 0,
            reviewCount: item.marketplace?.review_count || reviews.length,
            enrolled_count: baseCourse.enrolled_count,
            duration: CourseService.formatDuration(item.duration),
            highlights: parseJson(item.expected_results),
            objectives: parseJson(item.objectives),
            prerequisites: parseJson(item.prerequisites),
            preview_video: item.preview_video || null,
            sections,
            reviews,
            instructor: CourseService.buildDetailInstructor(item, baseCourse.instructor),
        }
    },

    /**
     * Un cours non visible publiquement ne doit pas être servi sur la vitrine.
     * Doit refléter EXACTEMENT la visibilité du catalogue (applyCourseVisibility) :
     * une entrée marketplace publiée + searchable est requise. Un cours publié
     * sans entrée marketplace (ou non-searchable / non-published) est masqué du
     * catalogue ; il doit donc aussi renvoyer 404 en accès direct par slug.
     */
    isPubliclyVisible(item: any): boolean {
        if (!item) return false
        if (item.access_type === 'invitation') return false
        const mk = Array.isArray(item.marketplace) ? item.marketplace[0] : item.marketplace
        if (!mk) return false
        if (mk.searchable !== true) return false
        if (mk.review_status !== 'published') return false
        return true
    },

    /** Injecte l'URL vidéo des leçons en aperçu gratuit (requête restreinte). */
    async attachPreviewUrls(course: Course): Promise<void> {
        const previewIds = (course.sections || [])
            .flatMap(s => s.lessons.filter(l => l.is_preview).map(l => l.id))
        if (previewIds.length === 0) return

        const supabase = createClient()
        const { data, error } = await supabase
            .from('lessons')
            .select('id, content')
            .in('id', previewIds)

        if (error || !data) return

        const urlById = new Map<string, string | null>()
        for (const row of data as any[]) {
            const content = row.content || {}
            urlById.set(row.id, content.url || content.video_url || content.videoUrl || null)
        }

        for (const section of course.sections || []) {
            for (const lesson of section.lessons) {
                if (lesson.is_preview) {
                    lesson.video_url = urlById.get(lesson.id) || null
                }
            }
        }
    },

    async getCourseById(id: string): Promise<Course | null> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('courses')
            .select(COURSE_DETAIL_FIELDS)
            .eq('id', id)
            .eq('status', 'published')
            .single()

        if (error) {
            console.error('Error fetching course by id:', error)
            return null
        }

        const item = data as any
        if (!CourseService.isPubliclyVisible(item)) return null

        const { data: reviewsData } = await supabase
            .from('course_reviews')
            .select('*')
            .eq('course_id', item.id)
            .order('created_at', { ascending: false })
            .limit(5)

        const reviews = reviewsData?.map((r: any) => ({
            id: r.id,
            user: { name: 'Étudiant', avatar_url: null },
            rating: r.rating,
            comment: r.comment,
            created_at: r.created_at,
            date: r.created_at,
            helpful: 0
        })) || []

        const course = CourseService.mapCourseDetail(item, reviews)
        await CourseService.attachPreviewUrls(course)
        return course
    },

    async getCourseBySlug(slug: string): Promise<Course | null> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('courses')
            .select(COURSE_DETAIL_FIELDS)
            .eq('slug', slug)
            .eq('status', 'published')
            .single()

        if (error) {
            console.error('Error fetching course by slug:', error)
            return null
        }

        const item = data as any
        if (!CourseService.isPubliclyVisible(item)) return null

        const { data: reviewsData } = await supabase
            .from('course_reviews')
            .select(`
                *,
                user:profiles(full_name, avatar_url)
            `)
            .eq('course_id', item.id)
            .order('created_at', { ascending: false })
            .limit(10)

        const reviews = reviewsData?.map((r: any) => ({
            id: r.id,
            user: {
                name: r.user?.full_name || 'Étudiant',
                avatar_url: r.user?.avatar_url || null
            },
            rating: r.rating,
            comment: r.comment,
            location: r.location || "En ligne",
            date: new Date(r.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
            helpful: r.helpful_count || 0,
            created_at: r.created_at
        })) || []

        const course = CourseService.mapCourseDetail(item, reviews)
        await CourseService.attachPreviewUrls(course)
        return course
    },

    async getRelatedCourses(categorySlug: string, excludeCourseId: string, organizationId?: string | null): Promise<Course[]> {
        const supabase = createClient()
        const limit = 4;
        let courses: any[] = [];

        // 1. Cours du même institut (organisation)
        if (organizationId) {
            let instQuery = supabase
                .from('courses')
                .select(COURSE_CARD_FIELDS)
                .eq('organization_id', organizationId)
                .neq('id', excludeCourseId)

            instQuery = applyCourseVisibility(instQuery)

            const { data: instituteCourses, error: instError } = await instQuery
                .limit(limit)
                .order('created_at', { ascending: false });

            if (!instError && instituteCourses) {
                courses = [...instituteCourses];
            }
        }

        // 2. Compléter avec des cours de la même catégorie
        if (courses.length < limit) {
            const needed = limit - courses.length;
            const existingIds = courses.map(c => c.id);
            existingIds.push(excludeCourseId);

            let catQuery = supabase
                .from('courses')
                .select(COURSE_CARD_FIELDS_CAT_INNER)
                .eq('category.slug', categorySlug)

            catQuery = applyCourseVisibility(catQuery)
                .not('id', 'in', `(${existingIds.join(',')})`)

            const { data: categoryCourses, error: catError } = await catQuery
                .limit(needed)
                .order('created_at', { ascending: false });

            if (!catError && categoryCourses) {
                courses = [...courses, ...categoryCourses];
            }
        }

        return courses.map((item: any) => CourseService.mapCourseWithPricing(item))
    },

    /**
     * Recommandations via l'endpoint SaaS `GET /api/marketplace/courses/:id/similar`
     * (public, déjà filtré published+searchable+non-invitation). Mappe la réponse
     * minimale (course_id/thumbnail/…) vers le shape attendu par les cartes.
     * Renvoie [] en cas d'erreur → l'appelant peut retomber sur getRelatedCourses.
     */
    async getSimilarCoursesFromApi(courseId: string, limit = 4): Promise<Course[]> {
        const base = process.env.NEXT_PUBLIC_SAAS_URL
        if (!base) return []

        try {
            const res = await fetch(`${base}/api/marketplace/courses/${courseId}/similar?limit=${limit}`, {
                next: { revalidate: 300 },
            })
            if (!res.ok) return []
            const json = await res.json().catch(() => ({}))
            const rows: any[] = json?.courses || []

            return rows.map((r: any) => {
                const institute = r.organization_name || null
                const price = Number(r.one_time_price || r.price || 0)
                return {
                    id: r.course_id,
                    title: r.title,
                    slug: r.slug,
                    description: null,
                    image_url: r.thumbnail || null,
                    price,
                    original_price: null,
                    currency: 'FCFA',
                    duration: null,
                    level: r.level ?? null,
                    format: r.format ?? null,
                    access_type: null,
                    category: null,
                    organization: institute ? { id: r.organization_id, name: institute, logo_url: null, description: null, website_url: null } : null,
                    instructor: institute
                        ? { name: institute, avatar_url: null, institute, is_institute: true }
                        : null,
                    one_time_price: r.one_time_price ? Number(r.one_time_price) : null,
                    monthly_price: null,
                    registration_fee: null,
                    monthly_fee: null,
                    installments: [],
                    pricing_modes: null,
                    is_featured: false,
                    is_published: true,
                    published_at: '',
                    rating: r.rating ? Number(r.rating) : 0,
                    reviewCount: 0,
                    enrolled_count: r.student_count || 0,
                } as Course
            })
        } catch (err) {
            console.error('Error fetching similar courses from API:', err)
            return []
        }
    },

    async getSimilarCourses(categorySlug: string, excludeCourseId: string): Promise<Course[]> {
        const supabase = createClient()

        let query = supabase
            .from('courses')
            .select(COURSE_CARD_FIELDS_CAT_INNER)
            .eq('category.slug', categorySlug)
            .neq('id', excludeCourseId)

        query = applyCourseVisibility(query)

        const { data, error } = await query
            .limit(4)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching similar courses:', error)
            return []
        }

        return data.map((item: any) => CourseService.mapCourseWithPricing(item))
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
                enable_waitlist,
                allow_waitlist,
                one_time_price,
                monthly_price,
                registration_fee,
                monthly_fee,
                installments,
                use_course_price,
                cohort_participants(count),
                cohort_instructors(instructor:instructors(name, avatar_url))
            `)
            .eq('course_id', courseId)
            .in('status', ['active', 'published'])

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
            current_students_count: item.cohort_participants?.[0]?.count || 0,
            enable_waitlist: item.enable_waitlist || item.allow_waitlist || false,
            pricing_modes: item.pricing_modes,
            one_time_price: item.one_time_price ? Number(item.one_time_price) : null,
            monthly_price: item.monthly_price ? Number(item.monthly_price) : null,
            registration_fee: item.registration_fee ? Number(item.registration_fee) : null,
            monthly_fee: item.monthly_fee ? Number(item.monthly_fee) : null,
            installments: parseJson(item.installments),
            use_course_price: item.use_course_price || false,
            instructors: (item.cohort_instructors || [])
                .map((ci: any) => ci.instructor)
                .filter(Boolean)
                .map((ins: any) => ({ name: ins.name, avatar_url: ins.avatar_url || null })),
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
                if (error.code === '23505') { // Unique violation
                    return { success: true };
                }
                console.error('Error adding to waitlist:', {
                    message: error.message,
                    code: error.code,
                    details: error.details,
                    hint: error.hint,
                    courseId,
                    userId
                });
                return { success: false, error };
            }

            return { success: true };
        } catch (err) {
            console.error('Exception adding to waitlist:', err);
            return { success: false, error: err };
        }
    }
}
