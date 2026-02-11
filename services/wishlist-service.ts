
import { createClient } from '@/lib/supabase/client'

export const WishlistService = {
    /**
     * Add a course to the user's wishlist
     */
    async addToWishlist(userId: string, courseId: string) {
        const supabase = createClient()

        const { error } = await supabase
            .from('wishlist')
            .insert({
                user_id: userId,
                course_id: courseId
            })

        if (error) {
            // Ignore unique constraint violation (already in wishlist)
            if (error.code === '23505') return { success: true }
            console.error('Error adding to wishlist:', error)
            return { success: false, error }
        }

        return { success: true }
    },

    /**
     * Remove a course from the user's wishlist
     */
    async removeFromWishlist(userId: string, courseId: string) {
        const supabase = createClient()

        const { error } = await supabase
            .from('wishlist')
            .delete()
            .match({
                user_id: userId,
                course_id: courseId
            })

        if (error) {
            console.error('Error removing from wishlist:', error)
            return { success: false, error }
        }

        return { success: true }
    },

    /**
     * Check if a course is in the user's wishlist
     */
    async isInWishlist(userId: string, courseId: string) {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('wishlist')
            .select('id')
            .match({
                user_id: userId,
                course_id: courseId
            })
            .single()

        if (error && error.code !== 'PGRST116') { // PGRST116 is "The result contains 0 rows"
            console.error('Error checking wishlist status:', error)
            return false
        }

        return !!data
    },

    /**
     * Get all wishlist items for a user
     */
    async getUserWishlist(userId: string) {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('wishlist')
            .select('course_id')
            .eq('user_id', userId)

        if (error) {
            console.error('Error fetching user wishlist:', error)
            return []
        }

        return data.map(item => item.course_id)
    }
}
