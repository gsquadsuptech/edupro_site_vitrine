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

        // 2. Use service_role key to query organization_members (bypasses RLS)
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json(
                { error: "Configuration serveur incorrecte" },
                { status: 500 }
            )
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        // 3. Query organization_members for this user's roles
        const { data: memberships, error: memberError } = await supabaseAdmin
            .from('organization_members')
            .select('role, role_code, organization_id, is_active')
            .eq('user_id', user.id)
            .eq('is_active', true)

        if (memberError) {
            console.error('[/api/auth/me] Error fetching memberships:', memberError)
            return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 })
        }

        // 4. Extract unique roles
        const roles = memberships?.map(m => m.role).filter(Boolean) ?? []
        const uniqueRoles = [...new Set(roles)]

        // 5. Fallback to user_metadata.role if no memberships found
        if (uniqueRoles.length === 0) {
            const metadataRole = user.user_metadata?.role
            if (metadataRole) {
                uniqueRoles.push(metadataRole)
            }
        }

        // 6. Default to 'student' if no roles found at all
        if (uniqueRoles.length === 0) {
            uniqueRoles.push('student')
        }

        return NextResponse.json({
            id: user.id,
            email: user.email,
            roles: uniqueRoles,
            organizations: memberships?.map(m => ({
                organization_id: m.organization_id,
                role: m.role,
                role_code: m.role_code,
            })) ?? [],
        })
    } catch (error: any) {
        console.error('[/api/auth/me] Unexpected error:', error)
        return NextResponse.json(
            { error: error.message || "Une erreur est survenue" },
            { status: 500 }
        )
    }
}
