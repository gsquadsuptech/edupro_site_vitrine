/**
 * Garde anti-rebond pour les boucles de refresh_token (storm).
 *
 * Contexte: avec un cookie partagé `.edupro.africa` entre site marketing et
 * SaaS, un refresh_token peut devenir invalide (rotation faite par l'autre
 * app, expiration, conflit multi-onglet). Le client Supabase auto-refresh,
 * reçoit `refresh_token_not_found` (400), un autre composant relance,
 * et ainsi de suite jusqu'à `over_request_rate_limit` (429). Quand on en
 * arrive là, *toute* l'IP est bloquée 5 min, ce qui empêche les vrais
 * utilisateurs de se logger (cf. logs Supabase Auth qofruhdfxvqfsdursqjv).
 *
 * Stratégie:
 *  1. Détecter une rafale d'événements SIGNED_OUT (>=3 en <2s).
 *  2. Sur détection: signOut local (vide la mémoire de gotrue-js + arrête
 *     l'autoRefresh), purger les cookies `sb-*` (host + `.edupro.africa`)
 *     et le localStorage `sb-*`, puis poser un verrou sessionStorage.
 *  3. Tant que le verrou est actif (5 min), ignorer toute tentative
 *     programmatique de getSession()/refreshSession().
 *  4. Le verrou est levé sur signIn réussi.
 */

import type { SupabaseClient } from '@supabase/supabase-js'

const STORM_LOCK_MS = 5 * 60 * 1000
const STORM_LOCK_KEY = '__supabase_storm_lock_until__'
const SIGN_OUT_BURST_WINDOW_MS = 2_000
const SIGN_OUT_BURST_THRESHOLD = 3

let recentSignOuts: number[] = []
let cleanupInFlight = false

function getLockUntil(): number {
    if (typeof window === 'undefined') return 0
    try {
        const v = window.sessionStorage.getItem(STORM_LOCK_KEY)
        return v ? parseInt(v, 10) || 0 : 0
    } catch {
        return 0
    }
}

export function isStormLocked(): boolean {
    return Date.now() < getLockUntil()
}

export function stormLockRemainingMs(): number {
    return Math.max(0, getLockUntil() - Date.now())
}

export function clearStormLock(): void {
    if (typeof window === 'undefined') return
    try {
        window.sessionStorage.removeItem(STORM_LOCK_KEY)
    } catch {
        /* noop */
    }
    recentSignOuts = []
}

/**
 * À appeler à chaque SIGNED_OUT reçu via onAuthStateChange.
 * Retourne `true` si on vient d'entrer en mode storm (≥3 SIGNED_OUT en <2s).
 */
export function recordSignOutEvent(): boolean {
    const now = Date.now()
    recentSignOuts = recentSignOuts.filter(t => now - t < SIGN_OUT_BURST_WINDOW_MS)
    recentSignOuts.push(now)
    return recentSignOuts.length >= SIGN_OUT_BURST_THRESHOLD
}

/**
 * Purge tous les artefacts d'auth Supabase côté navigateur, signe le client
 * localement (arrête l'autoRefresh interne) et pose un verrou de 5 min.
 * Idempotent: si déjà en cours, no-op.
 */
export async function triggerStormCleanup(
    supabase: SupabaseClient,
    reason: string,
): Promise<void> {
    if (typeof window === 'undefined') return
    if (cleanupInFlight) return
    cleanupInFlight = true
    try {
        // eslint-disable-next-line no-console
        console.warn('[Auth][StormGuard] Cleanup déclenché:', reason)

        try {
            window.sessionStorage.setItem(
                STORM_LOCK_KEY,
                String(Date.now() + STORM_LOCK_MS),
            )
        } catch {
            /* noop */
        }

        // signOut local: vide la mémoire interne de gotrue-js et stoppe
        // l'autoRefreshToken. Pas d'appel réseau (scope local).
        try {
            await supabase.auth.signOut({ scope: 'local' })
        } catch {
            /* noop */
        }

        try {
            wipeAuthCookies()
        } catch {
            /* noop */
        }

        try {
            wipeAuthLocalStorage()
        } catch {
            /* noop */
        }
    } finally {
        cleanupInFlight = false
    }
}

function wipeAuthCookies(): void {
    if (typeof document === 'undefined') return
    const hostname = window.location.hostname
    const isEduproRoot =
        hostname === 'edupro.africa' || hostname.endsWith('.edupro.africa')
    const sharedDomain = isEduproRoot ? '.edupro.africa' : null

    const cookies = document.cookie ? document.cookie.split(';') : []
    cookies.forEach(cookie => {
        const name = cookie.split('=')[0]?.trim()
        if (!name) return
        if (!name.startsWith('sb-')) return
        const expired = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
        document.cookie = expired
        if (sharedDomain) {
            document.cookie = `${expired}; Domain=${sharedDomain}`
        }
    })
}

function wipeAuthLocalStorage(): void {
    if (typeof window === 'undefined') return
    try {
        const keys = Object.keys(window.localStorage)
        for (const k of keys) {
            if (k.startsWith('sb-') || k.startsWith('supabase.')) {
                try {
                    window.localStorage.removeItem(k)
                } catch {
                    /* noop */
                }
            }
        }
    } catch {
        /* noop */
    }
}
