import { createClient } from '@/lib/supabase/client'

/**
 * Liste « Sauvegarder » (bookmark), distincte des favoris (wishlist).
 * Table `saved_courses` (user_id, course_id) — RLS owner-only.
 * course_id référence marketplace_courses.course_id (== courses.id).
 */
export const SavedCoursesService = {
    async addToSaved(userId: string, courseId: string) {
        const supabase = createClient()

        const { error } = await supabase
            .from('saved_courses')
            .insert({ user_id: userId, course_id: courseId })

        if (error) {
            if (error.code === '23505') return { success: true } // déjà sauvegardé
            console.error('Error saving course:', error)
            return { success: false, error }
        }

        return { success: true }
    },

    async removeFromSaved(userId: string, courseId: string) {
        const supabase = createClient()

        const { error } = await supabase
            .from('saved_courses')
            .delete()
            .match({ user_id: userId, course_id: courseId })

        if (error) {
            console.error('Error removing saved course:', error)
            return { success: false, error }
        }

        return { success: true }
    },

    async isSaved(userId: string, courseId: string) {
        if (!userId || !courseId) return false

        const supabase = createClient()

        const { data, error } = await supabase
            .from('saved_courses')
            .select('id')
            .match({ user_id: userId, course_id: courseId })
            .maybeSingle()

        if (error) {
            console.error('Error checking saved status:', { message: error.message, code: error.code })
            return false
        }

        return !!data
    },

    async getUserSaved(userId: string) {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('saved_courses')
            .select('course_id')
            .eq('user_id', userId)

        if (error) {
            console.error('Error fetching saved courses:', error)
            return []
        }

        return data.map(item => item.course_id)
    }
}
