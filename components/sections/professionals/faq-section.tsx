"use client"

import { Container } from "@/components/marketing/layout/container"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const faqCategories = [
        {
            category: "📱 INSCRIPTION & ACCÈS",
            items: [
                {
                    q: "Comment créer mon compte?",
                    a: "C'est très simple: Cliquez sur 'Créer mon compte gratuit', renseignez email + mot de passe, choisissez votre pays, validez votre email. Durée totale: 2 minutes. Pas besoin de carte bancaire pour commencer.",
                },
                {
                    q: "Quels moyens de paiement acceptez-vous?",
                    a: "Nous acceptons Mobile Money (Orange Money, Wave, MTN, M-Pesa), cartes bancaires (Visa, Mastercard), et virements bancaires. Pas de carte bancaire requise si vous payez en Mobile Money!",
                },
                {
                    q: "Ai-je un accès à vie aux formations achetées?",
                    a: "Cela dépend de la formation. Certaines offrent un accès à vie, d'autres une durée limitée (ex: 6 mois, 1 an). Les conditions d'accès sont clairement indiquées sur la fiche de chaque formation.",
                },
            ],
        },
        {
            category: "📚 CONTENU & APPRENTISSAGE",
            items: [
                {
                    q: "Quels sont les formats de formation proposés?",
                    a: "Nous proposons deux formats: Auto-formation (asynchrone) - apprenez 24/7 à votre rythme, ou Sessions en cohorte (hybride) - groupe avec sessions live et interaction directe. Chaque formation indique clairement son format.",
                },
                {
                    q: "Dois-je avoir des connaissances préalables?",
                    a: "Cela dépend de la formation. Chaque cours indique son niveau requis (débutant, intermédiaire, avancé) et ses prérequis. Les formations débutant n'ont généralement aucun prérequis.",
                },
                {
                    q: "Les formations sont-elles en français uniquement?",
                    a: "Non! Nous proposons contenus en français, anglais, et certaines langues locales. L'interface de la plateforme est en français et anglais. La langue de chaque cours est clairement indiquée.",
                },
                {
                    q: "Puis-je apprendre depuis mon téléphone?",
                    a: "Oui! EduPro est 100% mobile-friendly avec interface optimisée, vidéos adaptatives, et mode hors ligne. 78% de nos apprenants utilisent principalement leur smartphone!",
                },
                {
                    q: "Que se passe-t-il si je n'ai pas toujours Internet?",
                    a: "Aucun problème! Mode hors ligne permet de télécharger les vidéos et consulter les contenus sans connexion. Nous avons pensé à la réalité de la connectivité en Afrique avec optimisation bande passante.",
                },
            ],
        },
        {
            category: "🏆 CERTIFICATIONS & CARRIÈRE",
            items: [
                {
                    q: "Les certificats EduPro sont-ils de qualité?",
                    a: "Oui! Créés selon les plus hauts standards: co-certifiés avec des experts, validant des compétences pratiques mesurables, alignés sur les besoins réels du marché, régulièrement mis à jour.",
                },
                {
                    q: "EduPro aide-t-il à trouver un emploi?",
                    a: "Oui! Nous accompagnons avec certificats de compétences avérées, portfolio de projets, et communauté professionnelle active. Nous développons des partenariats avec des entreprises pour faciliter le recrutement.",
                },
            ],
        },
        {
            category: "👨‍🏫 PÉDAGOGIE & SUPPORT",
            items: [
                {
                    q: "Les cours sont-ils à jour?",
                    a: "Oui! Révisions majeures tous les 6-12 mois, ajouts de contenus en continu, corrections dès signalement. Le digital évolue vite, nous assurons que vous apprenez toujours les compétences actuelles.",
                },
            ],
        },
        {
            category: "🌍 AUTRES QUESTIONS",
            items: [
                {
                    q: "EduPro est disponible dans quels pays?",
                    a: "Actuellement: Sénégal, Côte d'Ivoire, Rwanda. Accessible depuis n'importe où, même d'autres pays africains.",
                },
                {
                    q: "Puis-je apprendre avec des amis/collègues?",
                    a: "Oui, c'est encouragé! Créez des groupes d'étude privés, partagez notes et projets, discutez dans les groupes. Apprendre en groupe augmente la motivation et favorise l'entraide!",
                },
            ],
        },
    ]

    return (
        <section className="py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Questions fréquentes</h2>
                    <p className="text-lg text-muted-foreground">Tout ce que vous devez savoir avant de commencer</p>
                </div>

                <div className="max-w-3xl mx-auto space-y-8">
                    {faqCategories.map((category, catIndex) => (
                        <div key={catIndex}>
                            <h3 className="text-lg font-bold mb-4 text-primary">{category.category}</h3>
                            <div className="space-y-3">
                                {category.items.map((item, itemIndex) => (
                                    <div
                                        key={itemIndex}
                                        className="rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <button
                                            onClick={() =>
                                                setOpenIndex(openIndex === catIndex * 100 + itemIndex ? null : catIndex * 100 + itemIndex)
                                            }
                                            className="w-full px-6 py-4 flex items-center justify-between bg-card hover:bg-muted/50 transition-colors"
                                        >
                                            <h4 className="text-left font-semibold text-sm md:text-base">{item.q}</h4>
                                            <ChevronDown
                                                className={`h-5 w-5 flex-shrink-0 text-primary transition-transform ${openIndex === catIndex * 100 + itemIndex ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </button>
                                        {openIndex === catIndex * 100 + itemIndex && (
                                            <div className="px-6 py-4 bg-muted/30 border-t border-border">
                                                <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    )
}
