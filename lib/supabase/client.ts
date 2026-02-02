// Mock Supabase client
export function createClient() {
    console.log("[Mock] Creating mock Supabase client");
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
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithPassword: async () => ({ data: { user: { id: 'mock-user-id', email: 'demo@example.com', identities: [] }, session: { user: { id: 'mock-user-id', email: 'demo@example.com' } } }, error: null }),
            signUp: async () => ({ data: { user: { id: 'mock-user-id' } }, error: null }),
            signOut: async () => ({ error: null }),
            refreshSession: async () => ({ error: null }),
            resend: async () => ({ error: null }),
        }
    } as any;
}
