import { Container } from "@/components/marketing/layout/container"
import { Star } from "lucide-react"

export function ProfessionalsTestimonialsSection() {
    const testimonials = [
        {
            name: "Aya Kouassi",
            role: "Data Analyst chez Orange CI",
            location: "🇨🇮 Côte d'Ivoire",
            content:
                "Avant EduPro, j'étais assistant administratif à 150K FCFA/mois. Après le Skill Pack Data Analytics, j'ai décroché un poste de Data Analyst chez Orange CI à 600K. Ma vie a changé en 4 mois.",
            impact: "Salaire: 150K → 600K FCFA",
            rating: 5,
        },
        {
            name: "Moussa Traoré",
            role: "Fondateur de TechLearn Mali",
            location: "🇲🇱 Mali",
            content:
                "Le parcours Entrepreneuriat m'a permis de structurer mon projet, lever 50M FCFA, et lancer ma startup EdTech qui emploie aujourd'hui 15 personnes. EduPro a été le déclencheur.",
            impact: "Projet lancé avec 50M FCFA levés",
            rating: 5,
        },
        {
            name: "Cheikh Diop",
            role: "BIM Manager, Cabinet d'architecture",
            location: "🇸🇳 Sénégal",
            content:
                "Grâce au parcours BIM, je suis passé de dessinateur CAD à BIM Manager. Mon salaire a doublé et je travaille maintenant sur des projets internationaux depuis Dakar.",
            impact: "Salaire doublé, projets internationaux",
            rating: 5,
        },
    ]

    return (
        <section className="py-20 md:py-32 bg-muted/30">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Les succès de nos apprenants</h2>
                    <p className="text-lg text-muted-foreground">Des transformations de carrière concrètes et mesurables</p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow flex flex-col"
                        >
                            <div className="mb-4 flex gap-1">
                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                ))}
                            </div>

                            <p className="mb-6 flex-1 text-sm leading-relaxed italic">{testimonial.content}</p>

                            <div className="border-t border-border pt-4 mb-4">
                                <p className="text-sm font-semibold text-primary mb-1">{testimonial.impact}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center text-white font-bold">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold">{testimonial.name}</p>
                                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    )
}
