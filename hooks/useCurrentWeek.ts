import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export interface CurrentWeekData {
  week_number: number;
  title: string;
  start_date: string;
  end_date: string;
  progress: {
    completed_activities: number;
    total_activities: number;
    completion_percentage: number;
  };
  activities: Array<{
    id: string;
    title: string;
    type: string;
    duration: string;
    status: 'completed' | 'in_progress' | 'not_started';
    progress: number;
    description: string;
    url: string;
  }>;
  live_session?: {
    id: string;
    title: string;
    date: string;
    time: string;
    description: string;
    status: string;
    days_until: number;
    zoom_link: string;
  };
  resources: Array<{
    id: string;
    title: string;
    type: string;
    description: string;
    download_url: string;
    size: string;
  }>;
}

interface UseCurrentWeekResult {
  currentWeek: CurrentWeekData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCurrentWeek(cohortId: string): UseCurrentWeekResult {
  const { user, supabase } = useAuth();
  const [currentWeek, setCurrentWeek] = useState<CurrentWeekData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentWeek = async () => {
    if (!user || !cohortId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Récupérer le token d'authentification depuis Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Utilisateur non authentifié');
      }

      const response = await fetch(`/api/v1/student/cohorts/${cohortId}/current-week`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setCurrentWeek(data.current_week);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la semaine courante');
      console.error('Erreur lors du chargement de la semaine courante:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentWeek();
  }, [cohortId, user]);

  return {
    currentWeek,
    loading,
    error,
    refetch: fetchCurrentWeek
  };
}