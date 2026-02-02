import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'fr'

    // Mock data for careers
    const positions = [
        {
            id: "frontend-developer",
            title: "Développeur Frontend Senior",
            department: "Engineering",
            location: "Dakar, Sénégal (Remote friendly)",
            type: "CDI",
            description: "Nous recherchons un expert React/Next.js pour diriger le développement de notre plateforme apprenant.",
            locale: "fr"
        },
        {
            id: "product-manager",
            title: "Product Manager EdTech",
            department: "Product",
            location: "Abidjan, Côte d'Ivoire",
            type: "CDI",
            description: "Vous définirez la roadmap produit en collaboration avec nos partenaires pédagogiques.",
            locale: "fr"
        },
        {
            id: "pedagogical-designer",
            title: "Ingénieur Pédagogique",
            department: "Content",
            location: "Kigali, Rwanda",
            type: "CDI",
            description: "Concevez des parcours de formation engageants et adaptés aux réalités locales.",
            locale: "fr"
        }
    ]

    // Filter by locale if needed in future, currently returning all for demo
    return NextResponse.json(positions)
}
