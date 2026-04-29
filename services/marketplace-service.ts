import { Course, LearningPath, MarketplaceItem } from '@/lib/supabase/types'
import { CourseService, CourseFilters } from './course-service'
import { LearningPathService, LearningPathFilters } from './learning-path-service'

export interface MarketplaceListFilters {
    type?: 'course' | 'learning_path' | 'all'
    searchTerm?: string
    level?: string[]
    minPrice?: number
    maxPrice?: number
    category?: string  // courses only — categories taxonomy ne s'applique pas encore aux LP
    limit?: number
    offset?: number
}

const courseSortDate = (c: Course): string => c.published_at || ''
const lpSortDate = (lp: LearningPath): string => lp.published_at || ''

export const MarketplaceService = {
    async listMarketplaceItems(filters: MarketplaceListFilters = {}): Promise<{ items: MarketplaceItem[]; total: number }> {
        const { type = 'all', limit = 12, offset = 0 } = filters

        const courseFilters: CourseFilters = {
            searchTerm: filters.searchTerm,
            category: filters.category,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            level: filters.level,
            limit,
            offset,
        }
        const lpFilters: LearningPathFilters = {
            searchTerm: filters.searchTerm,
            level: filters.level,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            limit,
            offset,
        }

        if (type === 'course') {
            const { courses, total } = await CourseService.searchCourses(courseFilters)
            return {
                items: courses.map((data) => ({ kind: 'course' as const, data })),
                total,
            }
        }

        if (type === 'learning_path') {
            const { learningPaths, total } = await LearningPathService.searchLearningPaths(lpFilters)
            return {
                items: learningPaths.map((data) => ({ kind: 'learning_path' as const, data })),
                total,
            }
        }

        const [coursesRes, lpRes] = await Promise.all([
            CourseService.searchCourses(courseFilters),
            LearningPathService.searchLearningPaths(lpFilters),
        ])

        const courseItems: MarketplaceItem[] = coursesRes.courses.map((data) => ({ kind: 'course' as const, data }))
        const lpItems: MarketplaceItem[] = lpRes.learningPaths.map((data) => ({ kind: 'learning_path' as const, data }))

        const merged = [...courseItems, ...lpItems].sort((a, b) => {
            const dateA = a.kind === 'course' ? courseSortDate(a.data) : lpSortDate(a.data)
            const dateB = b.kind === 'course' ? courseSortDate(b.data) : lpSortDate(b.data)
            return dateB.localeCompare(dateA)
        })

        return { items: merged.slice(0, limit), total: coursesRes.total + lpRes.total }
    },

    async getFeaturedItems(limit = 8): Promise<MarketplaceItem[]> {
        const [courses, learningPaths] = await Promise.all([
            CourseService.getFeaturedCourses(),
            LearningPathService.getFeaturedLearningPaths(limit),
        ])

        const courseItems: MarketplaceItem[] = courses.map((data) => ({ kind: 'course' as const, data }))
        const lpItems: MarketplaceItem[] = learningPaths.map((data) => ({ kind: 'learning_path' as const, data }))

        const merged = [...courseItems, ...lpItems].sort((a, b) => {
            const dateA = a.kind === 'course' ? courseSortDate(a.data) : lpSortDate(a.data)
            const dateB = b.kind === 'course' ? courseSortDate(b.data) : lpSortDate(b.data)
            return dateB.localeCompare(dateA)
        })

        return merged.slice(0, limit)
    },
}
