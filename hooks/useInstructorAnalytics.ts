/**
 * Hook useInstructorAnalytics - Gestion des données analytics instructeur
 * 
 * Récupère et gère les KPIs, revenus et commissions avec cache automatique
 * Refresh périodique et gestion d'erreurs
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useInstructor } from './useInstructor';
import { usePathname } from 'next/navigation';

export interface AnalyticsData {
  revenue: {
    total: number;
    currentMonth: number;
    lastMonth: number;
    growth: number;
    byPeriod: Array<{
      period: string;
      amount: number;
      commissions?: number;
    }>;
  };
  students: {
    total: number;
    active: number;
    newThisMonth: number;
    growth: number;
  };
  courses: {
    total: number;
    active: number;
    completionRate: number;
  };
  engagement: {
    averageProgress: number;
    timeSpentTotal: number;
    retentionRate: number;
  };
}

export interface CommissionsData {
  pending: number;
  received: number;
  rate: number;
  thisMonth: number;
  lastMonth: number;
  growth: number;
  history: Array<{
    id: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
}

interface UseInstructorAnalyticsOptions {
  period?: '7d' | '30d' | '90d' | '1y';
  autoRefresh?: boolean;
  refreshInterval?: number; // en secondes
}

interface UseInstructorAnalyticsReturn {
  data: AnalyticsData | null;
  commissions: CommissionsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refreshCommissions: () => Promise<void>;
  lastUpdated: Date | null;
}

export const useInstructorAnalytics = (
  options: UseInstructorAnalyticsOptions = {}
): UseInstructorAnalyticsReturn => {
  const {
    period = '30d',
    autoRefresh = true,
    refreshInterval = 300 // 5 minutes par défaut
  } = options;

  const { instructor } = useInstructor();
  const pathname = usePathname();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [commissions, setCommissions] = useState<CommissionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!instructor?.id) {
      setLoading(false);
      return;
    }

    try {
      setError(null);

      // Récupérer les données analytics principales
      const analyticsResponse = await fetch(
        `/api/instructor/analytics?period=${period}&cached=false`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!analyticsResponse.ok) {
        const errorData = await analyticsResponse.json();
        throw new Error(errorData.error || 'Erreur lors de la récupération des analytics');
      }

      const analyticsResult = await analyticsResponse.json();
      console.log('Analytics result:', analyticsResult);
      console.log('Students data:', analyticsResult.data?.students);
      setData(analyticsResult.data);

      // Récupérer les données de commissions
      const commissionsResponse = await fetch('/api/instructor/commissions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (commissionsResponse.ok) {
        const commissionsResult = await commissionsResponse.json();
        setCommissions(commissionsResult.data);
      } else {
        // Les commissions ne sont pas critiques, on continue sans
        console.warn('Erreur récupération commissions');
        setCommissions({
          pending: 0,
          received: 0,
          rate: 70,
          thisMonth: 0,
          lastMonth: 0,
          growth: 0,
          history: []
        });
      }

      setLastUpdated(new Date());

    } catch (err) {
      console.error('Erreur récupération analytics:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [instructor?.id, period]);

  const refreshCommissions = useCallback(async () => {
    if (!instructor?.id) return;

    try {
      const response = await fetch('/api/instructor/commissions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setCommissions(result.data);
      }
    } catch (err) {
      console.warn('Erreur refresh commissions:', err);
    }
  }, [instructor?.id]);

  const refetch = useCallback(async () => {
    // Réinitialiser avant refetch pour éviter un rendu vide avec état incohérent
    setData(null);
    setCommissions(null);
    setLoading(true);
    await fetchAnalytics();
  }, [fetchAnalytics]);

  // Chargement initial
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || !instructor?.id) return;

    const interval = setInterval(() => {
      fetchAnalytics();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchAnalytics, instructor?.id]);

  // Nettoyage si plus d'instructeur
  useEffect(() => {
    if (!instructor) {
      setData(null);
      setCommissions(null);
      setError(null);
      setLastUpdated(null);
    }
  }, [instructor]);

  // Refetch lors d'un changement d'URL (basculement d'interface)
  useEffect(() => {
    if (!pathname) return;
    if (!instructor?.id) return;
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Écouter l'événement global déclenché par useInterfaceRefresh
  useEffect(() => {
    const handleInterfaceChanged = () => {
      if (instructor?.id) {
        refetch();
      }
    };
    try {
      window.addEventListener('interfaceChanged', handleInterfaceChanged as EventListener);
      return () => window.removeEventListener('interfaceChanged', handleInterfaceChanged as EventListener);
    } catch {
      // no-op SSR
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instructor?.id, refetch]);

  return {
    data,
    commissions,
    loading,
    error,
    refetch,
    refreshCommissions,
    lastUpdated
  };
};