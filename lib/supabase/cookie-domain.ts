// Computes the cookie `domain` attribute that should be used by the Supabase
// auth cookies so that the session is shared across the marketing site
// (site.edupro.africa / edupro.africa) and the SaaS app
// (staging.edupro.africa / app.edupro.africa).
//
// On localhost we MUST return undefined: cookies set with `domain=localhost`
// are silently dropped by browsers, which would break local auth entirely.
//
// The shared root domain can be overridden via NEXT_PUBLIC_AUTH_COOKIE_DOMAIN
// for environments that don't follow the *.edupro.africa convention.

const SHARED_ROOT_DOMAIN =
  process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN || '.edupro.africa'

export function getAuthCookieDomain(host?: string | null): string | undefined {
  const hostname = (host || (typeof window !== 'undefined' ? window.location.hostname : ''))
    .split(':')[0]
    .toLowerCase()

  if (!hostname) return undefined
  if (hostname === 'localhost' || hostname === '127.0.0.1') return undefined
  // IPv6 / bare IPs — no domain attribute possible
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) return undefined

  const root = SHARED_ROOT_DOMAIN.replace(/^\./, '')
  if (hostname === root || hostname.endsWith(`.${root}`)) {
    return `.${root}`
  }

  return undefined
}
