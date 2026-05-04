"use client"

import { useEffect, useRef } from "react"

declare global {
    interface Window {
        turnstile?: {
            render: (container: HTMLElement, options: TurnstileOptions) => string
            reset: (widgetId?: string) => void
            remove: (widgetId: string) => void
        }
        onloadTurnstileCallback?: () => void
    }
}

interface TurnstileOptions {
    sitekey: string
    callback?: (token: string) => void
    "error-callback"?: () => void
    "expired-callback"?: () => void
    "timeout-callback"?: () => void
    theme?: "light" | "dark" | "auto"
    size?: "normal" | "compact" | "invisible" | "flexible"
    action?: string
    appearance?: "always" | "execute" | "interaction-only"
}

interface TurnstileWidgetProps {
    onToken: (token: string) => void
    onExpire?: () => void
    onError?: () => void
    action?: string
    theme?: "light" | "dark" | "auto"
    className?: string
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback&render=explicit"

let scriptPromise: Promise<void> | null = null

function loadTurnstileScript(): Promise<void> {
    if (typeof window === "undefined") return Promise.reject()
    if (window.turnstile) return Promise.resolve()
    if (scriptPromise) return scriptPromise

    scriptPromise = new Promise<void>((resolve, reject) => {
        window.onloadTurnstileCallback = () => resolve()
        const existing = document.querySelector<HTMLScriptElement>(`script[src^="${SCRIPT_SRC.split("?")[0]}"]`)
        if (existing) {
            if (window.turnstile) resolve()
            else existing.addEventListener("load", () => resolve())
            existing.addEventListener("error", () => reject(new Error("Turnstile script failed to load")))
            return
        }
        const script = document.createElement("script")
        script.src = SCRIPT_SRC
        script.async = true
        script.defer = true
        script.onerror = () => reject(new Error("Turnstile script failed to load"))
        document.head.appendChild(script)
    })

    return scriptPromise
}

/**
 * Rend le widget Cloudflare Turnstile et retourne le token via `onToken`.
 * Si NEXT_PUBLIC_TURNSTILE_SITE_KEY n'est pas définie, ne rend rien.
 * Le composant doit être démonté et remonté pour générer un nouveau token
 * (Supabase invalide le token après usage). Utiliser une `key` qui change
 * à chaque tentative échouée.
 */
export function TurnstileWidget({
    onToken,
    onExpire,
    onError,
    action,
    theme = "auto",
    className,
}: TurnstileWidgetProps) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const widgetIdRef = useRef<string | null>(null)
    const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

    useEffect(() => {
        if (!sitekey || !containerRef.current) return
        let cancelled = false

        loadTurnstileScript()
            .then(() => {
                if (cancelled || !containerRef.current || !window.turnstile) return
                widgetIdRef.current = window.turnstile.render(containerRef.current, {
                    sitekey,
                    theme,
                    action,
                    callback: token => onToken(token),
                    "expired-callback": () => onExpire?.(),
                    "error-callback": () => onError?.(),
                })
            })
            .catch(() => onError?.())

        return () => {
            cancelled = true
            if (widgetIdRef.current && window.turnstile) {
                try {
                    window.turnstile.remove(widgetIdRef.current)
                } catch {
                    /* noop */
                }
                widgetIdRef.current = null
            }
        }
    }, [sitekey, theme, action, onToken, onExpire, onError])

    if (!sitekey) return null

    return <div ref={containerRef} className={className} />
}

export const isTurnstileConfigured = (): boolean =>
    Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)
