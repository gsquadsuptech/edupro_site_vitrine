import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { verifyRecaptchaToken } from "@/lib/recaptcha"
import { sendFormNotificationEmail } from "@/lib/email-notifications"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        // Vérifier la configuration Supabase
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error('Configuration Supabase manquante')
            return NextResponse.json(
                { error: "Configuration serveur incorrecte" },
                { status: 500 }
            )
        }

        const body = await request.json()
        const {
            recaptcha_token,
            company_name,
            contact_name,
            email,
            phone,
            company_size,
            industry,
            country,
            city,
            message,
            request_type = 'enterprise',
            locale = 'fr'
        } = body

        // Vérifier reCAPTCHA
        if (recaptcha_token) {
            try {
                const recaptchaResult = await verifyRecaptchaToken(recaptcha_token)
                if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
                    return NextResponse.json(
                        { error: "Vérification de sécurité échouée. Veuillez réessayer." },
                        { status: 400 }
                    )
                }
            } catch (recaptchaError) {
                console.error("Erreur vérification reCAPTCHA:", recaptchaError)
                return NextResponse.json(
                    { error: "Erreur lors de la vérification de sécurité" },
                    { status: 400 }
                )
            }
        }

        // Validation des champs requis
        if (!company_name || !contact_name || !email) {
            return NextResponse.json(
                { error: "Les champs nom de l'entreprise, nom du contact et email sont requis" },
                { status: 400 }
            )
        }

        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Email invalide" },
                { status: 400 }
            )
        }

        // Créer un client Supabase avec la clé de service
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

        // Validation du request_type
        const validRequestType = request_type === 'institute' ? 'institute' : 'enterprise'

        // Insérer la demande dans la base de données
        const { data, error } = await supabaseAdmin
            .from('demo_requests')
            .insert({
                company_name: company_name.trim(),
                contact_name: contact_name.trim(),
                email: email.toLowerCase().trim(),
                phone: phone?.trim() || null,
                company_size: company_size || null,
                industry: industry || null,
                country: country?.trim() || null,
                city: city?.trim() || null,
                message: message?.trim() || null,
                request_type: validRequestType,
                locale: locale,
                status: 'pending'
            })
            .select()
            .single()

        if (error) {
            console.error('Erreur lors de l\'insertion:', error)
            return NextResponse.json(
                { error: "Erreur lors de l'enregistrement de la demande" },
                { status: 500 }
            )
        }

        console.log('Demande de démo enregistrée:', data.id)

        // Envoyer email de notification
        try {
            await sendFormNotificationEmail({
                type: 'demo',
                data: {
                    request_type: validRequestType,
                    company_name: request_type === 'institute' ? undefined : company_name,
                    institute_name: request_type === 'institute' ? company_name : undefined,
                    contact_name,
                    email,
                    phone,
                    company_size,
                    industry,
                    country,
                    city,
                    message,
                },
                locale,
            })
        } catch (emailError) {
            console.error('Erreur lors de l\'envoi de la notification email:', emailError)
            // Ne pas bloquer la réponse si l'email échoue
        }

        return NextResponse.json({
            success: true,
            message: "Votre demande a été envoyée avec succès !",
            data
        }, { status: 200 })
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error)
        return NextResponse.json(
            { error: "Une erreur est survenue lors de l'enregistrement" },
            { status: 500 }
        )
    }
}
