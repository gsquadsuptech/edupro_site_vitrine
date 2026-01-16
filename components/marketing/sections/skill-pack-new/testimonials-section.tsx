import { Container } from "@/components/marketing/layout/container"
import { Star, Quote } from "lucide-react"

import { LearningPath } from "@/lib/supabase/types"

interface SkillPackTestimonialsNewProps {
  skillPack?: LearningPath
}

export function SkillPackTestimonialsNew({ skillPack }: SkillPackTestimonialsNewProps) {
  const testimonials = [
    {
      name: "Aminata Diallo",
      role: "Data Analyst",
      company: "Orange Sénégal",
      image: "/african-professional-woman-smiling.jpg",
      rating: 5,
      text: "Grâce au Skill Pack Data & Décision intelligente, j'ai pu évoluer de junior à senior analyst en 8 mois. Les projets pratiques m'ont permis d'appliquer immédiatement mes acquis.",
      salary: "+60% de salaire",
      color: "from-violet-500 to-purple-500",
    },
    {
      name: "Kofi Mensah",
      role: "Marketing Manager",
      company: "Startup EdTech",
      image: "/african-male-professional-confident.jpg",
      rating: 5,
      text: "Le parcours Business Digital m'a donné toutes les clés pour digitaliser notre PME. Nous avons triplé nos ventes en ligne en 6 mois. Un investissement qui se rentabilise rapidement.",
      salary: "x3 CA digital",
      color: "from-cyan-500 to-blue-500",
    },
    {
      name: "Fatou Ndiaye",
      role: "Responsable RH",
      company: "Banque Régionale",
      image: "/african-woman-business-executive.jpg",
      rating: 5,
      text: "Le Skill Pack Leadership & Soft Skills a transformé ma façon de manager. Les outils concrets et les cas pratiques africains m'ont permis d'améliorer l'engagement de mon équipe de 40%.",
      salary: "+40% engagement équipe",
      color: "from-fuchsia-500 to-pink-500",
    },
  ]

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-slate-900" />

      <Container>
        <div className="relative">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 text-violet-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Quote className="h-4 w-4" />
              Témoignages
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-pretty">
              Ils ont transformé leur carrière
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto text-balance">
              Découvrez comment nos apprenants ont atteint leurs objectifs professionnels
            </p>
          </div>

          {/* Testimonials grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="relative group">
                {/* Card */}
                <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-violet-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/20">
                  {/* Quote icon */}
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${testimonial.color} mb-6`}>
                    <Quote className="h-5 w-5 text-white" />
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Testimonial text */}
                  <p className="text-slate-300 mb-6 leading-relaxed">"{testimonial.text}"</p>

                  {/* Impact badge */}
                  <div
                    className={`inline-flex items-center gap-2 bg-gradient-to-r ${testimonial.color} text-white px-4 py-2 rounded-full text-sm font-semibold mb-6`}
                  >
                    {testimonial.salary}
                  </div>

                  {/* Author info */}
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-700">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-slate-400">
                        {testimonial.role} • {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
