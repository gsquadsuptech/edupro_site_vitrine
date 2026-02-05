import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { randomUUID } from "crypto"
import { verifyRecaptchaToken } from "@/lib/recaptcha"
import { sendFormNotificationEmail } from "@/lib/email-notifications"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

// POST - Soumettre une candidature spontanée
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

        // Créer un client Supabase avec la clé de service pour l'upload
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

        // Récupérer les données du formulaire
        const formData = await request.formData()

        const recaptcha_token = formData.get('recaptcha_token') as string | null
        const firstName = formData.get('firstName') as string
        const lastName = formData.get('lastName') as string
        const email = formData.get('email') as string
        const phone = formData.get('phone') as string | null
        const coverLetter = formData.get('coverLetter') as string | null
        const interestDomain = formData.get('interestDomain') as string | null
        const availability = formData.get('availability') as string | null
        const additionalMessage = formData.get('additionalMessage') as string | null
        const locale = formData.get('locale') as string || 'fr'
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

        // Validation des champs requis
        if (!firstName || !lastName || !email) {
            return NextResponse.json(
                { error: "Les champs prénom, nom et email sont requis" },
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
                { error: "Le fichier est trop volumineux (max 10MB)" },
                { status: 400 }
            )
        }

        // Upload du CV vers Supabase Storage
        const fileExtension = cvFile.name.split('.').pop() || 'pdf'
        const fileName = `${randomUUID()}.${fileExtension}`
        const filePath = `spontaneous-cvs/${fileName}`

        const fileBuffer = await cvFile.arrayBuffer()

        const { data: uploadData, error: uploadError } = await supabaseAdmin
            .storage
            .from('spontaneous-cvs')
            .upload(filePath, fileBuffer, {
                contentType: cvFile.type,
                upsert: false
            })

        if (uploadError) {
            console.error('Erreur lors de l\'upload du CV:', uploadError)
            return NextResponse.json(
                { error: "Erreur lors de l'upload du CV" },
                { status: 500 }
            )
        }

        // Récupérer l'URL publique du CV
        const { data: { publicUrl } } = supabaseAdmin
            .storage
            .from('spontaneous-cvs')
            .getPublicUrl(filePath)

        // Enregistrer la candidature en base de données
        const { data: applicationData, error: dbError } = await supabaseAdmin
            .from('spontaneous_applications')
            .insert({
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone: phone || null,
                cv_url: publicUrl,
                cv_filename: cvFile.name,
                cover_letter: coverLetter || null,
                interest_domain: interestDomain || null,
                availability: availability || null,
                additional_message: additionalMessage || null,
                locale: locale,
                status: 'pending'
            })
            .select()
            .single()

        if (dbError) {
            console.error('Erreur lors de l\'enregistrement de la candidature:', dbError)

            // Supprimer le fichier uploadé en cas d'erreur
            await supabaseAdmin.storage
                .from('spontaneous-cvs')
                .remove([filePath])

            return NextResponse.json(
                { error: "Erreur lors de l'enregistrement de la candidature" },
                { status: 500 }
            )
        }

        // Envoyer email de notification
        try {
            await sendFormNotificationEmail({
                type: 'spontaneous',
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    phone,
                    position: interestDomain,
                    cv_url: publicUrl,
                    cover_letter: coverLetter,
                },
                locale,
            })
        } catch (emailError) {
            console.error('Erreur lors de l\'envoi de la notification email:', emailError)
            // Ne pas bloquer la réponse si l'email échoue
        }

        return NextResponse.json({
            success: true,
            message: "Candidature soumise avec succès",
            data: {
                id: applicationData.id
            }
        }, { status: 201 })

    } catch (error) {
        console.error('Erreur serveur lors de la soumission:', error)
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        )
    }
}
