import { useCallback } from 'react';
import { useApi } from './useApi';
import type { Cohort, CohortStatus } from '@/types/cohort';

// Types pour les paramètres de filtrage des cohortes
interface CohortFilters {
  courseId?: string;
  status?: CohortStatus;
  search?: string;
  page?: number;
  limit?: number;
}

// Types pour les opérations de cohorte
interface CreateCohortData {
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  status?: CohortStatus;
  max_students?: number;
  courses?: string[];
  instructors?: string[];
  userIds?: string[];
}

type UpdateCohortData = Partial<CreateCohortData> & { id: string };

// Hook pour les opérations sur les cohortes
export function useCohortsApi() {
  // Récupérer toutes les cohortes avec filtres optionnels
  const {
    data: cohorts,
    isLoading: isLoadingCohorts,
    error: cohortsError,
    fetch: fetchCohortsWithFilters,
    refetch: refetchCohorts,
  } = useApi<Cohort[]>({
    url: '/api/admin/cohorts',
    manual: true, // Ne pas charger automatiquement
  });

  // Récupérer une cohorte spécifique par ID
  const getCohort = useCallback((cohortId: string) => {
    return useApi<Cohort>({
      url: `/api/admin/cohorts/${cohortId}`,
    });
  }, []);

  // Créer une nouvelle cohorte
  const createCohort = useCallback(async (data: CreateCohortData) => {
    const { fetch } = useApi<Cohort>({
      url: '/api/admin/cohorts',
      method: 'POST',
      manual: true,
    });
    return await fetch(data);
  }, []);

  // Mettre à jour une cohorte existante
  const updateCohort = useCallback(async (data: UpdateCohortData) => {
    const { id, ...updateData } = data;
    const { fetch } = useApi<Cohort>({
      url: `/api/admin/cohorts/${id}`,
      method: 'PATCH',
      manual: true,
    });
    return await fetch(updateData);
  }, []);

  // Supprimer une cohorte
  const deleteCohort = useCallback(async (cohortId: string) => {
    const { fetch } = useApi<void>({
      url: `/api/admin/cohorts/${cohortId}`,
      method: 'DELETE',
      manual: true,
    });
    return await fetch();
  }, []);

  // Charger les cohortes avec des filtres
  const loadCohorts = useCallback(async (filters?: CohortFilters) => {
    let url = '/api/admin/cohorts';
    
    // Ajouter les paramètres de requête si des filtres sont fournis
    if (filters) {
      const params = new URLSearchParams();
      if (filters.courseId) params.append('courseId', filters.courseId);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    return await fetchCohortsWithFilters();
  }, []);

  return {
    cohorts,
    isLoadingCohorts,
    cohortsError,
    getCohort,
    createCohort,
    updateCohort,
    deleteCohort,
    loadCohorts,
    refetchCohorts,
  };
} 