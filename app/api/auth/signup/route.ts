
import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password, firstName, lastName, role = 'student' } = body

        if (!email || !password || !firstName) {
            return NextResponse.json(
                { error: "Email, mot de passe et prénom sont requis" },
                { status: 400 }
            )
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseUrl || !serviceRoleKey) {
            return NextResponse.json(
                { error: "Configuration serveur incorrecte" },
                { status: 500 }
            )
        }

        const supabaseAdmin = createClient(
            supabaseUrl,
            serviceRoleKey,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: false,
            user_metadata: {
                first_name: firstName,
                last_name: lastName || '',
                role: role
            }
        })

        if (error) {
            const message = /already|exist|registered/i.test(error.message)
                ? "Un compte avec cet email existe déjà"
                : error.message
            return NextResponse.json({ error: message }, { status: 400 })
        }

        if (!data?.user) {
            return NextResponse.json(
                { error: "Impossible de créer le compte" },
                { status: 500 }
            )
        }

        const origin =
            request.headers.get('origin') ||
            (request.headers.get('host') ? `https://${request.headers.get('host')}` : '')

        const invitationResponse = await fetch(
            `${supabaseUrl}/functions/v1/send-invitation`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${serviceRoleKey}`,
                },
                body: JSON.stringify({
                    email,
                    firstName,
                    lastName: lastName || '',
                    role,
                    organizationName: 'EduPro',
                    redirectTo: origin ? `${origin}/auth/callback` : undefined,
                }),
            }
        )

        if (!invitationResponse.ok) {
            const errorPayload = await invitationResponse.json().catch(() => ({}))
            console.error('send-invitation failed for', email, errorPayload)
            return NextResponse.json(
                {
                    error: "Compte créé mais l'email d'activation n'a pas pu être envoyé. Contactez le support.",
                    userId: data.user.id,
                },
                { status: 500 }
            )
        }

        return NextResponse.json({ user: data.user })

    } catch (error: any) {
        console.error('Signup error:', error)
        return NextResponse.json(
            { error: error.message || "Une erreur est survenue" },
            { status: 500 }
        )
    }
}
