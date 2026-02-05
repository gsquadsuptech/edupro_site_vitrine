import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET - Liste des articles publiés (filtre par locale)
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
        const category = searchParams.get('category')
        const limit = searchParams.get('limit') ? Number.parseInt(searchParams.get('limit')!) : undefined

        // Construire la requête pour les articles publiés uniquement
        // Filtrer pour ne retourner que les articles qui ont du contenu dans la locale demandée
        const titleField = locale === 'fr' ? 'title_fr' : 'title_en'
        let query = supabase
            .from('blog_articles')
            .select('*')
            .eq('status', 'published')
            .not(titleField, 'is', null)
            .order('published_at', { ascending: false })

        if (category) {
            const categoryField = locale === 'fr' ? 'category_fr' : 'category_en'
            query = query.eq(categoryField, category)
        }

        if (limit) {
            query = query.limit(limit)
        }

        const { data, error } = await query

        if (error) {
            console.error('Erreur lors de la récupération des articles:', error)
            return NextResponse.json(
                { error: "Erreur lors de la récupération des articles" },
                { status: 500 }
            )
        }

        // Transformer les données pour retourner les champs selon la locale demandée
        const transformedData = (data || []).map((article: any) => ({
            id: article.id,
            title: locale === 'fr' ? article.title_fr : article.title_en,
            slug: locale === 'fr' ? article.slug_fr : article.slug_en,
            excerpt: locale === 'fr' ? article.excerpt_fr : article.excerpt_en,
            content: locale === 'fr' ? article.content_fr : article.content_en,
            category: locale === 'fr' ? article.category_fr : article.category_en,
            image_url: article.image_url,
            author_name: article.author_name,
            author_role: article.author_role,
            author_avatar_url: article.author_avatar_url,
            read_time: locale === 'fr' ? article.read_time_fr : article.read_time_en,
            meta_title: locale === 'fr' ? article.meta_title_fr : article.meta_title_en,
            meta_description: locale === 'fr' ? article.meta_description_fr : article.meta_description_en,
            tags: locale === 'fr' ? article.tags_fr : article.tags_en,
            published_at: article.published_at,
            locale: locale,
        })).filter((article: any) => article.title && article.slug) // Filtrer les articles sans titre ou slug dans cette locale

        return NextResponse.json(transformedData)
    } catch (error) {
        console.error('Erreur serveur:', error)
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        )
    }
}
