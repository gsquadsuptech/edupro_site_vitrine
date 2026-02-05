import { NextRequest, NextResponse } from "next/server"
import { verifyRecaptchaToken } from "@/lib/recaptcha"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { recaptcha_token, firstname, lastname, email, subject, message } = body

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
        if (!firstname || !lastname || !email || !subject || !message) {
            return NextResponse.json(
                { error: "Tous les champs sont requis" },
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

        // Préparer le contenu de l'email
        const emailSubject = `Nouveau message de contact - ${subject}`
        const emailContent = `
      <h2>Nouveau message de contact</h2>
      <p><strong>De:</strong> ${firstname} ${lastname}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Sujet:</strong> ${subject}</p>
      <hr>
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `

        // Envoyer l'email via Resend
        const RESEND_API_KEY = process.env.RESEND_API_KEY
        const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

        if (!RESEND_API_KEY) {
            console.error('RESEND_API_KEY manquante')
            return NextResponse.json(
                { error: "Configuration serveur incorrecte" },
                { status: 500 }
            )
        }

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: `EduPro Contact Form <${RESEND_FROM_EMAIL}>`,
                to: ['contact@edupro.africa'],
                reply_to: email,
                subject: emailSubject,
                html: emailContent,
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            console.error('Erreur Resend:', data)
            return NextResponse.json(
                { error: "Erreur lors de l'envoi de l'email" },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, message: "Message envoyé avec succès" })
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error)
        return NextResponse.json(
            { error: "Une erreur est survenue lors de l'envoi du message" },
            { status: 500 }
        )
    }
}
