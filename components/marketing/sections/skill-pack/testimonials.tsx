import { Star, Quote } from "lucide-react"

export function SkillPackTestimonials() {
  const testimonials = [
    {
      name: "Mamadou Diop",
      role: "Développeur Full Stack",
      location: "Dakar, Sénégal",
      avatar: "/placeholder.svg?key=yj0v2",
      rating: 5,
      text: "Ce Skill Pack m'a permis de passer de débutant à développeur professionnel en 6 mois. J'ai trouvé un emploi avant même de terminer le parcours !",
      salary: "+150%",
    },
    {
      name: "Aïcha Diop",
      role: "Data Analyst",
      location: "Abidjan, Côte d'Ivoire",
      avatar: "/placeholder.svg?key=yj0v2",
      rating: 5,
      text: "Un investissement qui en vaut vraiment la peine. Le parcours est bien structuré et les projets pratiques m'ont donné un portfolio solide.",
      salary: "+200%",
    },
    {
      name: "Jean Kouassi",
      role: "Tech Lead",
      location: "Kigali, Rwanda",
      avatar: "/placeholder.svg?key=rvqxh",
      rating: 5,
      text: "Excellent rapport qualité-prix. J'ai pu monter en compétences rapidement et évoluer vers un poste de Tech Lead dans mon entreprise.",
      salary: "+180%",
    },
  ]

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold md:text-4xl">Témoignages</h2>
          <p className="text-lg text-muted-foreground">Ils ont transformé leur carrière avec ce Skill Pack</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="rounded-xl border border-border bg-card p-6">
              <Quote className="mb-4 h-8 w-8 text-primary/20" />

              <div className="mb-4 flex">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="mb-4 text-muted-foreground">{testimonial.text}</p>

              <div className="mb-4 rounded-lg bg-primary/10 p-3 text-center">
                <div className="text-2xl font-bold text-primary">{testimonial.salary}</div>
                <div className="text-xs text-muted-foreground">Augmentation de salaire</div>
              </div>

              <div className="flex items-center gap-3 border-t border-border pt-4">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
