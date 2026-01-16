import { Star, Users, BookOpen, Linkedin, Twitter, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FormationCard } from "@/components/marketing/sections/marketplace/formation-card"
import { Course } from "@/lib/supabase/types"

interface InstructorTabProps {
  course: Course
}

export function InstructorTab({ course }: InstructorTabProps) {
  const instructor = course.instructor || { full_name: "Instructeur Inconnu", avatar_url: null };
  // Static placeholders for missing DB fields
  const otherCourses: any[] = [];

  return (
    <div className="space-y-8">
      {/* Instructor Profile */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-6 flex flex-col gap-6 md:flex-row">
          <img
            src={instructor.avatar_url || "/placeholder.svg?key=rvqxh"}
            alt={instructor.full_name}
            className="h-32 w-32 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="mb-2 text-2xl font-bold">{instructor.full_name}</h3>
            <p className="mb-3 text-muted-foreground">
              Formateur EduPro
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
