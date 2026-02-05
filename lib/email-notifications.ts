/**
 * Email notification utilities for marketing forms
 */

interface EmailNotificationOptions {
    type: 'investor' | 'trainer' | 'demo' | 'contact' | 'newsletter' | 'spontaneous'
    data: Record<string, any>
    locale?: string
}

/**
 * Send email notification to contact@edupro.africa
 */
export async function sendFormNotificationEmail(options: EmailNotificationOptions): Promise<void> {
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

    if (!RESEND_API_KEY) {
        console.error('RESEND_API_KEY manquante - notification email non envoyée')
        return
    }

    const { type, data, locale = 'fr' } = options

    const subject = getEmailSubject(type, data, locale)
    const htmlContent = generateEmailTemplate(type, data, locale)

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: `EduPro Notifications <${RESEND_FROM_EMAIL}>`,
                to: ['contact@edupro.africa'],
                subject,
                html: htmlContent,
            }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.error('Erreur Resend lors de l\'envoi de notification:', errorData)
            throw new Error(`Resend error: ${JSON.stringify(errorData)}`)
        }

        console.log(`Notification email envoyée avec succès pour ${type}`)
    } catch (error) {
        console.error(`Erreur lors de l'envoi de la notification email pour ${type}:`, error)
        // Ne pas throw pour ne pas bloquer la soumission du formulaire
    }
}

function getEmailSubject(type: string, data: Record<string, any>, locale: string): string {
    const subjects: Record<string, string> = {
        investor: `[EduPro] Nouvelle demande d'investisseur - ${data.full_name || 'Sans nom'}`,
        trainer: `[EduPro] Nouvelle candidature formateur - ${data.first_name || ''} ${data.last_name || ''}`,
        demo: `[EduPro] Nouvelle demande de démo - ${data.company_name || data.institute_name || 'Sans nom'}`,
        contact: `[EduPro] Nouveau message de contact - ${data.subject || 'Sans sujet'}`,
        newsletter: `[EduPro] Nouvelle inscription newsletter`,
        spontaneous: `[EduPro] Nouvelle candidature spontanée - ${data.first_name || ''} ${data.last_name || ''}`,
    }

    return subjects[type] || `[EduPro] Nouvelle soumission de formulaire`
}

function generateEmailTemplate(type: string, data: Record<string, any>, locale: string): string {
    const baseStyle = `
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
      .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
      .field { margin-bottom: 15px; }
      .label { font-weight: bold; color: #4f46e5; }
      .value { margin-top: 5px; }
      .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
    </style>
  `

    let content = ''

    switch (type) {
        case 'investor':
            content = `
        <div class="field"><span class="label">Type d'investisseur:</span> <div class="value">${data.investor_type || '-'}</div></div>
        <div class="field"><span class="label">Nom complet:</span> <div class="value">${data.full_name || '-'}</div></div>
        <div class="field"><span class="label">Email:</span> <div class="value">${data.email || '-'}</div></div>
        <div class="field"><span class="label">Téléphone:</span> <div class="value">${data.phone || '-'}</div></div>
        ${data.linkedin ? `<div class="field"><span class="label">LinkedIn:</span> <div class="value">${data.linkedin}</div></div>` : ''}
        ${data.ticket ? `<div class="field"><span class="label">Ticket d'investissement:</span> <div class="value">${data.ticket}</div></div>` : ''}
        ${data.timeline ? `<div class="field"><span class="label">Timeline:</span> <div class="value">${data.timeline}</div></div>` : ''}
        ${data.interest ? `<div class="field"><span class="label">Intérêt:</span> <div class="value">${data.interest}</div></div>` : ''}
      `
            break

        case 'trainer':
            content = `
        <div class="field"><span class="label">Nom:</span> <div class="value">${data.first_name || ''} ${data.last_name || ''}</div></div>
        <div class="field"><span class="label">Email:</span> <div class="value">${data.email || '-'}</div></div>
        ${data.phone ? `<div class="field"><span class="label">Téléphone:</span> <div class="value">${data.phone}</div></div>` : ''}
        ${data.experience_years ? `<div class="field"><span class="label">Années d'expérience:</span> <div class="value">${data.experience_years}</div></div>` : ''}
        ${data.specialties ? `<div class="field"><span class="label">Spécialités:</span> <div class="value">${data.specialties}</div></div>` : ''}
        ${data.wants_certification ? `<div class="field"><span class="label">Certification souhaitée:</span> <div class="value">Oui (250K FCFA)</div></div>` : ''}
        ${data.bootcamp ? `<div class="field"><span class="label">Bootcamp:</span> <div class="value">Oui</div></div>` : ''}
        ${data.cv_url ? `<div class="field"><span class="label">CV:</span> <div class="value"><a href="${data.cv_url}">Télécharger le CV</a></div></div>` : ''}
        ${data.cover_letter ? `<div class="field"><span class="label">Lettre de motivation:</span> <div class="value">${data.cover_letter}</div></div>` : ''}
      `
            break

        case 'demo':
            const requestType = data.request_type === 'institute' ? 'Institut de formation' : 'Entreprise'
            content = `
        <div class="field"><span class="label">Type de demande:</span> <div class="value">${requestType}</div></div>
        <div class="field"><span class="label">${data.request_type === 'institute' ? 'Nom de l\'institut' : 'Nom de l\'entreprise'}:</span> <div class="value">${data.company_name || data.institute_name || '-'}</div></div>
        <div class="field"><span class="label">Nom du contact:</span> <div class="value">${data.contact_name || '-'}</div></div>
        <div class="field"><span class="label">Email:</span> <div class="value">${data.email || '-'}</div></div>
        ${data.phone ? `<div class="field"><span class="label">Téléphone:</span> <div class="value">${data.phone}</div></div>` : ''}
        ${data.company_size ? `<div class="field"><span class="label">Taille:</span> <div class="value">${data.company_size}</div></div>` : ''}
        ${data.industry ? `<div class="field"><span class="label">Secteur:</span> <div class="value">${data.industry}</div></div>` : ''}
        ${data.country ? `<div class="field"><span class="label">Pays:</span> <div class="value">${data.country}</div></div>` : ''}
        ${data.city ? `<div class="field"><span class="label">Ville:</span> <div class="value">${data.city}</div></div>` : ''}
        ${data.message ? `<div class="field"><span class="label">Message:</span> <div class="value">${data.message}</div></div>` : ''}
      `
            break

        case 'contact':
            content = `
        <div class="field"><span class="label">Nom:</span> <div class="value">${data.firstname || ''} ${data.lastname || ''}</div></div>
        <div class="field"><span class="label">Email:</span> <div class="value">${data.email || '-'}</div></div>
        <div class="field"><span class="label">Sujet:</span> <div class="value">${data.subject || '-'}</div></div>
        <div class="field"><span class="label">Message:</span> <div class="value">${(data.message || '').replace(/\n/g, '<br>')}</div></div>
      `
            break

        case 'newsletter':
            content = `
        <div class="field"><span class="label">Email:</span> <div class="value">${data.email || '-'}</div></div>
        <div class="field"><span class="label">Source:</span> <div class="value">${data.source || 'newsletter'}</div></div>
        <div class="field"><span class="label">Locale:</span> <div class="value">${data.locale || 'fr'}</div></div>
      `
            break

        case 'spontaneous':
            content = `
        <div class="field"><span class="label">Nom:</span> <div class="value">${data.first_name || ''} ${data.last_name || ''}</div></div>
        <div class="field"><span class="label">Email:</span> <div class="value">${data.email || '-'}</div></div>
        ${data.phone ? `<div class="field"><span class="label">Téléphone:</span> <div class="value">${data.phone}</div></div>` : ''}
        ${data.position ? `<div class="field"><span class="label">Poste souhaité:</span> <div class="value">${data.position}</div></div>` : ''}
        ${data.cv_url ? `<div class="field"><span class="label">CV:</span> <div class="value"><a href="${data.cv_url}">Télécharger le CV</a></div></div>` : ''}
        ${data.cover_letter ? `<div class="field"><span class="label">Lettre de motivation:</span> <div class="value">${data.cover_letter}</div></div>` : ''}
      `
            break
    }

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      ${baseStyle}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Nouvelle soumission de formulaire</h1>
          <p>Type: ${type}</p>
        </div>
        <div class="content">
          ${content}
          <div class="footer">
            <p>Cette notification a été générée automatiquement par le système EduPro.</p>
            <p>Date: ${new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Dakar' })}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}
