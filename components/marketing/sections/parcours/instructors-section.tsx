import { Container } from "@/components/marketing/layout/container"
import { Badge } from "@/components/ui/badge"
import { Linkedin } from "lucide-react"
import Image from "next/image"

export function ParcoursInstructors() {
  const instructors = [
    {
      name: "Aïcha Diallo",
      title: "Fondatrice SO'FATOO",
      image: "/african-woman-fashion-entrepreneur-smiling.jpg",
      bio: "Entrepreneure mode avec 15 ans d'expérience, Aïcha a accompagné plus de 200 créatrices africaines dans le développement de leurs marques.",
      expertise: ["Branding", "Stratégie Mode", "Mentorat"],
      linkedin: "#",
    },
    {
      name: "Fatou Sarr",
      title: "Experte en Marketing Digital",
      image: "/african-woman-marketing-professional.jpg",
      bio: "Spécialiste du marketing digital pour le secteur créatif africain, elle forme les entrepreneurs à la communication digitale depuis 8 ans.",
      expertise: ["Marketing Digital", "Social Media", "Content Creation"],
      linkedin: "#",
    },
    {
      name: "Mamadou Koné",
      title: "Consultant en Gestion d'Entreprise",
      image: "/african-man-business-consultant.jpg",
      bio: "Ancien directeur financier et consultant, il accompagne les PME africaines dans leur structuration et leur croissance.",
      expertise: ["Finance", "Gestion", "Business Planning"],
      linkedin: "#",
    },
  ]

  return (
    <section className="border-b border-slate-200 bg-slate-50 py-20 lg:py-24">
      <Container>
        <div className="mb-16 text-center">
          <Badge className="mb-4 border-fuchsia-500/50 bg-fuchsia-50 text-fuchsia-700">Formateurs experts</Badge>
          <h2 className="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl">
            Apprenez auprès de professionnels reconnus
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-slate-600">
            Des experts qui ont fait leurs preuves dans le business de la mode africaine
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {instructors.map((instructor, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-slate-300 hover:shadow-lg"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={instructor.image || "/placeholder.svg"}
                  alt={instructor.name}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />

                {/* LinkedIn badge */}
                <a
                  href={instructor.linkedin}
                  className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white/90 p-2 backdrop-blur-sm transition-colors hover:bg-indigo-600"
                >
                  <Linkedin className="h-5 w-5 text-slate-700 hover:text-white" />
                </a>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900">{instructor.name}</h3>
                <p className="mb-4 text-sm text-indigo-600">{instructor.title}</p>
                <p className="mb-4 text-sm leading-relaxed text-slate-600">{instructor.bio}</p>

                <div className="flex flex-wrap gap-2">
                  {instructor.expertise.map((skill, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
