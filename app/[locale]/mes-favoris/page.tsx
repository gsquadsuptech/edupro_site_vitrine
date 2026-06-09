"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Heart, Bookmark, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FormationCard } from "@/components/marketing/marketplace/formation-card"
import { WishlistService } from "@/services/wishlist-service"
import { SavedCoursesService } from "@/services/saved-courses-service"
import { CourseService } from "@/services/course-service"
import { Course } from "@/lib/supabase/types"

export default function MesFavorisPage() {
  const params = useParams()
  const locale = (params?.locale as string) || "fr"
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<Course[]>([])
  const [saved, setSaved] = useState<Course[]>([])

  useEffect(() => {
    if (authLoading) return
    if (!user) { setLoading(false); return }
    let active = true
    ;(async () => {
      setLoading(true)
      const [favIds, savedIds] = await Promise.all([
        WishlistService.getUserWishlist(user.id),
        SavedCoursesService.getUserSaved(user.id),
      ])
      const [favCourses, savedCourses] = await Promise.all([
        CourseService.getCoursesByIds(favIds),
        CourseService.getCoursesByIds(savedIds),
      ])
      if (active) {
        setFavorites(favCourses)
        setSaved(savedCourses)
        setLoading(false)
      }
    })()
    return () => { active = false }
  }, [user, authLoading])

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <Heart className="h-10 w-10 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Mes favoris & sauvegardes</h1>
        <p className="max-w-md text-muted-foreground">
          Connectez-vous pour retrouver vos formations favorites et sauvegardées.
        </p>
        <Link href={`/${locale}/connexion`}>
          <Button>Se connecter</Button>
        </Link>
      </div>
    )
  }

  const renderGrid = (courses: Course[], emptyLabel: string) => {
    if (loading || authLoading) {
      return (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )
    }
    if (courses.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <p className="text-muted-foreground">{emptyLabel}</p>
          <Link href={`/${locale}/catalogue`}>
            <Button variant="outline">Découvrir le catalogue</Button>
          </Link>
        </div>
      )
    }
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <FormationCard key={c.id} course={c} />
        ))}
      </div>
    )
  }

  return (
    <div className="container py-12">
      <h1 className="mb-8 text-3xl font-bold md:text-4xl">Mes formations</h1>

      <Tabs defaultValue="favoris" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="favoris" className="gap-2">
            <Heart className="h-4 w-4" />
            Favoris {!loading && `(${favorites.length})`}
          </TabsTrigger>
          <TabsTrigger value="saved" className="gap-2">
            <Bookmark className="h-4 w-4" />
            Sauvegardés {!loading && `(${saved.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="favoris">
          {renderGrid(favorites, "Vous n'avez pas encore de formation en favoris.")}
        </TabsContent>
        <TabsContent value="saved">
          {renderGrid(saved, "Vous n'avez pas encore de formation sauvegardée.")}
        </TabsContent>
      </Tabs>
    </div>
  )
}
