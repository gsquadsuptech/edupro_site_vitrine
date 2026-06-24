export type Course = {
    id: string
    title: string
    slug: string
    description: string | null
    image_url: string | null // mapped from thumbnail
    price: number | null
    original_price: number | null
    currency: string
    duration: string | null // mapped from duration (int minutes) -> string
    level: string | null
    format: 'auto-formation' | 'session' | null // Added format field
    access_type?: 'free' | 'paid' | string | null
    rating?: number
    reviewCount?: number
    enrolled_count?: number
    category: {
        name: string
        slug: string
    } | null
    /**
     * Catégorie MARKETPLACE du cours (table marketplace_categories), distincte de
     * `category` qui vient de la table `categories`. C'est CELLE-CI qui pilote le
     * filtre du catalogue et les recommandations — l'utiliser pour tout lien vers
     * `/catalogue/all?category=<slug>`.
     */
    marketplace_category?: {
        name: string
        slug: string
    } | null
    instructor: {
        name: string
        avatar_url: string | null
        role?: string
        institute?: string | null
        /** true quand le "formateur" affiché est en réalité l'institut propriétaire (aucun formateur assigné). */
        is_institute?: boolean
        bio?: string | null
        specialization?: string | null
        website_url?: string | null
        courses_count?: number
        students_count?: number
        rating?: number
        organization_id?: string | null
    } | null
    /** Institut (organisation) propriétaire du cours. */
    organization?: {
        id: string
        name: string
        logo_url: string | null
        description: string | null
        website_url: string | null
    } | null
    highlights?: string[]
    objectives?: string[]
    prerequisites?: string[]
    preview_video?: string | null
    is_featured: boolean // mapped from marketplace_courses.featured
    is_published?: boolean
    published_at: string
    one_time_price: number | null
    monthly_price: number | null
    registration_fee: number | null
    monthly_fee: number | null
    installments: any[] | null
    pricing_modes: {
        one_time: boolean
        installments: boolean
        subscription: boolean
        registration_monthly: boolean
    } | null
    sections?: Section[]
    reviews?: {
        id: string
        rating: number
        comment: string
        created_at: string
        date: string
        location?: string
        helpful: number
        user: {
            name: string
            avatar_url: string | null
        }
    }[]
    has_varying_prices?: boolean
    lowest_price?: number
}

export type Lesson = {
    id: string
    title: string
    slug: string
    duration: string
    video_url: string | null
    // HTML de l'article, injecté uniquement pour les leçons en aperçu gratuit
    // de type 'article' (cf. attachPreviewUrls). Rendu en iframe sandboxée.
    article_html: string | null
    is_preview: boolean
    type: 'video' | 'article' | 'quiz' | 'project'
}

export type Section = {
    id: string
    title: string
    sort_order: number
    lessons: Lesson[]
}

export type Category = {
    id: string
    name: string
    slug: string
    description: string | null
    icon: string | null
    /** Image de fond de catégorie (gérée depuis le superadmin marketplace). */
    image_url?: string | null
    courses_count?: number
}

export type LearningPath = {
    id: string
    title: string
    slug: string
    description: string | null
    price: number // mapped from one_time_price
    original_price: number | null
    hours: number // mapped from estimated_duration (minutes -> hours)
    projects_count: number
    courses_count: number
    highlights: string[] | null // mapped from expected_results
    is_published: boolean // mapped from marketplace_learning_paths.review_status === 'published' && status === 'published'

    // Étendu pour le marketplace (Phase 1) — optionnels pour compat skill-pack-service legacy
    short_description?: string | null
    image_url?: string | null
    currency?: string
    duration?: string | null
    level?: string | null
    language?: string | null
    format?: string | null
    access_type?: 'free' | 'paid' | string | null
    prerequisites?: string[] | null
    objectives?: string[] | null
    preview_video?: string | null
    enable_certificate?: boolean
    certificate_template_id?: string | null
    organization_id?: string | null

    one_time_price?: number | null
    monthly_price?: number | null
    registration_fee?: number | null
    installments?: any[] | null
    pricing_modes?: {
        one_time: boolean
        installments: boolean
        subscription: boolean
        registration_monthly: boolean
    } | null

    is_featured?: boolean
    publication_mode?: string | null
    rating?: number
    reviewCount?: number
    enrolled_count?: number
    published_at?: string
    /** Nom de l'institut (organisation) propriétaire du parcours. */
    institute?: string | null

    courses?: {
        id: string
        title: string
        slug?: string
        description: string | null
        duration: string | null
        thumbnail: string | null
        level: string | null
        sequence_order: number
        is_mandatory?: boolean
    }[]
    instructors?: {
        name: string
        avatar_url: string | null
        institute?: string | null
    }[]
    /**
     * Catégories marketplace du parcours, lues via la jonction
     * `marketplace_learning_path_categories` (un parcours peut en avoir N).
     */
    categories?: {
        id: string
        name: string
        slug?: string
    }[]
}

export type MarketplaceItem =
    | { kind: 'course'; data: Course }
    | { kind: 'learning_path'; data: LearningPath }

export type Cohort = {
    id: string
    name: string
    description: string | null
    start_date: string
    end_date: string
    registration_deadline: string | null
    status: 'active' | 'published' | 'draft' | 'completed' | 'archived'
    max_students: number | null
    current_students_count: number
    enable_waitlist: boolean
    pricing_modes?: any
    one_time_price: number | null
    monthly_price: number | null
    registration_fee: number | null
    monthly_fee: number | null
    installments: any[] | null
    use_course_price: boolean | null
    // Relations
    instructors?: { name: string; avatar_url: string | null }[]
    sessions?: CohortSession[]
}

export type CohortAvailability = {
    isOpen: boolean
    isFull: boolean
    isDeadlinePassed: boolean
    remainingPlaces: number | null
}

export type CohortSession = {
    id: string
    cohort_id: string
    day: string
    start_time: string
    end_time: string
}
