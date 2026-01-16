import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabaseAuth, getUserWithTimeout, getSessionWithTimeout } from '@/lib/supabase-auth';

interface UseAuthOptimizedReturn {
    user: User | null;
    session: Session | null;
    loading: boolean;
    error: string | null;
    refreshUser: () => Promise<void>;
    refreshSession: () => Promise<void>;
}

/**
 * Hook d'authentification optimisé avec timeouts
 * Évite les requêtes "me" qui restent en attente
 */
export const useAuthOptimized = (): UseAuthOptimizedReturn => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fonction pour rafraîchir l'utilisateur avec timeout
    const refreshUser = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Utiliser la fonction avec timeout (5 secondes par défaut)
            const { data: { user }, error } = await getUserWithTimeout(5000);

            if (error) {
                throw error;
            }

            setUser(user);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la vérification utilisateur';
            setError(errorMessage);
            console.error('Erreur refreshUser:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fonction pour rafraîchir la session avec timeout
    const refreshSession = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Utiliser la fonction avec timeout (5 secondes par défaut)
            const { data: { session }, error } = await getSessionWithTimeout(5000);

            if (error) {
                throw error;
            }

            setSession(session);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la vérification session';
            setError(errorMessage);
            console.error('Erreur refreshSession:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initialisation avec timeout
    useEffect(() => {
        let mounted = true;

        const initializeAuth = async () => {
            try {
                setLoading(true);
                setError(null);

                // Vérifier la session d'abord (plus rapide)
                const { data: { session }, error: sessionError } = await getSessionWithTimeout(3000);

                if (sessionError) {
                    throw sessionError;
                }

                if (mounted) {
                    setSession(session);

                    // Si session existe, vérifier l'utilisateur
                    if (session?.user) {
                        setUser(session.user);
                    }
                }
            } catch (err) {
                if (mounted) {
                    const errorMessage = err instanceof Error ? err.message : 'Erreur d\'initialisation auth';
                    setError(errorMessage);
                    console.error('Erreur initialisation auth:', err);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        initializeAuth();

        // Écouter les changements d'authentification
        const { data: { subscription } } = supabaseAuth.auth.onAuthStateChange(
            async (event, session) => {
                if (mounted) {
                    setSession(session);
                    setUser(session?.user ?? null);
                    setError(null);
                }
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    return {
        user,
        session,
        loading,
        error,
        refreshUser,
        refreshSession
    };
};

export default useAuthOptimized;
