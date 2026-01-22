import { Container } from "@/components/marketing/layout/container"
import { Star } from "lucide-react"
import Image from "next/image"

export function FormateursTestimonialsSection() {
    const testimonials = [
        {
            name: "Mariame WONE",
            role: "Coach - Formatrice",
            specialty: "Gestion de carrière et dynamiques professionnelles",
            quote:
                "Je tiens à remercier l'équipe pour l'initiative et l'accompagnement. Habituée aux webinaires et aux sessions en présentiel, j'ai découvert un format entièrement nouveau... et j'en ressors avec de vraies compétences! Grâce aux cours sous format vidéos visualisées en amont, la création de cours s'est faite facilement. Une collaboration inspirante que j'ai hâte de poursuivre.",
            image: "/african-professional-woman-smiling.jpg",
            course: "Gestion de carrière",
            rating: 5,
        },
        {
            name: "Auger MAYOUMA",
            role: "Coach - Formateur QHSE",
            specialty: "Qualité, Hygiène, Sécurité et Environnement",
            quote:
                "C'est une très bonne initiative d'avoir une plateforme qui répond aux besoins du continent africain. Plus on avançait je me suis rendu compte qu'en tant que formateur, nous avons les connaissances mais nous ne savions pas comment les dispenser à l'ère du digital. J'ai pu acquérir beaucoup de compétences au cours de ce bootcamp surtout la structuration des cours. Je commence à les appliquer dans mes formations au niveau de mon entreprise.",
            image: "/african-business-executive-male-professional.jpg",
            course: "QHSE & Sécurité",
            rating: 5,
        },
        {
            name: "Ibrahima YADE",
            role: "Coach - Formateur en Formation",
            specialty: "Formation de formateurs",
            quote:
                "Je félicite toute l'équipe de Edupro pour leur disponibilité et leur suivi lors de ce bootcamp. J'ai vécu une expérience enrichissante et inspirante. J'y ai appris à utiliser les outils digitaux et l'IA pour moderniser mes cours. Surtout, j'ai su adapter mes formations jadis en présentiel au format digital: modules structurés, quiz, certificats et suivi des apprenants. Aujourd'hui, je pourrais déployer mes sessions en ligne avec une meilleure expérience pour tous.",
            image: "/african-tech-professional-male-instructor.jpg",
            course: "Formation de formateurs",
            rating: 5,
        },
    ]

    return (
        <section className="py-20 md:py-32 bg-muted/30">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                        Ils ont digitalisé leur expertise avec EduPro
                    </h2>
                    <p className="text-lg text-muted-foreground">Des formateurs qui réussissent déjà</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="rounded-2xl border border-border bg-card p-8">
                            <div className="mb-6 overflow-hidden rounded-full h-20 w-20">
                                <Image
                                    src={testimonial.image || "/placeholder.svg"}
                                    alt={testimonial.name}
                                    width={80}
                                    height={80}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="mb-4">
                                <p className="font-bold">{testimonial.name}</p>
                                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                            </div>

                            <p className="mb-6 text-sm leading-relaxed italic text-muted-foreground">"{testimonial.quote}"</p>

                            <div className="mb-4 flex items-center gap-1">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-chart-1 text-chart-1" />
                                ))}
                            </div>

                            <div className="rounded-lg bg-muted/50 p-3">
                                <p className="text-xs font-medium text-muted-foreground">Formation digitalisée:</p>
                                <p className="text-sm font-semibold">{testimonial.course}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center text-sm text-muted-foreground">
                    <p>Plus de 150 formateurs et instituts nous font confiance à travers 3 pays africains</p>
                </div>
            </Container>
        </section>
    )
}
