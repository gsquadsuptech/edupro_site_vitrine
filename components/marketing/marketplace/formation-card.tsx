"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Star, Users, Clock, Heart, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

import { Course } from "@/lib/supabase/types"
import { WishlistService } from "@/services/wishlist-service"

interface FormationCardProps {
  course: Pick<Course, 'id' | 'slug' | 'title' | 'image_url' | 'category' | 'instructor' | 'level' | 'price' | 'duration' | 'format' | 'one_time_price' | 'monthly_price' | 'pricing_modes'> & {
    // Add missing properties that might be computed or hardcoded for now
    rating?: number
    reviewCount?: number
    enrolledCount?: number
    badge?: string
  }
}

export function FormationCard({ course }: FormationCardProps) {
  const params = useParams()
  const router = useRouter()
  const locale = params?.locale || 'fr'
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Derived/Fallback values
  const imageUrl = course.image_url || "/placeholder.svg"
  const categoryName = course.category?.name || "Général"
  // Prefer institute name if available, otherwise instructor name
  const instructorName = course.instructor?.institute || course.instructor?.name || "Instructeur"
  const rating = course.rating ?? 0
  const reviewCount = course.reviewCount || 0
  const enrolledCount = course.enrolledCount || 0
  const price = course.price || 0

  useEffect(() => {
    checkWishlistStatus()
  }, [course.id])

  const checkWishlistStatus = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user && course.id) {
      const inWishlist = await WishlistService.isInWishlist(user.id, course.id)
      setIsWishlisted(inWishlist)
    }
  }

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation
    e.stopPropagation()

    if (isLoading) return

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.error("Vous devez être connecté pour ajouter aux favoris")
      // Optionally redirect to login or open modal
      return
    }

    if (!course.id) return

    setIsLoading(true)
    try {
      if (isWishlisted) {
        await WishlistService.removeFromWishlist(user.id, course.id)
        setIsWishlisted(false)
        toast.success("Retiré des favoris")
      } else {
        await WishlistService.addToWishlist(user.id, course.id)
        setIsWishlisted(true)
        toast.success("Ajouté aux favoris")
      }
    } catch (error) {
      toast.error("Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Link href={`/${locale}/formation/${course.slug}`}>
      <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={imageUrl}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {course.badge && (
            <Badge className="absolute right-3 top-3 bg-accent text-accent-foreground">{course.badge}</Badge>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category & Level */}
          <div className="mb-2 flex items-center gap-2 text-xs">
            <Badge variant="secondary" className="font-medium">
              {categoryName}
            </Badge>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">
              {(() => {
                const labels: Record<string, string> = {
                  'beginner': 'Débutant',
                  'intermediate': 'Intermédiaire',
                  'high': 'Avancé'
                }
                return labels[course.level || ''] || course.level || 'Tous niveaux'
              })()}
            </span>
          </div>

          {/* Title */}
          <h3 className="mb-2 line-clamp-2 text-base font-semibold leading-tight group-hover:underline">
            {course.title}
          </h3>

          {/* Instructor */}
          <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>{instructorName}</span>
          </div>

          {/* Rating */}
          <div className="mb-3 flex items-center gap-1 min-h-[20px]">
            {reviewCount > 0 && (
              <>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{rating}</span>
                <span className="text-sm text-muted-foreground">({reviewCount} avis)</span>
              </>
            )}
          </div>

          {/* Price & Actions */}
          <div className="flex items-center justify-between border-t border-border pt-3">
            <div>
              <div className="text-xs text-muted-foreground font-medium">
                {course.format === 'session' ? 'À partir de' : 'Prix total'}
              </div>
              <div className="text-lg font-bold">
                {Number(price) >= 1 ? `${Math.round(Number(price)).toLocaleString()} FCFA` : 'Gratuit'}
              </div>
              {course.monthly_price && (
                <div className="text-xs text-muted-foreground">ou {course.monthly_price.toLocaleString()} FCFA/mois</div>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                className={`h-8 w-8 ${isWishlisted ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-red-500"}`}
                onClick={toggleWishlist}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{enrolledCount.toLocaleString()} inscrits</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{course.duration || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
