import { Container } from "@/components/marketing/layout/container"
import { Target, BookOpen, GraduationCap, TrendingUp } from "lucide-react"
import { LearningPath } from "@/lib/supabase/types"

interface ParcoursOverviewProps {
  learningPath: LearningPath
}

const FORMAT_LABELS: Record<string, string> = {
  'auto-formation': 'Auto-formation à votre rythme',
  'session': 'Sessions cohorte avec accompagnement',
  'blended': 'Blended learning : e-learning + ateliers',
  'live': 'Sessions en direct',
}

export function ParcoursOverview({ learningPath }: ParcoursOverviewProps) {
  const objectivesText = learningPath.objectives && learningPath.objectives.length > 0
    ? learningPath.objectives.join(' • ')
    : (learningPath.description || 'Maîtrisez les compétences clés de ce parcours.')

  const formatLabel = learningPath.format
    ? (FORMAT_LABELS[learningPath.format] || learningPath.format)
    : 'Format flexible adapté à votre rythme'

  const hasCertificate = !!(learningPath.enable_certificate || learningPath.certificate_template_id)

  const highlights = [
    {
      icon: Target,
      title: "Objectif global",
      description: objectivesText,
      color: "from-indigo-500 to-purple-500",
      visible: true,
    },
    {
      icon: BookOpen,
      title: "Format",
      description: formatLabel,
      color: "from-purple-500 to-fuchsia-500",
      visible: true,
    },
    {
      icon: GraduationCap,
      title: "Certification",
      description: hasCertificate
        ? "Certificat professionnel délivré à la complétion du parcours."
        : "Attestation de réussite à la fin du parcours.",
      color: "from-fuchsia-500 to-pink-500",
      visible: true,
    },
    {
      icon: TrendingUp,
      title: "Résultats attendus",
      description: learningPath.highlights && learningPath.highlights.length > 0
        ? learningPath.highlights.join(' • ')
        : "Acquérir des compétences concrètes pour développer votre activité.",
      color: "from-pink-500 to-rose-500",
      visible: true,
    },
  ].filter(h => h.visible)

  return (
    <section className="border-b border-slate-200 bg-slate-50 py-20 lg:py-24">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl">
            Un parcours complet pour atteindre vos objectifs
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-slate-600">
            Tout ce que vous devez savoir avant de vous lancer
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
