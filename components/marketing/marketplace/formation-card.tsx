"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Star, Users, Clock, Heart, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface FormationCardProps {
  course: {
    id: string
    slug: string
    title: string
    thumbnail: string
    category: string
    level: string
    instructor: string
    rating: number
    reviewCount: number
    price: number
    monthlyPrice?: number
    enrolledCount: number
    duration: string
    badge?: string
  }
}

export function FormationCard({ course }: FormationCardProps) {
  const params = useParams()
  const locale = params?.locale || 'fr'

  return (
    <Link href={`/${locale}/formation/${course.slug}`}>
      <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={course.thumbnail || "/placeholder.svg"}
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
              {course.category}
            </Badge>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{course.level}</span>
          </div>

          {/* Title */}
          <h3 className="mb-2 line-clamp-2 text-base font-semibold leading-tight group-hover:underline">
            {course.title}
          </h3>

          {/* Instructor */}
          <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>{course.instructor}</span>
          </div>

          {/* Rating */}
          <div className="mb-3 flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(course.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{course.rating}</span>
            <span className="text-sm text-muted-foreground">({course.reviewCount} avis)</span>
          </div>

          {/* Price & Actions */}
          <div className="flex items-center justify-between border-t border-border pt-3">
            <div>
              <div className="text-lg font-bold">{course.price.toLocaleString()} FCFA</div>
              {course.monthlyPrice && (
                <div className="text-xs text-muted-foreground">ou {course.monthlyPrice.toLocaleString()}/mois</div>
              )}
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <Heart className="h-4 w-4" />
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
              <span>{course.enrolledCount.toLocaleString()} inscrits</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{course.duration}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
