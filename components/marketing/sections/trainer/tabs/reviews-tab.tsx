"use client"

import { Star, ThumbsUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TrainerReviewsTab() {
  const reviews = [
    {
      name: "Jean Kouassi",
      avatar: "/placeholder.svg?key=rvqxh",
      rating: 5,
      date: "Il y a 2 jours",
      location: "Côte d'Ivoire",
      course: "Intelligence Artificielle Pratique",
      text: "Excellente formatrice ! Dr. Diallo explique les concepts complexes de manière très claire. Ses formations sont toujours de haute qualité.",
      helpful: 15,
    },
    {
      name: "Fatima Hassan",
      avatar: "/placeholder.svg?key=tg5mh",
      rating: 5,
      date: "Il y a 5 jours",
      location: "Rwanda",
      course: "Data Science avec Python",
      text: "Une experte passionnée qui sait transmettre son savoir. Les exemples pratiques sont pertinents et le support est excellent.",
      helpful: 12,
    },
    {
      name: "Mamadou Diop",
      avatar: "/placeholder.svg?key=yj0v2",
      rating: 5,
      date: "Il y a 1 semaine",
      location: "Sénégal",
      course: "Deep Learning Avancé",
      text: "La meilleure formatrice en IA que j'ai eu. Son expertise et sa pédagogie sont remarquables. Je recommande toutes ses formations.",
      helpful: 18,
    },
    {
      name: "Aïcha Diop",
      avatar: "/placeholder.svg?key=yj0v2",
      rating: 5,
      date: "Il y a 2 semaines",
      location: "Sénégal",
      course: "Machine Learning Pratique",
      text: "Formation exceptionnelle ! Dr. Diallo est très réactive et prend le temps de répondre à toutes les questions.",
      helpful: 9,
    },
  ]

  const ratingBreakdown = [
    { stars: 5, percentage: 92, count: 2157 },
    { stars: 4, percentage: 6, count: 141 },
    { stars: 3, percentage: 1, count: 23 },
    { stars: 2, percentage: 1, count: 18 },
    { stars: 1, percentage: 0, count: 6 },
  ]

  return (
    <div className="space-y-8">
      {/* Rating Overview */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-6 text-xl font-bold">Évaluation globale</h3>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-2 text-5xl font-bold">4.9</div>
            <div className="mb-2 flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <div className="text-sm text-muted-foreground">sur 5.0 (2,345 avis)</div>
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
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div key={index} className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex gap-3">
                <img
                  src={review.avatar || "/placeholder.svg"}
                  alt={review.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold">{review.name}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{review.date}</span>
                    <span>•</span>
                    <span>{review.location}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Formation: {review.course}</div>
                </div>
              </div>
              <div className="flex">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>

            <p className="mb-4 text-sm text-muted-foreground">{review.text}</p>

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <ThumbsUp className="h-4 w-4" />
                <span>Utile ({review.helpful})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
