import { Container } from "@/components/marketing/layout/container"
import { Check } from "lucide-react"

export function DemoHeroSection() {
    const benefits = [
        "Tour complet de la plateforme",
        "Démonstration des outils IA",
        "Discussion sur vos enjeux spécifiques",
        "Plan de déploiement personnalisé"
    ]

    return (
        <div className="lg:pr-12">
            <h1 className="mb-6 text-balance text-4xl font-bold md:text-5xl lg:text-6xl">
                Voyez EduPro en action
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
                Réservez une démo personnalisée de 30 minutes. Pas de slides ennuyeux, juste du concret adapté à vos besoins.
            </p>

            <div className="space-y-6 mb-12">
                <h3 className="text-xl font-semibold text-foreground">Au programme de la démo :</h3>
                <ul className="space-y-4">
                    {benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                <Check className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-lg">{benefit}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-6">
                <div className="flex gap-4">
                    <div className="flex-shrink-0">
                        {/* Placeholder for trust logos or quote */}
                        <div className="text-4xl">❝</div>
                    </div>
                    <div>
                        <p className="mb-4 text-lg italic text-muted-foreground">
                            "La démo nous a convaincus en 15 minutes. L'interface est intuitive et les fonctionnalités RH sont exactement ce dont nous avions besoin."
                        </p>
                        <p className="font-semibold text-foreground">DRH, Groupe Industriel Panafricain</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
