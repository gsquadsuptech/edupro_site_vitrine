import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET - Récupérer le contenu légal pour une locale (API publique)
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

        const { data, error } = await supabase
            .from('legal_content')
            .select('id, locale, content, updated_at')
            .eq('locale', locale)
            .single()

        if (error) {
            // Si aucun contenu n'existe pour cette locale, retourner null
            if (error.code === 'PGRST116') {
                return NextResponse.json(null)
            }
            console.error('Erreur lors de la récupération du contenu légal:', error)
            return NextResponse.json(
                { error: "Erreur lors de la récupération du contenu légal" },
                { status: 500 }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Erreur serveur:', error)
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        )
    }
}
