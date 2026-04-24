import { createBrowserClient } from '@supabase/ssr'
import { getAuthCookieDomain } from './cookie-domain'

export function createClient() {
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
