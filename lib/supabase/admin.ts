import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Client Supabase service-role — RÉSERVÉ AU CÔTÉ SERVEUR.
//
// Contourne le RLS. À n'utiliser QUE dans des chemins rendus côté serveur
// (Server Components, route handlers) et UNIQUEMENT pour des projections
// sûres : ne jamais renvoyer au navigateur des colonnes protégées
// (ex. `lessons.content`).
//
// Pourquoi : le catalogue public lit le plan de cours (sections + leçons) avec
// la clé anon, mais le RLS de `lessons` ne laisse l'anon lire que les leçons
// en aperçu. Résultat : « 0 leçons » sur les cours sans aperçu. On lit donc
// les métadonnées du curriculum (titre, durée, type — jamais `content`) via la
// clé service côté serveur, le contenu payant restant protégé par RLS.
let adminClient: SupabaseClient | null = null

export function createAdminClient(): SupabaseClient {
    if (typeof window !== 'undefined') {
        throw new Error(
            'createAdminClient ne doit jamais être appelé côté navigateur (clé service-role)',
        )
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY manquant (requis côté serveur)')
    }

    if (!adminClient) {
        adminClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            serviceKey,
            {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false,
                },
            },
        )
    }
    return adminClient
}
