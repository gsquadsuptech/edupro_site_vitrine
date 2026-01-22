import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { Code2, Briefcase, Building2, ArrowRight } from "lucide-react"
import Image from "next/image"

export function SkillPacksSection() {
    const skillPacks = [
        {
            icon: Code2,
            title: "TECH & DIGITAL MASTERY",
            headline: "Devenez expert en technologies digitales et IA",
            courses: [
                { name: "DATA ANALYTICS & IA", duration: "3-4 mois", level: "Débutant à Inter." },
                { name: "DÉVELOPPEMENT WEB", duration: "4-5 mois", level: "Débutant à Avancé" },
                { name: "DIGITAL MARKETING", duration: "2-3 mois", level: "Débutant à Inter." },
                { name: "CYBERSÉCURITÉ", duration: "3 mois", level: "Intermédiaire" },
            ],
            highlights: [
                "100+ heures de contenu vidéo",
                "50+ exercices pratiques et projets",
                "4 certifications professionnelles",
                "Accès à des datasets africains",
                "Portfolio de projets à présenter",
                "Support technique dédié",
            ],
            jobs: [
                "Data Analyst",
                "Développeur Web",
                "Digital Marketing Manager",
                "Community Manager",
                "Expert Cybersécurité",
                "Consultant IT",
            ],
            salary: "300K - 1,5M FCFA/mois",
            demand: "Très élevée",
            testimonial: {
                text: "Avant EduPro, j'étais assistant administratif à 150K FCFA/mois. Après le Skill Pack Data Analytics, j'ai décroché un poste de Data Analyst chez Orange CI à 600K. Ma vie a changé en 4 mois.",
                author: "Aya Kouassi, 28 ans",
                role: "Data Analyst chez Orange CI 🇨🇮",
            },
            image: "/african-professionals-working-with-data-analytics-.jpg",
        },
        {
            icon: Briefcase,
            title: "BUSINESS & LEADERSHIP EXCELLENCE",
            headline: "Dirigez, gérez, entreprenez avec les compétences des leaders africains",
            courses: [
                { name: "LEADERSHIP & MANAGEMENT", duration: "2-3 mois", level: "Tous niveaux" },
                { name: "GESTION DE PROJET", duration: "3 mois", level: "Débutant à Avancé" },
                { name: "ENTREPRENEURIAT", duration: "3-4 mois", level: "Tous niveaux" },
                { name: "FINANCE & COMPTABILITÉ", duration: "3 mois", level: "Débutant à Inter." },
                { name: "BUSINESS DEVELOPMENT", duration: "2-3 mois", level: "Intermédiaire" },
            ],
            highlights: [
                "80+ heures de contenu vidéo",
                "30+ cas pratiques africains",
                "5 certifications professionnelles",
                "Templates et outils prêts à l'emploi",
                "Études de cas entreprises africaines",
                "Accès à des mentors entrepreneurs",
            ],
            jobs: [
                "Manager / Directeur",
                "Chef de Projet",
                "Entrepreneur",
                "Business Developer",
                "Consultant",
                "Directeur Commercial",
            ],
            salary: "400K - 2M FCFA/mois (+ variable)",
            demand: "Très élevée",
            testimonial: {
                text: "Le parcours Entrepreneuriat m'a permis de structurer mon projet, lever 50M FCFA, et lancer ma startup EdTech qui emploie aujourd'hui 15 personnes. EduPro a été le déclencheur.",
                author: "Moussa Traoré, 32 ans",
                role: "Fondateur de TechLearn Mali 🇲🇱",
            },
            image: "/african-business-team-meeting-discussing-strategy-.jpg",
        },
        {
            icon: Building2,
            title: "CONSTRUCTION DURABLE & BIM",
            headline: "Bâtissez l'avenir avec les compétences de la construction moderne",
            courses: [
                { name: "ÉCO-CONSTRUCTION", duration: "3 mois", level: "Débutant à Inter." },
                { name: "BIM (BUILDING INFO MODELING)", duration: "4 mois", level: "Intermédiaire" },
                { name: "GESTION DE CHANTIER", duration: "3 mois", level: "Intermédiaire" },
                { name: "NORMES ENVIRONNEMENTALES", duration: "2 mois", level: "Intermédiaire" },
            ],
            highlights: [
                "70+ heures de contenu vidéo",
                "20+ projets pratiques de construction",
                "4 certifications sectorielles",
                "Logiciels BIM (licences étudiantes)",
                "Études de cas projets africains",
                "Réseau de professionnels du BTP",
            ],
            jobs: [
                "Ingénieur BIM",
                "Architecte",
                "Chef de Projet Construction",
                "Consultant",
                "Coordonnateur BIM",
                "Expert normes",
            ],
            salary: "350K - 1,8M FCFA/mois",
            demand: "Croissance forte",
            testimonial: {
                text: "Grâce au parcours BIM, je suis passé de dessinateur CAD à BIM Manager. Mon salaire a doublé et je travaille maintenant sur des projets internationaux depuis Dakar.",
                author: "Cheikh Diop, 35 ans",
                role: "BIM Manager, Cabinet d'architecture 🇸🇳",
            },
            image: "/african-construction-professional-using-bim-softwa.jpg",
        },
    ]

    return (
        <section id="skill-packs" className="py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                        3 Skill Packs pour 3 trajectoires de carrière
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Nos Skill Packs sont des programmes complets conçus pour vous faire passer de débutant à expert dans votre
                        domaine. Chaque pack combine théorie contextuelle, pratique intensive, et certification reconnue.
                    </p>
                </div>

                <div className="space-y-12">
                    {skillPacks.map((pack, index) => {
                        const Icon = pack.icon
                        const isEven = index % 2 === 0
                        return (
                            <div
                                key={index}
                                className={`rounded-2xl border border-border overflow-hidden ${isEven ? "bg-gradient-to-r from-primary/5 to-transparent" : "bg-gradient-to-r from-transparent to-chart-2/5"}`}
                            >
                                <div className={`grid gap-8 lg:grid-cols-2 p-8 md:p-12 ${isEven ? "" : "lg:grid-flow-dense"}`}>
                                    {/* Content */}
                                    <div className="space-y-6 flex flex-col justify-center">
                                        <div className="space-y-3">
                                            <div className="inline-flex rounded-lg bg-primary/10 p-3">
                                                <Icon className="h-8 w-8 text-primary" />
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-bold">{pack.title}</h3>
                                            <p className="text-lg text-muted-foreground">{pack.headline}</p>
                                        </div>

                                        {/* Courses */}
                                        <div className="space-y-3">
                                            <h4 className="font-semibold uppercase text-sm tracking-wide text-primary">Parcours inclus:</h4>
                                            <div className="grid gap-2">
                                                {pack.courses.map((course, idx) => (
                                                    <div key={idx} className="flex justify-between items-start text-sm">
                                                        <span className="font-medium">{course.name}</span>
                                                        <div className="text-xs text-muted-foreground text-right">
                                                            <div>{course.duration}</div>
                                                            <div>{course.level}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Highlights */}
                                        <div className="space-y-2">
                                            <h4 className="font-semibold uppercase text-sm tracking-wide text-primary">
                                                Ce que vous obtenez:
                                            </h4>
                                            <div className="grid gap-2">
                                                {pack.highlights.map((highlight, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                                        <span className="text-primary">✓</span>
                                                        <span>{highlight}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Jobs & Salary */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="rounded-lg bg-muted p-3">
                                                <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Métiers visés</p>
                                                <p className="text-sm font-medium line-clamp-2">{pack.jobs.slice(0, 2).join(", ")}...</p>
                                            </div>
                                            <div className="rounded-lg bg-muted p-3">
                                                <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Salaires moyens</p>
                                                <p className="text-sm font-medium">{pack.salary}</p>
                                            </div>
                                        </div>

                                        <Button asChild className="w-full gap-2 bg-primary hover:bg-primary/90 text-white">
                                            <a href="#signup">
                                                Découvrir ce Skill Pack
                                                <ArrowRight className="h-4 w-4" />
                                            </a>
                                        </Button>
                                    </div>

                                    {/* Testimonial & Image */}
                                    <div className={`space-y-4 flex flex-col ${isEven ? "" : "lg:order-first"}`}>
                                        <div className="relative aspect-video rounded-xl overflow-hidden">
                                            <Image src={pack.image || "/placeholder.svg"} alt={pack.title} fill className="object-cover" />
                                        </div>

                                        <div className="rounded-xl border border-border bg-card p-4">
                                            <blockquote className="text-sm font-medium italic mb-4">"{pack.testimonial.text}"</blockquote>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                                    <span className="text-xs font-bold text-primary">{pack.testimonial.author.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">{pack.testimonial.author}</p>
                                                    <p className="text-xs text-muted-foreground">{pack.testimonial.role}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Container>
        </section>
    )
}
