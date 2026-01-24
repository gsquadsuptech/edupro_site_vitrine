import { MapPin, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Container } from "@/components/marketing/layout/container"

const positions = [
    {
        title: "Développeur Full-Stack Senior",
        department: "Tech",
        location: "Dakar / Remote",
        type: "CDI",
        description:
            "Rejoignez notre équipe tech pour construire la prochaine génération de notre plateforme d'apprentissage.",
    },
    {
        title: "Product Designer",
        department: "Design",
        location: "Abidjan / Remote",
        type: "CDI",
        description:
            "Créez des expériences utilisateur exceptionnelles pour nos apprenants et formateurs à travers l'Afrique.",
    },
    {
        title: "Business Developer",
        department: "Sales",
        location: "Dakar",
        type: "CDI",
        description: "Développez notre réseau de partenaires entreprises et instituts de formation en Afrique francophone.",
    },
    {
        title: "Content Marketing Manager",
        department: "Marketing",
        location: "Remote",
        type: "CDI",
        description: "Élaborez et exécutez notre stratégie de contenu pour engager notre communauté grandissante.",
    },
]

export function CareersPositionsSection() {
    return (
        <section id="positions" className="py-20 md:py-32 bg-muted/30">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Postes ouverts</h2>
                    <p className="text-lg text-muted-foreground">Trouvez votre place dans notre équipe</p>
                </div>

                <div className="grid gap-6">
                    {positions.map((position, index) => (
                        <div key={index} className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="flex-1">
                                    <div className="mb-3 flex flex-wrap items-center gap-2">
                                        <h3 className="text-xl font-bold">{position.title}</h3>
                                        <Badge variant="secondary">{position.department}</Badge>
                                    </div>

                                    <p className="mb-4 text-muted-foreground">{position.description}</p>

                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            {position.location}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            {position.type}
                                        </div>
                                    </div>
                                </div>

                                <Button className="group">
                                    Postuler
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-chart-2/5 p-8 text-center">
                    <h3 className="mb-3 text-2xl font-bold">Vous ne trouvez pas le poste idéal ?</h3>
                    <p className="mb-6 text-muted-foreground">
                        Envoyez-nous une candidature spontanée. Nous sommes toujours à la recherche de talents exceptionnels !
                    </p>
                    <Button size="lg" variant="outline">
                        Candidature spontanée
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </Container>
        </section>
    )
}
