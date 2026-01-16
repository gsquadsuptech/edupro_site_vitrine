import { createClient } from '@/lib/supabase/client'
import { Category } from '@/lib/supabase/types'

export const CategoryService = {
    async getAllCategories(): Promise<Category[]> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('marketplace_categories')
            .select('id, name, slug, description, icon')
            .order('name')

        if (error) {
            console.error('Error fetching categories:', error)
            return []
        }

        return data as unknown as Category[]
    },

    async getCategoriesWithCounts(): Promise<Category[]> {
        const supabase = createClient()

        // Note: Counting related courses might require a different query or rpc
        const { data, error } = await supabase
            .from('marketplace_categories')
            .select('id, name, slug, description, icon')
            .order('name')

        if (error) {
            console.error('Error fetching categories:', error)
            return []
        }

        return data as Category[]
    },

    async getCategoryBySlug(slug: string): Promise<Category | null> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('marketplace_categories')
            .select('id, name, slug, description, icon')
            .eq('slug', slug)
            .single()

        if (error) {
            console.error('Error fetching category by slug:', error)
            return null
        }

        return data as unknown as Category
    }
}
