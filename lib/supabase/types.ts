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
    rating?: number
    reviewCount?: number
    category: {
        name: string
        slug: string
    } | null
    instructor: {
        name: string
        avatar_url: string | null
        role?: string
    } | null
    highlights?: string[]
    objectives?: string[]
    prerequisites?: string[]
    preview_video?: string | null
    is_featured: boolean // mapped from marketplace_courses.featured
    is_published?: boolean
    published_at: string
    sections?: Section[]
    reviews?: {
        id: string
        rating: number
        comment: string
        created_at: string
        user: {
            name: string
            avatar_url: string | null
        }
    }[]
}

export type Lesson = {
    id: string
    title: string
    slug: string
    duration: string
    video_url: string | null
    is_preview: boolean
    type: 'video' | 'quiz' | 'project'
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
    courses_count?: number
}

export type LearningPath = {
    id: string
    title: string
    slug: string
    description: string | null
    price: number // mapped from one_time_price
    original_price: number | null
    hours: number // mapped from estimated_duration
    projects_count: number // placeholder or count from relations
    courses_count: number // placeholder or count from relations
    highlights: string[] | null // mapped from expected_results (JSON)
    is_published: boolean // mapped from status === 'published'
    courses?: {
        id: string
        title: string
        description: string | null
        duration: string | null
        thumbnail: string | null
        level: string | null
        sequence_order: number
    }[]
}
