import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET - Récupérer un poste par ID (public, seulement si ouvert)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
            return NextResponse.json(
                { error: "Configuration Supabase manquante" },
                { status: 500 }
            )
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        // In Next 15, params is a promise
        const { id } = await params

        const { searchParams } = new URL(request.url)
        const locale = searchParams.get('locale') || 'fr'

        const { data, error } = await supabase
            .from('career_positions')
            .select('*')
            .eq('id', id)
            .eq('status', 'open')
            .single()

        if (error || !data) {
            return NextResponse.json(
                { error: "Poste non trouvé" },
                { status: 404 }
            )
        }

        // Vérifier que le poste a du contenu dans la langue demandée
        const hasContent = locale === 'fr'
            ? (data.title_fr || data.description_fr)
            : (data.title_en || data.description_en)

        if (!hasContent) {
            return NextResponse.json(
                { error: "Poste non disponible dans cette langue" },
                { status: 404 }
            )
        }

        // Transformer les données pour retourner seulement les champs de la langue demandée
        const transformedData = {
            id: data.id,
            locale: locale,
            title: locale === 'fr' ? data.title_fr : data.title_en,
            department: data.department,
            location: data.location,
            type: data.type,
            description: locale === 'fr' ? data.description_fr : data.description_en,
            requirements: locale === 'fr' ? data.requirements_fr : data.requirements_en,
            benefits: locale === 'fr' ? data.benefits_fr : data.benefits_en,
            closing_date: data.closing_date,
        }

        return NextResponse.json(transformedData)
    } catch (error) {
        console.error('Erreur serveur:', error)
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        )
    }
}
