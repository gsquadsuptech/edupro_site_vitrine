"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { createClient } from "@/lib/supabase/client"

export interface EnrollmentStatus {
    isEnrolled: boolean
    cohortId?: string | null
    enrollmentId?: string | null
    loading: boolean
}

const INITIAL: EnrollmentStatus = { isEnrolled: false, loading: true }

export function useEnrollmentStatus(courseId?: string | null): EnrollmentStatus {
    const { user, isAuthenticated } = useAuth()
    const [status, setStatus] = useState<EnrollmentStatus>(INITIAL)

    useEffect(() => {
        let cancelled = false

        const run = async () => {
            if (!courseId || !isAuthenticated || !user?.id) {
                setStatus({ isEnrolled: false, loading: false })
                return
            }

            setStatus((prev) => ({ ...prev, loading: true }))

            const supabase = createClient()
            const { data, error } = await supabase
                .from("enrollments")
                .select("id, cohort_id")
                .eq("user_id", user.id)
                .eq("course_id", courseId)
                .in("status", ["active", "pending"])
                .maybeSingle()

            if (cancelled) return

            if (error) {
                console.error("useEnrollmentStatus error:", error)
                setStatus({ isEnrolled: false, loading: false })
                return
            }

            setStatus({
                isEnrolled: !!data?.id,
                cohortId: data?.cohort_id ?? null,
                enrollmentId: data?.id ?? null,
                loading: false,
            })
        }

        run()
        return () => {
            cancelled = true
        }
    }, [courseId, isAuthenticated, user?.id])

    return status
}
