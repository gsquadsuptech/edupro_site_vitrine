import { Users, BookOpen, GraduationCap, Star } from "lucide-react"

export function MarketplaceStats() {
  const stats = [
    // {
    //   icon: Users,
    //   value: "50K+",
    //   label: "Apprenants",
    // },
    {
      icon: BookOpen,
      value: "100+",
      label: "Formations",
    },
    {
      icon: GraduationCap,
      value: "45+",
      label: "Formateurs",
    },
    {
      icon: Star,
      value: "80%",
      label: "Satisfaction",
    },
  ]

  return (
    <section className="border-b border-border bg-background py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-12 md:gap-24">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center w-[140px] md:w-auto">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <stat.icon className="h-7 w-7 text-primary" />
              </div>
              <div className="mb-1 text-3xl font-bold md:text-4xl">{stat.value}</div>
              <div className="text-sm text-muted-foreground md:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
