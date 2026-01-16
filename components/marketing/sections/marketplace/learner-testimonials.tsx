import { Star, Quote } from "lucide-react"

export function LearnerTestimonials() {
  const testimonials = [
    {
      name: "Aïcha Diop",
      role: "Data Analyst",
      location: "Dakar, Sénégal",
      avatar: "/african-professional-woman-smiling-headshot.jpg",
      rating: 5,
      text: "Grâce à EduPro, j'ai pu me reconvertir dans la Data Science. Les formations sont de qualité et adaptées au contexte africain. J'ai trouvé un emploi 2 mois après ma certification !",
      course: "Data Science avec Python",
    },
    {
      name: "Kwame Mensah",
      role: "Chef de Projet",
      location: "Abidjan, Côte d'Ivoire",
      avatar: "/african-professional-man-smiling-headshot.jpg",
      rating: 5,
      text: "Les formations en management m'ont permis d'évoluer vers un poste de chef de projet. Le contenu est pratique et directement applicable dans mon travail quotidien.",
      course: "Leadership et Management",
    },
    {
      name: "Fatima Hassan",
      role: "Développeuse Web",
      location: "Kigali, Rwanda",
      avatar: "/african-tech-professional-woman-headshot.jpg",
      rating: 5,
      text: "La flexibilité d'apprentissage est parfaite pour moi qui travaille à temps plein. Je peux apprendre à mon rythme et les formateurs sont très réactifs.",
      course: "Développement Web Full Stack",
    },
  ]

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold md:text-4xl">Ce que disent nos apprenants</h2>
          <p className="text-lg text-muted-foreground">Des milliers de professionnels ont transformé leur carrière</p>
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
