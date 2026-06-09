import { createClient } from '@/lib/supabase/client'
import { Category } from '@/lib/supabase/types'

export const CategoryService = {
    async getAllCategories(): Promise<Category[]> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('marketplace_categories')
            .select('id, name, slug, description, icon, image_url')
            .order('name')

        if (error) {
            console.error('Error fetching categories:', error)
            return []
        }

        return data as unknown as Category[]
    },

    async getCategoriesWithCounts(): Promise<Category[]> {
        const supabase = createClient()

        const [categoriesRes, marketplaceCoursesRes] = await Promise.all([
            supabase
                .from('marketplace_categories')
                .select('id, name, slug, description, icon, image_url')
                .order('name'),
            supabase
                .from('marketplace_courses')
                .select('category_id, courses!inner(status)')
                .eq('review_status', 'published')
        ])

        if (categoriesRes.error) {
            console.error('Error fetching categories:', categoriesRes.error)
            return []
        }

        const categories = categoriesRes.data as unknown as Category[]

        const countsById = new Map<string, number>()
        if (!marketplaceCoursesRes.error && marketplaceCoursesRes.data) {
            for (const row of marketplaceCoursesRes.data as any[]) {
                if (!row.category_id) continue
                if (row.courses?.status !== 'published') continue
                countsById.set(row.category_id, (countsById.get(row.category_id) || 0) + 1)
            }
        } else if (marketplaceCoursesRes.error) {
            console.error('Error counting marketplace courses:', marketplaceCoursesRes.error)
        }

        // Hide empty categories from the marketplace home — surfacing a
        // category with 0 courses sends users to a dead-end search and
        // muddies the curated taxonomy.
        return categories
            .map(c => ({
                ...c,
                courses_count: countsById.get(c.id) || 0
            }))
            .filter(c => c.courses_count > 0)
    },

    async getCategoryBySlug(slug: string): Promise<Category | null> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('marketplace_categories')
            .select('id, name, slug, description, icon, image_url')
            .eq('slug', slug)
            .single()

        if (error) {
            console.error('Error fetching category by slug:', error)
            return null
        }

        return data as unknown as Category
    }
}
