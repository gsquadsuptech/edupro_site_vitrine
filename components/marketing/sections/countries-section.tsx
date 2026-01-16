import { Container } from "@/components/marketing/container"
import { MapPin } from "lucide-react"
import Image from "next/image"

export function CountriesSection() {
  const countries = [
    {
      flag: "🇸🇳",
      name: "SÉNÉGAL",
      city: "Dakar (HQ)",
      stats: [
        "200+ apprenants potentiels",
        "10 entreprises pilotes"
      ],
      image: "/placeholder.jpg"
    },
    {
      flag: "🇨🇮",
      name: "CÔTE D'IVOIRE",
      city: "Abidjan",
      stats: [
        "150+ apprenants potentiels",
        "8 entreprises intéressées"
      ],
      image: "/placeholder.jpg"
    },
    {
      flag: "🇷🇼",
      name: "RWANDA",
      city: "Kigali",
      stats: [
        "150+ apprenants potentiels",
        "Hub tech Afrique de l'Est"
      ],
      image: "/placeholder.jpg"
    }
  ]

  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            Déjà présents dans 3 pays, bientôt chez vous
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {countries.map((country, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-2xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={country.image}
                  alt={`${country.city}, ${country.name}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <div className="relative -mt-20 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-3xl shadow-lg">
                    {country.flag}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                      {country.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-white/90">
                      <MapPin className="h-3 w-3" />
                      <span>{country.city}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-background p-4">
                  <ul className="space-y-2">
                    {country.stats.map((stat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-primary">•</span>
                        <span className="text-muted-foreground">{stat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
