"use client"

import { FormationCard } from "@/components/marketing/marketplace/formation-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TrainerCoursesTab() {
  const courses = [
    {
      id: "1",
      slug: "intelligence-artificielle-pratique",
      title: "Intelligence Artificielle Pratique pour Débutants",
      thumbnail: "/placeholder.svg?key=uedvb",
      category: "Tech & Digital",
      level: "Débutant",
      instructor: "Dr. Aminata Diallo",
      rating: 4.9,
      reviewCount: 342,
      price: 25000,
      monthlyPrice: 5000,
      enrolledCount: 2456,
      duration: "18h",
      badge: "TRENDING",
    },
    {
      id: "2",
      slug: "data-science-python",
      title: "Data Science avec Python: De Zéro à Expert",
      thumbnail: "/placeholder.svg?key=a2a4l",
      category: "Tech & Digital",
      level: "Intermédiaire",
      instructor: "Dr. Aminata Diallo",
      rating: 4.8,
      reviewCount: 289,
      price: 30000,
      monthlyPrice: 6000,
      enrolledCount: 1834,
      duration: "24h",
      badge: "BESTSELLER",
    },
    {
      id: "3",
      slug: "deep-learning-avance",
      title: "Deep Learning Avancé avec TensorFlow",
      thumbnail: "/placeholder.svg?key=bnqxe",
      category: "Tech & Digital",
      level: "Avancé",
      instructor: "Dr. Aminata Diallo",
      rating: 4.9,
      reviewCount: 156,
      price: 35000,
      monthlyPrice: 7000,
      enrolledCount: 987,
      duration: "32h",
    },
    {
      id: "4",
      slug: "computer-vision",
      title: "Computer Vision et Traitement d'Images",
      thumbnail: "/placeholder.svg?key=2q171",
      category: "Tech & Digital",
      level: "Avancé",
      instructor: "Dr. Aminata Diallo",
      rating: 4.8,
      reviewCount: 198,
      price: 32000,
      monthlyPrice: 6400,
      enrolledCount: 876,
      duration: "28h",
    },
    {
      id: "5",
      slug: "nlp-traitement-langage",
      title: "NLP et Traitement du Langage Naturel",
      thumbnail: "/placeholder.svg?key=gmvp9",
      category: "Tech & Digital",
      level: "Intermédiaire",
      instructor: "Dr. Aminata Diallo",
      rating: 4.7,
      reviewCount: 189,
      price: 30000,
      monthlyPrice: 6000,
      enrolledCount: 1098,
      duration: "24h",
    },
    {
      id: "6",
      slug: "machine-learning-pratique",
      title: "Machine Learning Pratique",
      thumbnail: "/placeholder.svg?key=ixqvh",
      category: "Tech & Digital",
      level: "Intermédiaire",
      instructor: "Dr. Aminata Diallo",
      rating: 4.8,
      reviewCount: 234,
      price: 28000,
      monthlyPrice: 5600,
      enrolledCount: 1567,
      duration: "22h",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">18 formations</span> disponibles
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="tech">Tech & Digital</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="popular">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Plus populaires</SelectItem>
              <SelectItem value="recent">Plus récentes</SelectItem>
              <SelectItem value="rating">Mieux notées</SelectItem>
              <SelectItem value="price-asc">Prix croissant</SelectItem>
              <SelectItem value="price-desc">Prix décroissant</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <FormationCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}
