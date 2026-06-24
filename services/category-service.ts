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

        // Le filtre catégorie du catalogue s'applique aux cours ET aux parcours :
        // le compteur doit donc agréger les deux pour rester cohérent avec la
        // liste filtrée. Cours : 1 catégorie via marketplace_courses.category_id.
        // Parcours : N catégories via la table de liaison
        // marketplace_learning_path_categories.
        const [categoriesRes, marketplaceCoursesRes, publishedLpRes] = await Promise.all([
            supabase
                .from('marketplace_categories')
                .select('id, name, slug, description, icon, image_url')
                .order('name'),
            supabase
                .from('marketplace_courses')
                .select('category_id, courses!inner(status)')
                .eq('review_status', 'published'),
            supabase
                .from('learning_paths')
                .select('id, access_type, marketplace:marketplace_learning_paths!inner(review_status, searchable)')
                .eq('status', 'published')
                .eq('marketplace.review_status', 'published')
                .eq('marketplace.searchable', true)
                .or('access_type.is.null,access_type.neq.invitation')
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

        // Parcours publiés → on récupère leurs liaisons catégorie puis on
        // incrémente le compteur (un parcours peut compter dans plusieurs
        // catégories, comme dans la liste filtrée).
        if (!publishedLpRes.error && publishedLpRes.data && publishedLpRes.data.length > 0) {
            const lpIds = (publishedLpRes.data as any[]).map((lp) => lp.id)
            const { data: links, error: linksErr } = await supabase
                .from('marketplace_learning_path_categories')
                .select('category_id, learning_path_id')
                .in('learning_path_id', lpIds)

            if (!linksErr && links) {
                for (const link of links as any[]) {
                    if (!link.category_id) continue
                    countsById.set(link.category_id, (countsById.get(link.category_id) || 0) + 1)
                }
            } else if (linksErr) {
                console.error('Error counting learning path categories:', linksErr)
            }
        } else if (publishedLpRes.error) {
            console.error('Error fetching published learning paths:', publishedLpRes.error)
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
