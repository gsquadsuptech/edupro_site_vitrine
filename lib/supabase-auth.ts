import { createClient } from '@/lib/supabase/client';
import { User, Session, AuthError } from '@supabase/supabase-js';

export const supabaseAuth = createClient();

/**
 * Retrieves the user with a timeout to prevent hanging requests
 * @param timeoutMs Timeout in milliseconds (default: 5000)
 */
export async function getUserWithTimeout(timeoutMs: number = 5000): Promise<{ data: { user: User | null }; error: AuthError | null | Error }> {
    // Create a promise that rejects after the timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
        const id = setTimeout(() => {
            clearTimeout(id);
            reject(new Error(`User fetch timed out after ${timeoutMs}ms`));
        }, timeoutMs);
    });

    try {
        // Race the getUser call against the timeout
        const result = await Promise.race([
            supabaseAuth.auth.getUser(),
            timeoutPromise
        ]);
        return result;
    } catch (err) {
        // Handle timeout or other errors
        return {
            data: { user: null },
            error: err instanceof Error ? err : new Error('Unknown error fetching user')
        };
    }
}

/**
 * Retrieves the session with a timeout to prevent hanging requests
 * @param timeoutMs Timeout in milliseconds (default: 5000)
 */
export async function getSessionWithTimeout(timeoutMs: number = 5000): Promise<{ data: { session: Session | null }; error: AuthError | null | Error }> {
    // Create a promise that rejects after the timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
        const id = setTimeout(() => {
            clearTimeout(id);
            reject(new Error(`Session fetch timed out after ${timeoutMs}ms`));
        }, timeoutMs);
    });

    try {
        // Race the getSession call against the timeout
        const result = await Promise.race([
            supabaseAuth.auth.getSession(),
            timeoutPromise
        ]);
        return result;
    } catch (err) {
        // Handle timeout or other errors
        return {
            data: { session: null },
            error: err instanceof Error ? err : new Error('Unknown error fetching session')
        };
    }
}
