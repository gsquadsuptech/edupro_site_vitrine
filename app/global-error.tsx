"use client"

import { useEffect } from "react"

/**
 * Boundary de dernier recours : intercepte les erreurs du layout racine
 * lui-meme. Elle doit rendre <html> et <body>, car le layout n'a pas pu.
 * Aucune dependance, aucun style externe : ce qui a casse plus haut ne doit
 * pas pouvoir casser ici.
 */
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        const report = (window as unknown as { __eduproReportError?: (e: Error, extra?: unknown) => void })
            .__eduproReportError
        if (typeof report === "function") {
            report(error, { digest: error.digest, scope: "global" })
        }
    }, [error])

    return (
        <html lang="fr">
            <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, padding: "4rem 1rem", textAlign: "center" }}>
                <h1 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>EduPro n&apos;a pas pu se charger</h1>
                <p style={{ color: "#555", maxWidth: 480, margin: "0 auto 1.5rem" }}>
                    Le probleme a ete signale a notre equipe. Reessayez, ou mettez a jour votre
                    navigateur si votre appareil est ancien.
                </p>
                <button
                    type="button"
                    onClick={reset}
                    style={{ padding: "0.6rem 1.2rem", borderRadius: 6, border: "1px solid #ccc", background: "#fff", cursor: "pointer" }}
                >
                    Reessayer
                </button>
            </body>
        </html>
    )
}
