import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Types pour les participants de cohorte côté instructeur
export interface InstructorCohortParticipant {
  id: string;
  // Optionnel: identifiant utilisateur pour actions (messagerie)
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  status: 'active' | 'late' | 'inactive';
  progress: number;
  lastActivity: string;
  joinedAt: string;
}

// Types pour la progression des modules côté instructeur
export interface InstructorCohortModule {
  id: string;
  title: string;
  description: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  objectives: string[];
  estimatedDurationHours: number;
  completedParticipants: number;
  totalParticipants: number;
  completionPercentage: number;
  averageProgress: number;
  participantsInProgress: number;
  participantsNotStarted: number;
  progressBreakdown: {
    completed: number;
    inProgress: number;
    notStarted: number;
  };
}

// Types pour les données de la cohorte côté instructeur
export interface InstructorCohortData {
  id: string;
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  participants_count: number;
  active_participants: number;
  average_progress: number;
  pending_exercises: number;
  participation_rate: number;
  participants: InstructorCohortParticipant[];
}

// Réponse API pour les participants
export interface InstructorParticipantsResponse {
  success: boolean;
  participants: InstructorCohortParticipant[];
  total: number;
}

// Réponse API pour les détails de cohorte
export interface InstructorCohortResponse {
  success: boolean;
  cohort: InstructorCohortData;
}

// Réponse API pour la progression des modules
export interface InstructorModulesProgressResponse {
  success: boolean;
  modules: InstructorCohortModule[];
  total: number;
  cohortStats: {
    totalModules: number;
    totalParticipants: number;
    averageCompletionRate: number;
  };
}

interface UseInstructorCohortAPIResult {
  // Données
  cohortData: InstructorCohortData | null;
  participantsData: InstructorCohortParticipant[];
  modulesData: InstructorCohortModule[];

  // États de chargement
  isLoadingCohort: boolean;
  isLoadingParticipants: boolean;
  isLoadingModules: boolean;

  // Erreurs
  error: string | null;

  // Fonctions de refresh
  refreshCohortData: () => Promise<void>;
  refreshParticipantsData: (filters?: { status?: string; search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }) => Promise<void>;
  refreshModulesData: () => Promise<void>;

  // Stats calculées
  totalParticipants: number;
  activeParticipants: number;
  inactiveParticipants: number;
  totalModules: number;
  averageCompletionRate: number;
}

export function useInstructorCohortAPI(cohortId: string): UseInstructorCohortAPIResult {
  const { user, isAuthenticated } = useAuth();

  // États
  const [cohortData, setCohortData] = useState<InstructorCohortData | null>(null);
  const [participantsData, setParticipantsData] = useState<InstructorCohortParticipant[]>([]);
  const [modulesData, setModulesData] = useState<InstructorCohortModule[]>([]);
  const [isLoadingCohort, setIsLoadingCohort] = useState(false);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction générique pour les appels API
  const apiCall = useCallback(async (endpoint: string): Promise<any> => {
    if (!isAuthenticated || !user) {
      throw new Error('Non authentifié');
    }

    const response = await fetch(`/api/instructor/cohorts/${cohortId}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Erreur ${response.status}`);
    }

    return response.json();
  }, [cohortId, user, isAuthenticated]);

  // Récupérer les données de la cohorte
  const refreshCohortData = useCallback(async () => {
    if (!cohortId || !isAuthenticated) return;

    setIsLoadingCohort(true);
    setError(null);

    try {
      console.log(`[useInstructorCohortAPI] Récupération des données de la cohorte ${cohortId}...`);
      const data: InstructorCohortResponse = await apiCall('');

      if (data.success && data.cohort) {
        setCohortData(data.cohort);
        console.log(`[useInstructorCohortAPI] Données de cohorte récupérées:`, data.cohort);
      } else {
        throw new Error('Format de réponse invalide');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement de la cohorte';
      console.error('[useInstructorCohortAPI] Erreur cohorte:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoadingCohort(false);
    }
  }, [cohortId, isAuthenticated, apiCall]);

  // Récupérer les données des participants
  const refreshParticipantsData = useCallback(async (filters: { status?: string; search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' } = {}) => {
    if (!cohortId || !isAuthenticated) return;

    setIsLoadingParticipants(true);
    setError(null);

    try {
      console.log(`[useInstructorCohortAPI] Récupération des participants avec filtres:`, filters);

      const query = new URLSearchParams();
      if (filters.status) query.set('status', filters.status);
      if (filters.search) query.set('search', filters.search);
      if (filters.sortBy) query.set('sortBy', String(filters.sortBy));
      if (filters.sortOrder) query.set('sortOrder', String(filters.sortOrder));

      const endpoint = `/participants${query.toString() ? `?${query.toString()}` : ''}`;
      const data: InstructorParticipantsResponse = await apiCall(endpoint);

      if (data.success && Array.isArray(data.participants)) {
        setParticipantsData(data.participants);
        console.log(`[useInstructorCohortAPI] ${data.participants.length} participants récupérés`);
      } else {
        throw new Error('Format de réponse invalide pour les participants');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des participants';
      console.error('[useInstructorCohortAPI] Erreur participants:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoadingParticipants(false);
    }
  }, [cohortId, isAuthenticated, apiCall]);

  // Récupérer les données des modules
  const refreshModulesData = useCallback(async () => {
    if (!cohortId || !isAuthenticated) return;

    setIsLoadingModules(true);
    setError(null);

    try {
      console.log(`[useInstructorCohortAPI] Récupération des modules pour la cohorte ${cohortId}...`);
      const data: InstructorModulesProgressResponse = await apiCall('/modules-progress');

      if (data.success && Array.isArray(data.modules)) {
        setModulesData(data.modules);
        console.log(`[useInstructorCohortAPI] ${data.modules.length} modules récupérés`);
      } else {
        throw new Error('Format de réponse invalide pour les modules');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des modules';
      console.error('[useInstructorCohortAPI] Erreur modules:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoadingModules(false);
    }
  }, [cohortId, isAuthenticated, apiCall]);

  // Chargement initial
  useEffect(() => {
    if (cohortId && isAuthenticated) {
      console.log(`[useInstructorCohortAPI] Chargement initial pour cohorte ${cohortId}`);
      refreshCohortData();
      refreshParticipantsData();
      refreshModulesData();
    }
  }, [cohortId, isAuthenticated, refreshCohortData, refreshParticipantsData, refreshModulesData]);

  // Statistiques calculées
  const totalParticipants = participantsData.length;
  const activeParticipants = participantsData.filter(p => p.status === 'active').length;
  const inactiveParticipants = participantsData.filter(p => p.status === 'inactive').length;
  const totalModules = modulesData.length;
  const averageCompletionRate = modulesData.length > 0
    ? Math.round(modulesData.reduce((sum, m) => sum + m.completionPercentage, 0) / modulesData.length)
    : 0;

  return {
    // Données
    cohortData,
    participantsData,
    modulesData,

    // États de chargement
    isLoadingCohort,
    isLoadingParticipants,
    isLoadingModules,

    // Erreurs
    error,

    // Fonctions de refresh
    refreshCohortData,
    refreshParticipantsData,
    refreshModulesData,

    // Stats calculées
    totalParticipants,
    activeParticipants,
    inactiveParticipants,
    totalModules,
    averageCompletionRate,
  };
}