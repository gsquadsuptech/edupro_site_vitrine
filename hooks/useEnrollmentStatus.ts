"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"

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

            try {
                const res = await fetch(
                    `/api/enroll/status?courseId=${encodeURIComponent(courseId)}`,
                    { credentials: "include", cache: "no-store" }
                )
                if (cancelled) return

                if (!res.ok) {
                    setStatus({ isEnrolled: false, loading: false })
                    return
                }
                const data = await res.json()
                setStatus({
                    isEnrolled: !!data.isEnrolled,
                    cohortId: data.cohortId ?? null,
                    enrollmentId: data.enrollmentId ?? null,
                    loading: false,
                })
            } catch (err) {
                if (cancelled) return
                console.error("useEnrollmentStatus error:", err)
                setStatus({ isEnrolled: false, loading: false })
            }
        }

        run()
        return () => {
            cancelled = true
        }
    }, [courseId, isAuthenticated, user?.id])

    return status
}
