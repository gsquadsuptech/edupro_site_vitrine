"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Star, Users, Clock, Heart, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

import { Course } from "@/lib/supabase/types"
import { WishlistService } from "@/services/wishlist-service"

interface FormationCardProps {
    course: Course | any // Allow both strict Course and legacy any for now to ease transition
}

export function FormationCard({ course }: FormationCardProps) {
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Normalize fields between Course type and legacy mock data type
    const thumbnail = course.image_url || course.thumbnail || "/placeholder.svg"
    const enrolledCount = course.enrolledCount || 0
    const monthlyPrice = course.monthlyPrice || 0
    const rating = course.rating || 0
    const reviewCount = course.reviewCount || 0
    // Handle both strict Course type and any for instructor name/institute
    const instructorObj = course.instructor
    const instructorName = typeof instructorObj === 'string'
        ? instructorObj
        : (instructorObj?.institute || instructorObj?.name || 'Instructeur')
    const categoryName = typeof course.category === 'string' ? course.category : course.category?.name || 'Catégorie'
    const duration = course.duration || "N/A"

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
        <Link href={`/fr/formation/${course.slug}`}>
            <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg">
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-muted">
                    <img
                        src={thumbnail}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {course.badge && (
                        <Badge className="absolute right-3 top-3 bg-accent text-accent-foreground">{course.badge}</Badge>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4">
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
                                            className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-medium">{rating}</span>
                                <span className="text-sm text-muted-foreground">({reviewCount} avis)</span>
                            </>
                        )}
                    </div>

                    <div className="mt-auto">
                        {/* Price & Actions */}
                        <div className="flex items-center justify-between border-t border-border pt-3">
                            <div>
                                <div className="text-lg font-bold">{(course.price || 0).toLocaleString()} FCFA</div>
                                {monthlyPrice > 0 && (
                                    <div className="text-xs text-muted-foreground">ou {monthlyPrice.toLocaleString()} FCFA/mois</div>
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
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                    <Bookmark className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                            {enrolledCount > 0 && (
                                <>
                                    <div className="flex items-center gap-1">
                                        <Users className="h-3.5 w-3.5" />
                                        <span>{enrolledCount.toLocaleString()} inscrits</span>
                                    </div>
                                    <span>•</span>
                                </>
                            )}
                            <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{duration}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
