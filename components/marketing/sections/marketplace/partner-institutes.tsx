"use client"

export function PartnerInstitutes() {
  // Static Data
  const instructors = [
    { id: 'inst-1', name: "Jean Dupont", avatar_url: "/placeholder.svg", specialization: "Digital" },
    { id: 'inst-2', name: "Marie Curie", avatar_url: "/placeholder.svg", specialization: "Science" },
    { id: 'inst-3', name: "Albert Einstein", avatar_url: "/placeholder.svg", specialization: "Physique" },
    { id: 'inst-4', name: "Ada Lovelace", avatar_url: "/placeholder.svg", specialization: "Code" },
    { id: 'inst-5', name: "Nikola Tesla", avatar_url: "/placeholder.svg", specialization: "Energie" },
    { id: 'inst-6', name: "Steve Jobs", avatar_url: "/placeholder.svg", specialization: "Innovation" }
  ]

  return (
    <section className="border-y border-border bg-background py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold md:text-3xl">Nos Formateurs Experts</h2>
          <p className="text-muted-foreground">Ils nous font confiance pour diffuser leurs formations</p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {instructors.map((instructor, index) => (
            <div key={instructor.id} className="flex flex-col items-center justify-center gap-2 grayscale transition-all hover:grayscale-0 group">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-transparent group-hover:border-primary transition-colors">
                <img
                  src={instructor.avatar_url || "/placeholder.svg"}
                  alt={instructor.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-xs font-medium text-center text-muted-foreground group-hover:text-primary transition-colors line-clamp-1">
                {instructor.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
