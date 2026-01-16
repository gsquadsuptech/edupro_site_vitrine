import { FormationCard } from "@/components/marketing/marketplace/formation-card"

export function LearningPath() {
  const phases = [
    {
      title: "Phase 1 : Fondamentaux",
      description: "Maîtrisez les bases essentielles",
      courses: [
        {
          id: "1",
          slug: "introduction-programmation-python",
          title: "Introduction à la Programmation Python",
          thumbnail: "/placeholder.svg?key=uedvb",
          category: "Tech & Digital",
          level: "Débutant",
          instructor: "Dr. Aminata Diallo",
          rating: 4.9,
          reviewCount: 342,
          price: 15000,
          monthlyPrice: 3000,
          enrolledCount: 2456,
          duration: "12h",
        },
        {
          id: "2",
          slug: "bases-donnees-sql",
          title: "Bases de Données et SQL",
          thumbnail: "/placeholder.svg?key=a2a4l",
          category: "Tech & Digital",
          level: "Débutant",
          instructor: "Moussa Traoré",
          rating: 4.8,
          reviewCount: 289,
          price: 18000,
          monthlyPrice: 3600,
          enrolledCount: 1834,
          duration: "15h",
        },
        {
          id: "3",
          slug: "git-github-collaboration",
          title: "Git & GitHub pour la Collaboration",
          thumbnail: "/placeholder.svg?key=3z0gm",
          category: "Tech & Digital",
          level: "Débutant",
          instructor: "Fatou Ndiaye",
          rating: 4.7,
          reviewCount: 198,
          price: 12000,
          monthlyPrice: 2400,
          enrolledCount: 1567,
          duration: "8h",
        },
      ],
    },
    {
      title: "Phase 2 : Spécialisation",
      description: "Développez votre expertise",
      courses: [
        {
          id: "4",
          slug: "developpement-web-fullstack",
          title: "Développement Web Full Stack",
          thumbnail: "/placeholder.svg?key=ji5l5",
          category: "Tech & Digital",
          level: "Intermédiaire",
          instructor: "Kofi Mensah",
          rating: 4.9,
          reviewCount: 423,
          price: 35000,
          monthlyPrice: 7000,
          enrolledCount: 987,
          duration: "40h",
        },
        {
          id: "5",
          slug: "data-science-python",
          title: "Data Science avec Python",
          thumbnail: "/placeholder.svg?key=2q171",
          category: "Tech & Digital",
          level: "Intermédiaire",
          instructor: "Aisha Mohammed",
          rating: 4.8,
          reviewCount: 312,
          price: 30000,
          monthlyPrice: 6000,
          enrolledCount: 1543,
          duration: "28h",
        },
      ],
    },
  ]

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold md:text-4xl">Parcours d'Apprentissage</h2>
          <p className="text-lg text-muted-foreground">Un chemin structuré pour votre montée en compétences</p>
        </div>

        <div className="space-y-12">
          {phases.map((phase, phaseIndex) => (
            <div key={phaseIndex}>
              <div className="mb-6">
                <h3 className="mb-2 text-2xl font-bold">{phase.title}</h3>
                <p className="text-muted-foreground">{phase.description}</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {phase.courses.map((course) => (
                  <FormationCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
