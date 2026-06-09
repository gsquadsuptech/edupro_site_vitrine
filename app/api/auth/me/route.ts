import { createClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const runtime = 'nodejs'

export async function GET() {
    try {
        // 1. Get the authenticated user from the cookie-based session
        const supabase = await createServerClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        // 2. Enrichissement des rôles via organization_members (service_role,
        //    bypass RLS). BEST-EFFORT : une absence de clé service ou une erreur
        //    de requête ne doit PAS bloquer l'utilisateur — un apprenant connecté
        //    doit toujours obtenir au minimum le rôle 'student' (sinon le menu
        //    « Espace Formation » disparaît, cf. divergence staging/prod).
        let memberships: Array<{ role: string | null; role_code: string | null; organization_id: string | null }> = []

        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
            try {
                const supabaseAdmin = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL,
                    process.env.SUPABASE_SERVICE_ROLE_KEY,
                    { auth: { autoRefreshToken: false, persistSession: false } }
                )

                const { data, error: memberError } = await supabaseAdmin
                    .from('organization_members')
                    .select('role, role_code, organization_id, is_active')
                    .eq('user_id', user.id)
                    .eq('is_active', true)

                if (memberError) {
                    console.error('[/api/auth/me] Error fetching memberships (non-fatal):', memberError)
                } else {
                    memberships = data ?? []
                }
            } catch (e) {
                console.error('[/api/auth/me] Membership lookup failed (non-fatal):', e)
            }
        } else {
            console.warn('[/api/auth/me] SUPABASE_SERVICE_ROLE_KEY absent — rôles limités au fallback (student).')
        }

        // 3. Rôles uniques depuis les memberships, sinon metadata, sinon 'student'
        const uniqueRoles = [...new Set(memberships.map(m => m.role).filter(Boolean) as string[])]

        if (uniqueRoles.length === 0) {
            const metadataRole = user.user_metadata?.role
            if (metadataRole) uniqueRoles.push(metadataRole)
        }
        if (uniqueRoles.length === 0) {
            uniqueRoles.push('student')
        }

        return NextResponse.json({
            id: user.id,
            email: user.email,
            roles: uniqueRoles,
            organizations: memberships.map(m => ({
                organization_id: m.organization_id,
                role: m.role,
                role_code: m.role_code,
            })),
        })
    } catch (error: any) {
        console.error('[/api/auth/me] Unexpected error:', error)
        return NextResponse.json(
            { error: error.message || "Une erreur est survenue" },
            { status: 500 }
        )
    }
}
