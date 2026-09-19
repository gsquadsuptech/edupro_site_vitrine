"use client"

import { useEffect, useRef } from "react"
import { Course, Cohort } from "@/lib/supabase/types"
import { getEnrollCtaState, formatOpeningLabel } from "@/services/course-service"
import { pickDisplayCohort, type PublicPrice } from "@/lib/pricing"
import { WaitlistDialog } from "./waitlist-dialog"
import { EnrollCTA } from "./enroll-cta"
import { CoursePriceDisplay } from "./course-price-display"

interface MobilePurchaseBarProps {
  course: Course
  cohorts: Cohort[]
  /** Prix effectif (promo publique) calculé côté serveur. */
  promo?: PublicPrice
}

/**
 * Barre d'achat fixe en bas d'écran (mobile et tablette).
 *
 * Deux défauts corrigés ici, tous deux signalés par des visiteurs :
 *
 *  - Le prix et le bouton partageaient une seule ligne, le prix ne rétrécissant
 *    jamais. Avec une promotion (prix barré, badge, économie) le bloc prix
 *    prenait toute la largeur et le bouton disparaissait. Sur téléphone, on
 *    empile : prix au-dessus, bouton pleine largeur en dessous.
 *  - Les boutons flottants (WhatsApp, retour en haut) recouvraient l'extrémité
 *    droite du bouton. La barre publie sa hauteur dans `--bottom-bar-h`, que
 *    ces boutons utilisent pour se placer au-dessus d'elle.
 */
export function MobilePurchaseBar({ course, cohorts, promo }: MobilePurchaseBarProps) {
  const cta = getEnrollCtaState(course, cohorts)
  const displayCohort = pickDisplayCohort(cohorts)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = barRef.current
    if (!el) return
    const root = document.documentElement
    const publish = () => root.style.setProperty("--bottom-bar-h", `${el.offsetHeight}px`)
    publish()
    // La barre change de hauteur avec l'orientation et le contenu du prix.
    // Sur les navigateurs sans ResizeObserver, la mesure initiale suffit.
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(publish) : null
    observer?.observe(el)
    window.addEventListener("resize", publish)
    return () => {
      observer?.disconnect()
      window.removeEventListener("resize", publish)
      root.style.removeProperty("--bottom-bar-h")
    }
  }, [])

  return (
    <div
      ref={barRef}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-lg shadow-[0_-8px_30px_rgb(0,0,0,0.12)] lg:hidden"
    >
      <div className="container mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <CoursePriceDisplay
          course={course}
          cohort={displayCohort}
          variant="compact"
          className="min-w-0 sm:shrink-0"
          promo={promo}
        />

        <div className="w-full sm:w-auto sm:min-w-[240px] sm:max-w-xs">
          {cta.kind === "enroll" ? (
            <EnrollCTA
              courseId={course.id}
              enrollLabel="S'inscrire"
              buttonClassName="h-12 bg-gradient-to-r from-primary to-chart-2 text-base font-bold text-primary-foreground shadow-lg"
            />
          ) : cta.kind === "opens-later" ? (
            <div>
              <WaitlistDialog
                courseId={course.id}
                courseSlug={course.slug}
                courseTitle={course.title}
                label="M'avertir de l'ouverture"
              />
              <p className="mt-1 text-center text-xs font-medium text-primary">
                {formatOpeningLabel(cta.opensAt)}
              </p>
            </div>
          ) : (
            <WaitlistDialog
              courseId={course.id}
              courseSlug={course.slug}
              courseTitle={course.title}
            />
          )}
        </div>
      </div>
    </div>
  )
}
