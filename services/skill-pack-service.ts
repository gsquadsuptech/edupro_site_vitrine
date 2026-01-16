import { createClient } from '@/lib/supabase/client'
import { LearningPath } from '@/lib/supabase/types'

export const SkillPackService = {
    async getAllSkillPacks(): Promise<LearningPath[]> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('learning_paths')
            .select('*')
            .eq('status', 'published')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching skill packs:', error)
            return []
        }

        return data.map((item: any) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            description: item.description,
            price: item.one_time_price || 0,
            original_price: null,
            hours: item.estimated_duration ? Math.round(item.estimated_duration / 60) : 0, // minutes to hours
            projects_count: 0, // TODO: Count actual projects
            courses_count: 0, // TODO: Count actual courses
            highlights: Array.isArray(item.expected_results) ? item.expected_results : [],
            is_published: item.status === 'published'
        }))
    },

    async getSkillPackBySlug(slug: string): Promise<LearningPath | null> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('learning_paths')
            .select(`
                *,
                items:learning_path_courses(
                    sequence_order,
                    course:courses(
                        id,
                        title,
                        description,
                        duration,
                        thumbnail,
                        level
                    )
                )
            `)
            .eq('slug', slug)
            .eq('status', 'published')
            .single()

        if (error) {
            console.error('Error fetching skill pack by slug:', error)
            return null
        }

        const item = data as any

        // Map courses
        const courses = item.items?.map((p: any) => ({
            id: p.course.id,
            title: p.course.title,
            description: p.course.description,
            duration: p.course.duration ? `${Math.round(p.course.duration / 60)}h` : 'N/A', // approximate to hours
            raw_duration: p.course.duration || 0,
            thumbnail: p.course.thumbnail,
            level: p.course.level,
            sequence_order: p.sequence_order
        })).sort((a: any, b: any) => a.sequence_order - b.sequence_order) || []

        // Calculate total hours from courses if estimated_duration is missing
        const totalMinutes = courses.reduce((acc: number, curr: any) => acc + (curr.raw_duration || 0), 0)
        const calculatedHours = Math.round(totalMinutes / 60)

        return {
            id: item.id,
            title: item.title,
            slug: item.slug,
            description: item.description,
            price: item.one_time_price || 0,
            original_price: null,
            hours: item.estimated_duration ? Math.round(item.estimated_duration / 60) : (calculatedHours || 10),
            projects_count: 0, // Placeholder, usually derived from exercises/projects count
            courses_count: courses.length,
            highlights: Array.isArray(item.expected_results) ? item.expected_results : (typeof item.expected_results === 'string' ? JSON.parse(item.expected_results) : []),
            is_published: item.status === 'published',
            courses: courses
        }
    }
}
