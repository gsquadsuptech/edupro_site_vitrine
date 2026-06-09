"use client"

import { useEffect, useState } from "react"
import { AlertTriangle } from "lucide-react"

// Hôtes considérés comme PRODUCTION (pas de bannière).
const PROD_HOSTS = ["edupro.africa", "www.edupro.africa", "app.edupro.africa"]

/**
 * Bannière « Environnement Staging » visible sur toutes les pages.
 *
 * Logique : on AFFICHE la bannière partout SAUF en production, pour éviter toute
 * confusion staging/prod. Override explicite via NEXT_PUBLIC_APP_ENV
 * ('production' force le masquage, 'staging' force l'affichage).
 */
export function StagingBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const env = process.env.NEXT_PUBLIC_APP_ENV
    if (env === "production") { setShow(false); return }
    if (env === "staging") { setShow(true); return }

    const host = window.location.hostname
    setShow(!PROD_HOSTS.includes(host))
  }, [])

  if (!show) return null

  return (
    <div className="flex w-full items-center justify-center gap-2 bg-amber-500 px-4 py-1.5 text-center text-xs font-semibold text-amber-950 sm:text-sm">
      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
      <span>Environnement STAGING — données de test, ne pas confondre avec la production.</span>
    </div>
  )
}
