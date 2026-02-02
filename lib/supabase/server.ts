// import { createServerClient, type CookieOptions } from '@supabase/ssr' // REMOVED
import { cookies } from 'next/headers'

// Mock types
type CookieOptions = any;

export async function createClient() {
    const cookieStore = await cookies()

    console.log("[Mock] Creating mock Supabase server client");
    return {
        from: () => ({
            select: () => ({
                eq: () => ({
                    single: () => ({ data: null, error: null }),
                    order: () => ({ data: [], error: null }),
                }),
                order: () => ({ data: [], error: null }),
                data: [],
                error: null
            }),
            insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
            update: () => ({ eq: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }) }),
            delete: () => ({ eq: () => ({ data: null, error: null }) }),
        }),
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            getUser: async () => ({ data: { user: null }, error: null }),
        }
    } as any;
}
