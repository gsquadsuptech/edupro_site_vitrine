import { FormationCard } from "@/components/marketing/sections/marketplace/formation-card"

export function SimilarCourses() {
  const similarCourses = [
    {
      id: "1",
      slug: "machine-learning-pratique",
      title: "Machine Learning Pratique",
      thumbnail: "/placeholder.svg?key=ixqvh",
      category: "Tech & Digital",
      level: "Intermédiaire",
      instructor: "Moussa Traoré",
      rating: 4.8,
      reviewCount: 234,
      price: 28000,
      monthlyPrice: 5600,
      enrolledCount: 1567,
      duration: "22h",
    },
    {
      id: "2",
      slug: "deep-learning-tensorflow",
      title: "Deep Learning avec TensorFlow",
      thumbnail: "/placeholder.svg?key=bnqxe",
      category: "Tech & Digital",
      level: "Avancé",
      instructor: "Jean-Paul Kouadio",
      rating: 4.9,
      reviewCount: 423,
      price: 40000,
      monthlyPrice: 8000,
      enrolledCount: 987,
      duration: "40h",
      badge: "BESTSELLER",
    },
    {
      id: "3",
      slug: "data-science-python",
      title: "Data Science avec Python",
      thumbnail: "/placeholder.svg?key=a2a4l",
      category: "Tech & Digital",
      level: "Intermédiaire",
      instructor: "Aisha Mohammed",
      rating: 4.8,
      reviewCount: 312,
      price: 32000,
      monthlyPrice: 6400,
      enrolledCount: 1543,
      duration: "28h",
    },
    {
      id: "4",
      slug: "computer-vision",
      title: "Computer Vision et Traitement d'Images",
      thumbnail: "/placeholder.svg?key=2q171",
      category: "Tech & Digital",
      level: "Avancé",
      instructor: "Omar Dieng",
      rating: 4.7,
      reviewCount: 189,
      price: 35000,
      monthlyPrice: 7000,
      enrolledCount: 876,
      duration: "30h",
    },
  ]

  return (
    <section className="border-t border-border py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-bold md:text-3xl">Formations similaires</h2>
        <p className="mb-8 text-muted-foreground">Les apprenants ont aussi aimé</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {similarCourses.map((course) => (
            <FormationCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  )
}
