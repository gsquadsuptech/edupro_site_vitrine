/**
 * Google reCAPTCHA v3 utilities
 */

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

if (!RECAPTCHA_SITE_KEY) {
  console.warn('NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set. reCAPTCHA will not work.')
}

/**
 * Load Google reCAPTCHA script
 */
export function loadRecaptchaScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.grecaptcha) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA script'))
    document.head.appendChild(script)
  })
}

/**
 * Execute reCAPTCHA and get token
 */
export async function executeRecaptcha(action: string): Promise<string> {
  if (!RECAPTCHA_SITE_KEY) {
    throw new Error('reCAPTCHA site key is not configured')
  }

  await loadRecaptchaScript()

  return new Promise((resolve, reject) => {
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(RECAPTCHA_SITE_KEY, { action })
        .then((token) => {
          resolve(token)
        })
        .catch((error) => {
          reject(error)
        })
    })
  })
}

/**
 * Verify reCAPTCHA token on server side
 */
export async function verifyRecaptchaToken(token: string): Promise<{ success: boolean; score: number; action: string }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  if (!secretKey) {
    throw new Error('RECAPTCHA_SECRET_KEY is not configured')
  }

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `secret=${secretKey}&response=${token}`,
  })

  const data = await response.json()

  return {
    success: data.success === true,
    score: data.score || 0,
    action: data.action || '',
  }
}

