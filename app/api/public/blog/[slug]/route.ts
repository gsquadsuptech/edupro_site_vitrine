import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET - Récupérer un article publié par slug
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
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
        const { slug } = await params

        const { searchParams } = new URL(request.url)
        const locale = searchParams.get('locale') || 'fr'
        const preview = searchParams.get('preview') === 'true' // Permet de voir les articles non publiés

        // Chercher l'article par slug_fr ou slug_en selon la locale
        const slugField = locale === 'fr' ? 'slug_fr' : 'slug_en'

        let query = supabase
            .from('blog_articles')
            .select('*')
            .eq(slugField, slug)

        // Si ce n'est pas une prévisualisation, filtrer uniquement les articles publiés
        if (!preview) {
            query = query.eq('status', 'published')
        }

        const { data, error } = await query.single()

        if (error || !data) {
            console.error('Erreur lors de la récupération de l\'article:', error)
            return NextResponse.json(
                { error: "Article non trouvé" },
                { status: 404 }
            )
        }

        // Transformer les données pour retourner les champs selon la locale demandée
        const transformedData = {
            id: data.id,
            title: locale === 'fr' ? data.title_fr : data.title_en,
            slug: locale === 'fr' ? data.slug_fr : data.slug_en,
            excerpt: locale === 'fr' ? data.excerpt_fr : data.excerpt_en,
            content: locale === 'fr' ? data.content_fr : data.content_en,
            category: locale === 'fr' ? data.category_fr : data.category_en,
            image_url: data.image_url,
            author_name: data.author_name,
            author_role: data.author_role,
            author_avatar_url: data.author_avatar_url,
            read_time: locale === 'fr' ? data.read_time_fr : data.read_time_en,
            meta_title: locale === 'fr' ? data.meta_title_fr : data.meta_title_en,
            meta_description: locale === 'fr' ? data.meta_description_fr : data.meta_description_en,
            tags: locale === 'fr' ? data.tags_fr : data.tags_en,
            published_at: data.published_at,
            locale: locale,
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
