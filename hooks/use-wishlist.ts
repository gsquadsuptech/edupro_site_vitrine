"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { WishlistService } from "@/services/wishlist-service"

/**
 * Logique favoris réutilisable (carte catalogue + sidebar détail).
 * S'appuie sur la table `wishlist` (RLS owner-only) via WishlistService.
 */
export function useWishlist(courseId?: string) {
    const { user, isAuthenticated } = useAuth()
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        let active = true
        if (!courseId || !user) {
            setIsWishlisted(false)
            return
        }
        WishlistService.isInWishlist(user.id, courseId).then((inList) => {
            if (active) setIsWishlisted(inList)
        })
        return () => { active = false }
    }, [courseId, user])

    const toggle = useCallback(async () => {
        if (!courseId || isLoading) return
        if (!isAuthenticated || !user) {
            toast.error("Vous devez être connecté pour gérer vos favoris")
            return
        }

        setIsLoading(true)
        try {
            if (isWishlisted) {
                await WishlistService.removeFromWishlist(user.id, courseId)
                setIsWishlisted(false)
                toast.success("Retiré des favoris")
            } else {
                await WishlistService.addToWishlist(user.id, courseId)
                setIsWishlisted(true)
                toast.success("Ajouté aux favoris")
            }
        } catch {
            toast.error("Une erreur est survenue")
        } finally {
            setIsLoading(false)
        }
    }, [courseId, user, isAuthenticated, isWishlisted, isLoading])

    return { isWishlisted, isLoading, toggle, isAuthenticated }
}
