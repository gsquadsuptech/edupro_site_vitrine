import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseUrl || !anonKey || !serviceRoleKey) {
            return NextResponse.json(
                { error: "Configuration serveur incorrecte" },
                { status: 500 }
            )
        }

        // Authenticate the caller via their session cookies
        const cookieStore = await cookies()
        const supabase = createServerClient(supabaseUrl, anonKey, {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll() {
                    // no-op: route handler, cookies are read-only here
                },
            },
        })

        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError || !userData?.user) {
            return NextResponse.json(
                { error: "Vous devez être connecté pour vous inscrire." },
                { status: 401 }
            )
        }
        const userId = userData.user.id

        const body = await request.json().catch(() => ({}))
        const { courseId, cohortId } = body as { courseId?: string; cohortId?: string }

        if (!courseId) {
            return NextResponse.json({ error: "courseId est requis" }, { status: 400 })
        }

        // Admin client bypasses RLS for server-side enrollment writes
        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
            auth: { autoRefreshToken: false, persistSession: false },
        })

        // Verify the course exists and is actually free
        const { data: course, error: courseError } = await supabaseAdmin
            .from('courses')
            .select('id, access_type, price, one_time_price')
            .eq('id', courseId)
            .single()

        if (courseError || !course) {
            return NextResponse.json({ error: "Cours introuvable" }, { status: 404 })
        }

        const isFree =
            course.access_type === 'free' ||
            (Number(course.one_time_price ?? course.price ?? 0) <= 0)

        if (!isFree) {
            return NextResponse.json(
                { error: "Ce cours n'est pas gratuit. Passez par le flux de paiement." },
                { status: 400 }
            )
        }

        // Verify cohort is available if one was provided
        if (cohortId) {
            const { data: cohort, error: cohortError } = await supabaseAdmin
                .from('cohorts')
                .select('id, max_participants, registration_deadline')
                .eq('id', cohortId)
                .maybeSingle()

            if (cohortError) {
                console.error('Cohort lookup failed:', cohortError, 'cohortId:', cohortId)
                return NextResponse.json(
                    { error: cohortError.message || "Erreur lors de la vérification de la session" },
                    { status: 500 }
                )
            }

            if (!cohort) {
                console.error('Cohort not found for id:', cohortId)
                return NextResponse.json(
                    { error: `Session introuvable (id=${cohortId})` },
                    { status: 404 }
                )
            }

            const isDeadlinePassed =
                cohort.registration_deadline != null &&
                new Date(cohort.registration_deadline) < new Date()

            if (isDeadlinePassed) {
                return NextResponse.json(
                    { error: "La date limite d'inscription est dépassée." },
                    { status: 400 }
                )
            }

            // Check capacity using cohort_participants count
            if (cohort.max_participants != null) {
                const { count } = await supabaseAdmin
                    .from('cohort_participants')
                    .select('id', { count: 'exact', head: true })
                    .eq('cohort_id', cohortId)
                if ((count ?? 0) >= cohort.max_participants) {
                    return NextResponse.json(
                        { error: "Cette session est complète." },
                        { status: 400 }
                    )
                }
            }
        }

        // Check for an existing enrollment to avoid duplicates
        const existingQuery = supabaseAdmin
            .from('enrollments')
            .select('id')
            .eq('user_id', userId)
            .eq('course_id', courseId)
        if (cohortId) {
            existingQuery.eq('cohort_id', cohortId)
        }
        const { data: existing } = await existingQuery.maybeSingle()

        if (existing?.id) {
            return NextResponse.json({
                enrollment: existing,
                alreadyEnrolled: true,
            })
        }

        // Create the enrollment
        const { data: enrollment, error: enrollmentError } = await supabaseAdmin
            .from('enrollments')
            .insert({
                user_id: userId,
                course_id: courseId,
                cohort_id: cohortId ?? null,
                status: 'active',
                payment_status: 'completed',
                payment_plan: 'free',
                total_amount: 0,
                balance_due: 0,
            })
            .select('id')
            .single()

        if (enrollmentError || !enrollment) {
            console.error('Free enrollment insert failed:', enrollmentError)
            return NextResponse.json(
                { error: enrollmentError?.message || "Impossible de créer l'inscription" },
                { status: 500 }
            )
        }

        // Add user to the cohort participants table if a cohort is linked
        if (cohortId) {
            const { data: existingParticipant } = await supabaseAdmin
                .from('cohort_participants')
                .select('id')
                .eq('user_id', userId)
                .eq('cohort_id', cohortId)
                .maybeSingle()

            if (!existingParticipant?.id) {
                const { error: participantError } = await supabaseAdmin
                    .from('cohort_participants')
                    .insert({
                        cohort_id: cohortId,
                        user_id: userId,
                        status: 'active',
                        payment_status: 'completed',
                    })
                if (participantError) {
                    console.error('cohort_participants insert failed:', participantError)
                }
            }
        }

        return NextResponse.json({ enrollment })
    } catch (error: any) {
        console.error('Free enrollment error:', error)
        return NextResponse.json(
            { error: error.message || "Une erreur est survenue" },
            { status: 500 }
        )
    }
}
