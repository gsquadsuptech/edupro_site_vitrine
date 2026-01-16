import { Star, Users, BookOpen, Linkedin, Twitter, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FormationCard } from "@/components/marketing/sections/marketplace/formation-card"

export function InstructorTab() {
  const otherCourses = [
    {
      id: "1",
      slug: "data-science-python",
      title: "Data Science avec Python",
      thumbnail: "/placeholder.svg?key=ixqvh",
      category: "Tech & Digital",
      level: "Intermédiaire",
      instructor: "Dr. Aminata Diallo",
      rating: 4.8,
      reviewCount: 289,
      price: 30000,
      monthlyPrice: 6000,
      enrolledCount: 1834,
      duration: "24h",
    },
    {
      id: "2",
      slug: "deep-learning-avance",
      title: "Deep Learning Avancé",
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
  ]

  return (
    <div className="space-y-8">
      {/* Instructor Profile */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-6 flex flex-col gap-6 md:flex-row">
          <img
            src="/placeholder.svg?key=rvqxh"
            alt="Dr. Aminata Diallo"
            className="h-32 w-32 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="mb-2 text-2xl font-bold">Dr. Aminata Diallo</h3>
            <p className="mb-3 text-muted-foreground">
              Docteure en Intelligence Artificielle • Chercheuse & Formatrice
            </p>
            <div className="mb-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">4.9</span>
                <span className="text-muted-foreground">note moyenne</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">12,456</span>
                <span className="text-muted-foreground">étudiants</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">8</span>
                <span className="text-muted-foreground">formations</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="bg-gradient-to-r from-primary to-chart-2">
                Suivre
              </Button>
              <Button size="sm" variant="outline">
                Contacter
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="mb-2 font-semibold">Biographie</h4>
            <p className="text-sm text-muted-foreground">
              Dr. Aminata Diallo est une experte reconnue en Intelligence Artificielle avec plus de 15 ans d'expérience
              dans la recherche et l'enseignement. Titulaire d'un doctorat de l'Université de Dakar, elle a travaillé
              sur des projets d'IA appliquée à l'agriculture et à la santé en Afrique de l'Ouest.
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">Expertise & Domaines</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Intelligence Artificielle</Badge>
              <Badge variant="secondary">Machine Learning</Badge>
              <Badge variant="secondary">Deep Learning</Badge>
              <Badge variant="secondary">Data Science</Badge>
              <Badge variant="secondary">Python</Badge>
              <Badge variant="secondary">TensorFlow</Badge>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">Réalisations</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Auteure de 20+ publications scientifiques en IA</li>
              <li>• Conférencière TEDx sur l'IA en Afrique</li>
              <li>• Consultante pour l'Union Africaine sur la stratégie IA</li>
              <li>• Fondatrice de l'AI Lab Dakar</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">Réseaux sociaux</h4>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </Button>
              <Button size="sm" variant="outline">
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </Button>
              <Button size="sm" variant="outline">
                <Globe className="mr-2 h-4 w-4" />
                Website
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Other Courses */}
      <div>
        <h3 className="mb-4 text-xl font-bold">Autres formations de ce formateur</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {otherCourses.map((course) => (
            <FormationCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  )
}
