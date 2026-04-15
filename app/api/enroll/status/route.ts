import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseUrl || !anonKey || !serviceRoleKey) {
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
            return NextResponse.json({ isEnrolled: false })
        }

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
            auth: { autoRefreshToken: false, persistSession: false },
        })

        const { data, error } = await supabaseAdmin
            .from("enrollments")
            .select("id, cohort_id, status")
            .eq("user_id", userData.user.id)
            .eq("course_id", courseId)
            .in("status", ["active", "pending"])
            .maybeSingle()

        if (error) {
            console.error("enroll/status error:", error)
            return NextResponse.json({ isEnrolled: false })
        }

        return NextResponse.json({
            isEnrolled: !!data?.id,
            cohortId: data?.cohort_id ?? null,
            enrollmentId: data?.id ?? null,
        })
    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ isEnrolled: false }, { status: 200 })
    }
}
