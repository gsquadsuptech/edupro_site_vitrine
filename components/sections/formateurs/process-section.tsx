import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function FormateursProcessSection() {
    const steps = [
        {
            number: "01",
            title: "Candidature (5 min)",
            subtitle: "Parlez-nous de votre expertise",
            description:
                "Remplissez notre formulaire avec vos domaines d'expertise, votre expérience, et vos objectifs. Simple et rapide.",
            note: "Formulaire adapté : indépendant ou institut",
        },
        {
            number: "02",
            title: "Qualification (48h)",
            subtitle: "Nous validons votre profil",
            description:
                "Notre équipe analyse votre candidature et vous contacte sous 48h pour un échange téléphonique de qualification.",
            note: "Taux d'acceptation : 85% des candidats qualifiés",
        },
        {
            number: "03",
            title: "Onboarding (1 semaine)",
            subtitle: "Formation et accompagnement",
            description:
                "Accédez à notre bootcamp de formation, découvrez les outils, créez votre premier module avec notre support.",
            note: "Tutoriels vidéo + sessions live + support dédié",
        },
        {
            number: "04",
            title: "Lancement (Vous choisissez)",
            subtitle: "Publiez et commencez à former",
            description:
                "Une fois votre contenu prêt, publiez-le sur la plateforme. Nous gérons la promotion, vous gérez votre expertise.",
            note: "Dashboard analytique inclus",
        },
    ]

    return (
        <section className="py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Comment démarrer avec EduPro</h2>
                    <p className="text-lg text-muted-foreground">De l'inscription à votre première vente en 4 étapes</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            <div className="rounded-xl border border-border bg-card p-6 h-full">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 font-bold text-primary text-lg">
                                    {step.number}
                                </div>
                                <h3 className="mb-2 font-bold">{step.title}</h3>
                                <p className="mb-3 text-sm font-semibold text-muted-foreground">{step.subtitle}</p>
                                <p className="mb-4 text-sm text-muted-foreground">{step.description}</p>
                                <p className="text-xs italic text-chart-5">{step.note}</p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2">
                                    <ArrowRight className="h-5 w-5 text-primary/50" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Button size="lg" className="bg-gradient-to-r from-primary to-chart-2">
                        Commencer mon parcours maintenant
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </Container>
        </section>
    )
}
