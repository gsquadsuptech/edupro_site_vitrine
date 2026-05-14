"use client"

import { useParams } from "next/navigation"
import { ArrowRight, BookOpen, Loader2 } from "lucide-react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { useEnrollmentStatus } from "@/hooks/useEnrollmentStatus"
import { getAppUrl } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { EnrollButton } from "@/components/payment/enroll-button"

interface EnrollCTAProps {
    courseId: string
    cohortId?: string
    enrollLabel?: string
    enrolledLabel?: string
    className?: string
    buttonClassName?: string
    size?: ButtonProps["size"]
    variant?: ButtonProps["variant"]
    showArrow?: boolean
}

/**
 * Renders the enrollment call-to-action for a course (or per-cohort).
 * Falls back to "Accéder au cours" when the current user is already enrolled.
 */
export function EnrollCTA({
    courseId,
    cohortId,
    enrollLabel = "S'inscrire",
    enrolledLabel = "Accéder au cours",
    className,
    buttonClassName,
    size,
    variant = "default",
    showArrow = false,
}: EnrollCTAProps) {
    const { isEnrolled, cohortId: enrolledCohortId, loading } = useEnrollmentStatus(courseId)
    const params = useParams()
    const locale = (params?.locale as string) || 'fr'

    // Disable the button while we don't know yet, but still render it so layout doesn't shift.
    const matchesCohort = !cohortId || !enrolledCohortId || enrolledCohortId === cohortId
    const showAccess = isEnrolled && matchesCohort

    // Pendant le check d'inscription, ne pas afficher "S'inscrire" : on ne sait
    // pas encore si l'utilisateur est déjà inscrit. Un état neutre évite le
    // flash où un user déjà inscrit voit brièvement "S'inscrire".
    if (loading) {
        return (
            <div className={cn("block w-full", className)}>
                <Button
                    type="button"
                    variant={variant}
                    size={size}
                    className={cn("w-full", buttonClassName)}
                    disabled
                    aria-label="Vérification de l'inscription"
                >
                    <Loader2 className="h-4 w-4 animate-spin" />
                </Button>
            </div>
        )
    }

    if (showAccess) {
        return (
            <a href={getAppUrl("/dashboard/courses")} className={cn("block w-full", className)}>
                <Button
                    type="button"
                    variant={variant}
                    size={size}
                    className={cn("w-full", buttonClassName)}
                    disabled={loading}
                >
                    <BookOpen className="mr-2 h-4 w-4" />
                    {enrolledLabel}
                </Button>
            </a>
        )
    }

    return (
        <div className={cn("block w-full", className)}>
            <EnrollButton
                target={{ kind: "course", id: courseId }}
                locale={locale}
                extraQuery={cohortId ? { cohort: cohortId } : undefined}
            >
                <Button
                    type="button"
                    variant={variant}
                    size={size}
                    className={cn("w-full", buttonClassName)}
                    disabled={loading}
                >
                    {enrollLabel}
                    {showArrow && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
            </EnrollButton>
        </div>
    )
}
