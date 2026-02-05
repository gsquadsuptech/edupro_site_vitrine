import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET - Liste des postes ouverts (filtre par locale)
export async function GET(request: NextRequest) {
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

        const { searchParams } = new URL(request.url)
        const locale = searchParams.get('locale') || 'fr'
        const department = searchParams.get('department')

        // Construire la requête pour les postes ouverts uniquement
        // Filtrer pour ne retourner que les postes qui ont du contenu dans la langue demandée
        let query = supabase
            .from('career_positions')
            .select('*')
            .eq('status', 'open')
            .order('created_at', { ascending: false })

        // Filtrer selon la langue : FR nécessite title_fr, EN nécessite title_en
        if (locale === 'fr') {
            query = query.not('title_fr', 'is', null)
        } else {
            query = query.not('title_en', 'is', null)
        }

        if (department) {
            query = query.eq('department', department)
        }

        const { data, error } = await query

        if (error) {
            console.error('Erreur lors de la récupération des postes:', error)
            return NextResponse.json(
                { error: "Erreur lors de la récupération des postes" },
                { status: 500 }
            )
        }

        // Transformer les données pour retourner seulement les champs de la langue demandée
        const transformedData = (data || []).map((position: any) => ({
            id: position.id,
            locale: locale,
            title: locale === 'fr' ? position.title_fr : position.title_en,
            department: position.department,
            location: position.location,
            type: position.type,
            description: locale === 'fr' ? position.description_fr : position.description_en,
            requirements: locale === 'fr' ? position.requirements_fr : position.requirements_en,
            benefits: locale === 'fr' ? position.benefits_fr : position.benefits_en,
            status: position.status,
            closing_date: position.closing_date,
            created_at: position.created_at,
            updated_at: position.updated_at,
        }))

        return NextResponse.json(transformedData)
    } catch (error) {
        console.error('Erreur serveur:', error)
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        )
    }
}
