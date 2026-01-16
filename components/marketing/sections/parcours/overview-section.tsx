import { Container } from "@/components/marketing/layout/container"
import { Target, BookOpen, GraduationCap, TrendingUp } from "lucide-react"

export function ParcoursOverview() {
  const highlights = [
    {
      icon: Target,
      title: "Objectif global",
      description:
        "Donner aux créatrices et entrepreneures africaines de la mode les clés pour transformer leur créativité en entreprise performante : stratégie, branding, gestion, distribution multicanal, expérience client et communication digitale.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: BookOpen,
      title: "Format",
      description:
        "Blended learning innovant combinant 70% d'e-learning interactif et 30% d'ateliers pratiques et de coaching personnalisé.",
      color: "from-purple-500 to-fuchsia-500",
    },
    {
      icon: GraduationCap,
      title: "Certification",
      description:
        "Certificat professionnel EDUPRO × SO'FATOO – Business of Fashion Essentials, reconnu par les acteurs majeurs du développement en Afrique.",
      color: "from-fuchsia-500 to-pink-500",
    },
    {
      icon: TrendingUp,
      title: "Impact carrière",
      description:
        "Les diplômées augmentent en moyenne leur chiffre d'affaires de 65% dans les 6 mois suivant la formation.",
      color: "from-pink-500 to-rose-500",
    },
  ]

  return (
    <section className="border-b border-slate-200 bg-slate-50 py-20 lg:py-24">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl">
            Un parcours complet pour transformer votre passion en business
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-slate-600">
            De la structuration juridique à la communication digitale, maîtrisez tous les aspects du business de la mode
            africaine
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-xl"
              >
                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
                />

                <div className="relative">
                  <div className={`mb-6 inline-flex rounded-2xl bg-gradient-to-r ${highlight.color} p-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  <h3 className="mb-4 text-xl font-bold text-slate-900">{highlight.title}</h3>

                  <p className="leading-relaxed text-slate-600">{highlight.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
