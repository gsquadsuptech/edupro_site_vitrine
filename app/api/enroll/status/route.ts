import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !anonKey) {
            console.warn("[enroll/status] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
            return NextResponse.json({ isEnrolled: false }, { status: 200 })
        }

        const courseId = request.nextUrl.searchParams.get("courseId")
        if (!courseId) {
            return NextResponse.json({ error: "courseId est requis" }, { status: 400 })
        }

        const cookieStore = await cookies()
        const supabase = createServerClient(supabaseUrl, anonKey, {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll() {
                    // read-only in route handlers
                },
            },
        })

        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError || !userData?.user) {
            console.warn("[enroll/status] No authenticated user:", userError?.message ?? "no session")
            return NextResponse.json({ isEnrolled: false })
        }

        const { data, error } = await supabase
            .from("enrollments")
            .select("id, cohort_id, status")
            .eq("user_id", userData.user.id)
            .eq("course_id", courseId)
            .in("status", ["active", "pending", "completed"])
            .maybeSingle()

        if (error) {
            console.error("[enroll/status] DB error for user", userData.user.id, "course", courseId, ":", error.message)
            return NextResponse.json({ isEnrolled: false })
        }

        return NextResponse.json({
            isEnrolled: !!data?.id,
            cohortId: data?.cohort_id ?? null,
            enrollmentId: data?.id ?? null,
        })
    } catch (err: any) {
        console.error("[enroll/status] Unhandled error:", err)
        return NextResponse.json({ isEnrolled: false }, { status: 200 })
    }
}
