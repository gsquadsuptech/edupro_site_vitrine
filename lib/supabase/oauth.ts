import { createClient } from '@/lib/supabase/client'

export type OAuthProvider = 'google' | 'facebook'

/**
 * Lance le flux OAuth Supabase (redirection navigateur vers le provider).
 *
 * `redirectTo` doit être une URL absolue déclarée dans Supabase →
 * Authentication → URL Configuration → Redirect URLs. Sans cela Supabase
 * ignore le paramètre et renvoie vers le Site URL (app.edupro.africa),
 * l'utilisateur perd donc le contexte de la page d'origine.
 *
 * En cas de succès la fonction ne « rend pas la main » : le navigateur
 * quitte la page. L'appelant doit donc laisser son état de chargement actif.
 */
export async function signInWithProvider(
    provider: OAuthProvider,
    redirectTo?: string,
): Promise<{ success: boolean; error: { message?: string } | null }> {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: redirectTo ?? (typeof window !== 'undefined' ? window.location.href : undefined),
        },
    })
    return { success: !error, error }
}
