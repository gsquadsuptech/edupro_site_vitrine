import { NextRequest, NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'
import { verifyRecaptchaToken } from "@/lib/recaptcha"
import { sendFormNotificationEmail } from "@/lib/email-notifications"

export const dynamic = 'force-dynamic'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

// Créer un client Supabase avec la clé de service pour les opérations admin
function getSupabaseAdmin() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('Configuration Supabase manquante')
    }

    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )
}

// POST: Créer une nouvelle candidature
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()

        const recaptcha_token = formData.get('recaptcha_token') as string | null
        const first_name = formData.get('first_name') as string
        const last_name = formData.get('last_name') as string
        const email = formData.get('email') as string
        const phone = formData.get('phone') as string | null
        const experience_years = formData.get('experience_years') ? parseInt(formData.get('experience_years') as string) : null
        const specialties = formData.get('specialties') as string | null
        const cover_letter = formData.get('cover_letter') as string | null
        const locale = (formData.get('locale') as string) || 'fr'
        const wants_certification = formData.get('wants_certification') === 'true'
        const bootcamp = formData.get('bootcamp') === 'true'
        const cvFile = formData.get('cv') as File | null

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

        // Validation des champs obligatoires
        if (!first_name || !last_name || !email) {
            return NextResponse.json(
                { error: "Les champs nom, prénom et email sont obligatoires" },
                { status: 400 }
            )
        }

        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "L'email n'est pas valide" },
                { status: 400 }
            )
        }

        // Validation du fichier CV
        if (!cvFile) {
            return NextResponse.json(
                { error: "Le CV est requis" },
                { status: 400 }
            )
        }

        // Vérifier le type de fichier
        if (!ALLOWED_FILE_TYPES.includes(cvFile.type)) {
            return NextResponse.json(
                { error: "Le fichier doit être un PDF, DOC ou DOCX" },
                { status: 400 }
            )
        }

        // Vérifier la taille du fichier
        if (cvFile.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "Le fichier est trop volumineux (max 5MB)" },
                { status: 400 }
            )
        }

        const supabaseAdmin = getSupabaseAdmin()

        // Upload du CV vers Supabase Storage
        const fileExtension = cvFile.name.split('.').pop() || 'pdf'
        const fileName = `${randomUUID()}.${fileExtension}`
        const filePath = `trainer-applications-cvs/${fileName}`

        const fileBuffer = await cvFile.arrayBuffer()

        const { data: uploadData, error: uploadError } = await supabaseAdmin
            .storage
            .from('trainer-applications-cvs')
            .upload(filePath, fileBuffer, {
                contentType: cvFile.type,
                upsert: false
            })

        if (uploadError) {
            console.error('Erreur lors de l\'upload du CV:', uploadError)
            return NextResponse.json(
                { error: "Erreur lors du téléchargement du CV" },
                { status: 500 }
            )
        }

        // Récupérer l'URL publique du CV
        const { data: { publicUrl } } = supabaseAdmin
            .storage
            .from('trainer-applications-cvs')
            .getPublicUrl(filePath)

        // Enregistrer la candidature en base de données
        const { data: applicationData, error: dbError } = await supabaseAdmin
            .from('trainer_applications')
            .insert({
                first_name: first_name.trim(),
                last_name: last_name.trim(),
                email: email.toLowerCase().trim(),
                phone: phone?.trim() || null,
                experience_years,
                specialties: specialties?.trim() || null,
                cv_url: publicUrl,
                cv_filename: cvFile.name,
                cover_letter: cover_letter?.trim() || null,
                wants_certification: wants_certification || false,
                bootcamp: bootcamp || false,
                locale: locale || 'fr',
                status: 'pending'
            })
            .select()
            .single()

        if (dbError) {
            console.error('Erreur lors de l\'enregistrement de la candidature:', dbError)

            // Supprimer le fichier uploadé en cas d'erreur
            await supabaseAdmin.storage
                .from('trainer-applications-cvs')
                .remove([filePath])
                .catch(console.error)

            return NextResponse.json(
                { error: "Erreur lors de l'enregistrement de la candidature" },
                { status: 500 }
            )
        }

        // Envoyer email de notification
        try {
            await sendFormNotificationEmail({
                type: 'trainer',
                data: {
                    first_name,
                    last_name,
                    email,
                    phone,
                    experience_years,
                    specialties,
                    wants_certification,
                    bootcamp,
                    cv_url: publicUrl,
                    cover_letter,
                },
                locale,
            })
        } catch (emailError) {
            console.error('Erreur lors de l\'envoi de la notification email:', emailError)
            // Ne pas bloquer la réponse si l'email échoue
        }

        return NextResponse.json({
            success: true,
            data: applicationData
        }, { status: 201 })

    } catch (error) {
        console.error('Erreur serveur:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Une erreur est survenue" },
            { status: 500 }
        )
    }
}
