import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  status: 'completed' | 'in_progress' | 'locked';
  achievedAt?: string;
  points?: number;
  progress?: number;
  remaining?: string;
}

export const useAchievements = () => {
  const { user, supabase, isLoading: authLoading } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      if (authLoading || !user) return;
      // Éviter les appels hors des pages apprenant (/dashboard)
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/dashboard')) {
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        // Attendre le token après première connexion
        const waitForToken = async (maxAttempts = 10, delayMs = 300): Promise<string | null> => {
          for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const { data: { session } } = await supabase.auth.getSession();
            const t = session?.access_token || null;
            if (t) return t;
            await new Promise((res) => setTimeout(res, delayMs));
          }
          return null;
        };

        const token = await waitForToken();
        if (!token) {
          // Éviter d'afficher une erreur rouge au premier rendu
          setAchievements([]);
          setIsLoading(false);
          return;
        }

        // Fonction de tentative avec retries pour limiter les échecs de première connexion
        const fetchWithRetry = async (attempts: number, delayMs: number) => {
          for (let attempt = 1; attempt <= attempts; attempt++) {
            try {
              const resp = await fetch('/api/v1/student/dashboard/achievements', {
                method: 'GET',
                cache: 'no-store',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });

              // 204: aucun contenu -> renvoyer liste vide silencieusement
              if (resp.status === 204) {
                return { achievements: [] as Achievement[] };
              }

              if (!resp.ok) {
                // 401 peut arriver si la session n'est pas encore propagée → petite attente et retry
                if (resp.status === 401 && attempt < attempts) {
                  await new Promise((r) => setTimeout(r, delayMs));
                  continue;
                }
                // Pour toute autre erreur, on dégrade en liste vide sans bruit utilisateur
                return { achievements: [] as Achievement[] };
              }

              // Réponse OK avec contenu JSON
              const json = await resp.json();
              return { achievements: (json?.achievements ?? []) as Achievement[] };
            } catch (_e) {
              if (attempt < attempts) {
                await new Promise((r) => setTimeout(r, delayMs));
                continue;
              }
              // Réseau/parse: dégrader silencieusement
              return { achievements: [] as Achievement[] };
            }
          }
          return { achievements: [] as Achievement[] };
        };

        const result = await fetchWithRetry(3, 400);
        setAchievements(result.achievements);
      } catch (err) {
        // Dégrader silencieusement pour éviter l'erreur visible au premier chargement
        setAchievements([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAchievements();
  }, [user, authLoading, supabase]);

  return { achievements, isLoading, error };
}; 