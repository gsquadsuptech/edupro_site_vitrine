"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { SavedCoursesService } from "@/services/saved-courses-service"

/**
 * Logique « Sauvegarder » réutilisable (bookmark), distincte des favoris.
 * S'appuie sur la table `saved_courses` (RLS owner-only).
 */
export function useSavedCourse(courseId?: string) {
    const { user, isAuthenticated } = useAuth()
    const [isSaved, setIsSaved] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        let active = true
        if (!courseId || !user) {
            setIsSaved(false)
            return
        }
        SavedCoursesService.isSaved(user.id, courseId).then((saved) => {
            if (active) setIsSaved(saved)
        })
        return () => { active = false }
    }, [courseId, user])

    const toggle = useCallback(async () => {
        if (!courseId || isLoading) return
        if (!isAuthenticated || !user) {
            toast.error("Vous devez être connecté pour sauvegarder une formation")
            return
        }

        setIsLoading(true)
        try {
            if (isSaved) {
                const { success } = await SavedCoursesService.removeFromSaved(user.id, courseId)
                if (!success) { toast.error("Impossible de retirer la sauvegarde"); return }
                setIsSaved(false)
                toast.success("Retiré de vos sauvegardes")
            } else {
                const { success } = await SavedCoursesService.addToSaved(user.id, courseId)
                if (!success) { toast.error("Impossible de sauvegarder"); return }
                setIsSaved(true)
                toast.success("Formation sauvegardée")
            }
        } catch {
            toast.error("Une erreur est survenue")
        } finally {
            setIsLoading(false)
        }
    }, [courseId, user, isAuthenticated, isSaved, isLoading])

    return { isSaved, isLoading, toggle, isAuthenticated }
}
