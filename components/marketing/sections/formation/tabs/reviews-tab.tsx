"use client"

import { Star, ThumbsUp, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ReviewsTab() {
  const reviews = [
    {
      name: "Jean Kouassi",
      avatar: "/placeholder.svg?key=rvqxh",
      rating: 5,
      date: "Il y a 2 jours",
      location: "Côte d'Ivoire",
      text: "Excellente formation ! Le formateur explique les concepts complexes de manière très claire et accessible. Les exemples pratiques sont pertinents et adaptés au contexte africain. Je recommande vivement !",
      helpful: 12,
    },
    {
      name: "Fatima Hassan",
      avatar: "/placeholder.svg?key=tg5mh",
      rating: 5,
      date: "Il y a 5 jours",
      location: "Rwanda",
      text: "Cette formation m'a permis de comprendre enfin l'IA. Les exercices pratiques sont très bien conçus et le support du formateur est excellent. J'ai déjà commencé à appliquer ces connaissances dans mon travail.",
      helpful: 8,
    },
    {
      name: "Mamadou Diop",
      avatar: "/placeholder.svg?key=yj0v2",
      rating: 4,
      date: "Il y a 1 semaine",
      location: "Sénégal",
      text: "Très bonne formation pour débuter en IA. Le contenu est riche et bien structuré. Seul petit bémol : j'aurais aimé plus de projets pratiques. Mais dans l'ensemble, très satisfait !",
      helpful: 5,
    },
  ]

  const ratingBreakdown = [
    { stars: 5, percentage: 89, count: 304 },
    { stars: 4, percentage: 8, count: 27 },
    { stars: 3, percentage: 2, count: 7 },
    { stars: 2, percentage: 1, count: 3 },
    { stars: 1, percentage: 0, count: 1 },
  ]

  return (
    <div className="space-y-8">
      {/* Rating Overview */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-6 text-xl font-bold">Note globale</h3>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-2 text-5xl font-bold">4.9</div>
            <div className="mb-2 flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <div className="text-sm text-muted-foreground">sur 5.0 (342 avis)</div>
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
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline">Voir plus d'avis</Button>
      </div>
    </div>
  )
}
