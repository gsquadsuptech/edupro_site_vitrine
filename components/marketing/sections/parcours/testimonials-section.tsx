import { Container } from "@/components/marketing/layout/container"
import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"
import Image from "next/image"

export function ParcoursTestimonials() {
  const testimonials = [
    {
      name: "Mariam Traoré",
      role: "Créatrice & Fondatrice",
      company: "Mariam Couture",
      location: "Bamako, Mali",
      image: "/african-woman-fashion-designer-happy.jpg",
      rating: 5,
      quote:
        "Cette formation a transformé ma passion en véritable entreprise. J'ai appris à structurer mes prix, à communiquer sur les réseaux sociaux et à gérer mon stock efficacement. Mon CA a doublé en 6 mois !",
      result: "CA × 2 en 6 mois",
    },
    {
      name: "Aminata Diop",
      role: "Entrepreneure Mode",
      company: "Aminata Design",
      location: "Dakar, Sénégal",
      image: "/african-woman-entrepreneur-fashion-smiling.jpg",
      rating: 5,
      quote:
        "Le module sur le branding m'a permis de clarifier mon identité de marque. Aujourd'hui, mes clientes me reconnaissent immédiatement. Les ateliers pratiques et le coaching personnalisé font toute la différence.",
      result: "15 nouvelles clientes/mois",
    },
    {
      name: "Fatoumata Kone",
      role: "Designer & Formatrice",
      company: "FK Fashion Academy",
      location: "Abidjan, Côte d'Ivoire",
      image: "/african-woman-fashion-educator-professional.jpg",
      rating: 5,
      quote:
        "Grâce à ce parcours, j'ai pu créer ma boutique e-commerce et automatiser ma communication. Le certificat m'a aussi permis de décrocher un partenariat avec une grande enseigne locale.",
      result: "Partenariat majeur",
    },
  ]

  return (
    <section className="border-b border-slate-200 bg-white py-20 lg:py-24">
      <Container>
        <div className="mb-16 text-center">
          <Badge className="mb-4 border-yellow-500/50 bg-yellow-50 text-yellow-700">Témoignages</Badge>
          <h2 className="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl">Elles ont transformé leur activité</h2>
          <p className="mx-auto max-w-3xl text-lg text-slate-600">
            Découvrez les succès inspirants des entrepreneures qui ont suivi ce parcours
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-slate-300 hover:shadow-lg"
            >
              {/* Quote icon */}
              <div className="absolute right-4 top-4 opacity-10">
                <Quote className="h-16 w-16 text-fuchsia-600" />
              </div>

              <div className="relative p-6">
                {/* Avatar and info */}
                <div className="mb-4 flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-slate-200">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                    <p className="text-xs text-slate-500">
                      {testimonial.company} • {testimonial.location}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="mb-4 text-sm leading-relaxed text-slate-700">"{testimonial.quote}"</p>

                {/* Result badge */}
                <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1">
                  <p className="text-xs font-semibold text-emerald-700">✓ {testimonial.result}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
