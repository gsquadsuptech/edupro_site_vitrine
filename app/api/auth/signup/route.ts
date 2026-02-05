
import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password, firstName, lastName, role = 'student' } = body

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json(
                { error: "Configuration serveur incorrecte" },
                { status: 500 }
            )
        }

        // Create Supabase Admin client to bypass email confirmation if needed, 
        // or just use public client if email confirmation involves the user.
        // Usually signup uses the public anon key, but we are in an API route.
        // The source used service role key for specific actions, but standard signUp can be done with anon key.
        // However, here we want to ensure we handle the error correctly.

        // Use service role to bypass some restrictions if necessary, 
        // but typically signUp is public.
        // Let's use service key to mimic backend privilege if we were to write to 'profiles' table manually.
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

        // 1. Sign up the user
        const { data, error } = await supabaseAdmin.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    role: role
                }
            }
        })

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            )
        }

        return NextResponse.json({
            user: data.user,
            session: data.session
        })

    } catch (error: any) {
        console.error('Signup error:', error)
        return NextResponse.json(
            { error: error.message || "Une erreur est survenue" },
            { status: 500 }
        )
    }
}
