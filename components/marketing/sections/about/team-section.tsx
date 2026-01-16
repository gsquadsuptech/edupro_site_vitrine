import { Container } from "@/components/marketing/layout/container"
import Image from "next/image"
import { Linkedin, Twitter } from "lucide-react"

export function TeamSection() {
  const team = [
    {
      name: "Co-fondateur 1",
      role: "CEO & Co-fondateur",
      background: "Ancien Lead Product chez Scale-up Tech",
      expertise: "Expert en EdTech et plateforme SaaS",
      education: "MBA INSEAD, BS Engineering",
      location: "Dakar, Sénégal",
      experience: "10+ ans d'expérience tech en Afrique",
      quote: "Ma mission : prouver que l'Afrique peut créer les meilleurs outils tech du monde.",
      image: "/african-male-tech-ceo-professional-portrait-smilin.jpg",
    },
    {
      name: "Co-fondatrice 2",
      role: "CPO & Co-fondatrice",
      background: "Ancienne Head of Learning en formation continue",
      expertise: "15+ ans dans le design pédagogique",
      education: "PhD Éducation, MA Pédagogie Digitale",
      location: "Abidjan, Côte d'Ivoire",
      experience: "Transformé 5000+ parcours d'apprentissage",
      quote: "Je crois que chaque Africain mérite un accès aux meilleurs contenus de formation.",
      image: "/african-female-education-expert-professional-portr.jpg",
    },
    {
      name: "Co-fondateur 3",
      role: "CTO & Co-fondateur",
      background: "Ex-Lead Developer Startup/Scale-up",
      expertise: "Spécialiste IA et architecture cloud",
      education: "MS Computer Science, BS Engineering",
      location: "Kigali, Rwanda",
      experience: "Construit des systèmes pour l'Afrique",
      quote: "La tech est notre superpouvoir pour démocratiser l'accès à l'excellence.",
      image: "/african-male-software-engineer-professional-portra.jpg",
    },
  ]

  return (
    <section className="bg-muted/30 py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">Les visages derrière la mission</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            EduPro est portée par une équipe passionnée, diverse, et profondément engagée. Nous combinons expertise
            tech, vision pédagogique et expérience business pour créer quelque chose d'unique.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {team.map((member, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-xl"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6">
                <h3 className="mb-1 text-xl font-bold">{member.name}</h3>
                <p className="mb-4 text-sm font-semibold text-primary">{member.role}</p>

                <div className="mb-4 space-y-2 text-sm text-muted-foreground">
                  <p>{member.background}</p>
                  <p className="font-medium text-foreground">{member.expertise}</p>
                </div>

                <div className="mb-4 space-y-1 text-sm">
                  <p>🎓 {member.education}</p>
                  <p>📍 {member.location}</p>
                  <p>🌍 {member.experience}</p>
                </div>

                <div className="mb-4 rounded-lg bg-primary/5 p-4">
                  <p className="text-sm italic text-foreground">"{member.quote}"</p>
                </div>

                <div className="flex gap-3">
                  <a
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
