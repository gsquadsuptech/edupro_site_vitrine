"use client"

import { Star, ThumbsUp, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface Review {
  id: string
  user: {
    name: string
    avatar_url: string | null
  }
  rating: number
  comment: string
  date: string
  location?: string
  helpful: number
}

interface ReviewsTabProps {
  reviews?: Review[]
}

export function ReviewsTab({ reviews = [] }: ReviewsTabProps) {
  // Calculate breakdown
  const totalReviews = reviews.length
  const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => Math.round(r.rating) === stars).length
    const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0
    return { stars, percentage, count }
  })

  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0"

  return (
    <div className="space-y-8">
      {/* Rating Overview */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-6 text-xl font-bold">Note globale</h3>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-2 text-5xl font-bold">{averageRating}</div>
            <div className="mb-2 flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-6 w-6 ${i < Math.round(Number(averageRating)) ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-200"}`} />
              ))}
            </div>
            <div className="text-sm text-muted-foreground">sur 5.0 ({totalReviews} avis)</div>
          </div>

          <div className="space-y-2">
            {ratingBreakdown.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <div className="flex w-16 items-center gap-1">
                  {[...Array(item.stars)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-yellow-400" style={{ width: `${item.percentage}%` }} />
                </div>
                <div className="w-12 text-right text-sm text-muted-foreground">{item.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Avis des apprenants</h3>
        <Select defaultValue="recent">
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Plus récents</SelectItem>
            <SelectItem value="helpful">Plus utiles</SelectItem>
            <SelectItem value="rating-high">Note décroissante</SelectItem>
            <SelectItem value="rating-low">Note croissante</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex gap-3">
                  <img
                    src={review.user.avatar_url || "/placeholder.svg"}
                    alt={review.user.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">{review.user.name}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{review.date}</span>
                      {review.location && (
                        <>
                          <span>•</span>
                          <span>{review.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-200"}`} />
                  ))}
                </div>
              </div>

              <p className="mb-4 text-sm text-muted-foreground">{review.comment}</p>

              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="h-auto p-0 text-sm">
                  <ThumbsUp className="mr-1 h-4 w-4" />
                  Utile ({review.helpful})
                </Button>
                <Button variant="ghost" size="sm" className="h-auto p-0 text-sm">
                  <MessageCircle className="mr-1 h-4 w-4" />
                  Répondre
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Aucun avis pour le moment.
          </div>
        )}
      </div>

      {reviews.length > 5 && (
        <div className="text-center">
          <Button variant="outline">Voir plus d'avis</Button>
        </div>
      )}
    </div>
  )
}
