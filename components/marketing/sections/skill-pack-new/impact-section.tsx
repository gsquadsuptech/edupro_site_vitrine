import { Container } from "@/components/marketing/layout/container"
import { TrendingUp, Users, Award, Zap } from "lucide-react"

export function SkillPackImpact() {
  const impactStats = [
    {
      icon: Users,
      value: "10,000+",
      label: "Professionnels formés",
      color: "from-violet-500 to-purple-500",
    },
    {
      icon: TrendingUp,
      value: "+45%",
      label: "Augmentation salariale moyenne",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: Award,
      value: "92%",
      label: "Taux de certification",
      color: "from-fuchsia-500 to-pink-500",
    },
    {
      icon: Zap,
      value: "6 mois",
      label: "Pour devenir opérationnel",
      color: "from-amber-500 to-orange-500",
    },
  ]

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-violet-950/20 to-slate-900" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

      <Container>
        <div className="relative">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-pretty">
              Un impact mesurable sur votre carrière
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto text-balance">
              Rejoignez des milliers de professionnels qui ont transformé leur carrière avec nos skill packs
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="relative group">
                  {/* Card */}
                  <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-violet-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-1">
                    {/* Icon with gradient */}
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>

                    {/* Value */}
                    <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>

                    {/* Label */}
                    <div className="text-slate-400 text-sm">{stat.label}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
