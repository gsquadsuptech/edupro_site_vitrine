import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getAuthCookieDomain } from './cookie-domain'

// Singleton browser client — partagé par tous les composants/services du tab.
// Plusieurs instances → plusieurs GoTrue avec autoRefreshToken concurrent →
// `refresh_token_not_found` (400) en boucle puis `over_request_rate_limit`
// (429). Cf. logs Supabase Auth qofruhdfxvqfsdursqjv le 2026-05-04.
let browserClient: SupabaseClient | null = null

export function createClient(): SupabaseClient {
    if (typeof window === 'undefined') {
        // Pas de cache côté serveur (chaque requête doit avoir son propre
        // client lié à ses cookies). Mais ce module ne devrait pas être
        // importé côté serveur — utiliser lib/supabase/server.ts à la place.
        return buildClient()
    }
    if (!browserClient) {
        browserClient = buildClient()
    }
    return browserClient
}

function buildClient(): SupabaseClient {
    const domain = getAuthCookieDomain()
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        domain
            ? {
                  cookieOptions: {
                      domain,
                      path: '/',
                      sameSite: 'lax',
                      secure: true,
                  },
              }
            : undefined,
    )
}
