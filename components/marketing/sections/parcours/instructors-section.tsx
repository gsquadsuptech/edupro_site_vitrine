import { Container } from "@/components/marketing/layout/container"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { LearningPath } from "@/lib/supabase/types"

interface ParcoursInstructorsProps {
  learningPath: LearningPath
}

export function ParcoursInstructors({ learningPath }: ParcoursInstructorsProps) {
  const instructors = learningPath.instructors || []

  // Pas d'instructeurs renseignés en V1 — masquer la section.
  // TODO: agréger les instructeurs depuis learning_path_courses.course.instructor une fois exposé côté service.
  if (instructors.length === 0) {
    return null
  }

  return (
    <section className="border-b border-slate-200 bg-slate-50 py-20 lg:py-24">
      <Container>
        <div className="mb-16 text-center">
          <Badge className="mb-4 border-fuchsia-500/50 bg-fuchsia-50 text-fuchsia-700">Formateurs</Badge>
          <h2 className="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl">
            Apprenez auprès de professionnels reconnus
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {instructors.map((instructor, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-slate-300 hover:shadow-lg"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={instructor.avatar_url || "/placeholder.svg"}
                  alt={instructor.name}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900">{instructor.name}</h3>
                {instructor.institute && (
                  <p className="mb-4 text-sm text-indigo-600">{instructor.institute}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
