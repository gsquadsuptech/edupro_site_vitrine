import { useCallback, useState } from 'react';
import { useApi } from './useApi';
import type { Student } from '@/types/student';

// Types pour les paramètres de filtrage des étudiants
interface StudentFilters {
  cohortId?: string;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

// Types pour les opérations sur les étudiants
interface CreateStudentData {
  email: string;
  first_name?: string;
  last_name?: string;
  cohortId?: string;
}

interface InviteStudentData {
  email: string;
  firstName?: string;
  lastName?: string;
  cohortId?: string;
}

type UpdateStudentData = Partial<CreateStudentData> & { id: string };

// Mock data pour les étudiants (utilisé en cas d'erreur d'API)
const MOCK_STUDENTS: Student[] = [
  {
    id: 'mock-1',
    email: 'john@example.com',
    first_name: 'John',
    last_name: 'Doe',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'active',
    cohorts: [{ id: 'cohort-1', name: 'Web Development 2023' }]
  },
  {
    id: 'mock-2',
    email: 'jane@example.com',
    first_name: 'Jane',
    last_name: 'Smith',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'invited',
    cohorts: [{ id: 'cohort-1', name: 'Web Development 2023' }]
  }
];

// Hook pour les opérations sur les étudiants
export function useStudentsApi() {
  // Initialiser les hooks au niveau supérieur
  const createStudentApi = useApi<Student>({
    url: '/api/admin/students',
    method: 'POST',
    manual: true,
  });

  const updateStudentApi = useApi<Student>({
    url: '/api/admin/students', // L'URL sera complétée dynamiquement
    method: 'PATCH',
    manual: true,
  });
  
  const inviteStudentApi = useApi<Student>({
    url: '/api/admin/students',
    method: 'POST',
    manual: true,
  });
  
  const deleteStudentApi = useApi({
    url: '/api/admin/students', // L'URL sera complétée dynamiquement
    method: 'DELETE',
    manual: true,
  });

  // États pour notre version améliorée avec fetch natif
  const [students, setStudents] = useState<Student[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer la liste des étudiants - Hook existant maintenu pour compatibilité
  const { fetch: fetchStudents, refetch } = useApi<Student[]>({
    url: '/api/admin/students',
    method: 'GET',
    manual: true,
  });

  // Créer un nouvel étudiant
  const createStudent = useCallback(async (data: CreateStudentData) => {
    return await createStudentApi.fetch(data);
  }, [createStudentApi]);

  // Mettre à jour un étudiant existant
  const updateStudent = useCallback(async (data: UpdateStudentData) => {
    const { id, ...updateData } = data;
    // Passer l'URL complète via le paramètre override
    return await updateStudentApi.fetch({
      ...updateData,
      url: `/api/admin/students/${id}`
    });
  }, [updateStudentApi]);

  // Inviter un étudiant à rejoindre une cohorte - Version simplifiée et plus fiable
  const inviteStudent = useCallback(async (data: InviteStudentData) => {
    console.log("Tentative d'invitation avec les données:", data);
    
    try {
      // Utiliser directement fetch natif pour éviter les problèmes
      const response = await fetch('/api/admin/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      const responseText = await response.text();
      console.log("Réponse brute de l'API:", responseText);
      
      if (!response.ok) {
        let errorText = 'Erreur inconnue';
        try {
          const errorData = JSON.parse(responseText);
          errorText = errorData.error || errorData.message || `Erreur ${response.status}`;
        } catch (e) {
          errorText = `Erreur ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorText);
      }
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error("Erreur lors du parsing de la réponse:", e);
        throw new Error("Réponse invalide du serveur");
      }
      
      console.log("Réponse parsée de l'API:", result);
      return result.data;
    } catch (error) {
      console.error("Erreur lors de l'invitation:", error);
      throw error;
    }
  }, []);

  // Supprimer un étudiant
  const deleteStudent = useCallback(async (id: string) => {
    // Passer l'URL complète via le paramètre override
    return await deleteStudentApi.fetch({
      url: `/api/admin/students/${id}`
    });
  }, [deleteStudentApi]);

  // Charger les étudiants avec filtres optionnels - Version plus fiable
  const loadStudents = useCallback(async (filters?: StudentFilters) => {
    setIsLoading(true);
    setError(null);
    
    // Construire l'URL avec les filtres
    let url = '/api/admin/students';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.cohortId) params.append('cohortId', filters.cohortId);
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      
      const queryString = params.toString();
      if (queryString) {
        url = `${url}?${queryString}`;
      }
    }
    
    try {
      // Utiliser directement fetch natif pour éviter les problèmes d'annulation
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        let errorText = '';
        try {
          const errorData = await response.json();
          errorText = errorData.error || errorData.message || `Erreur ${response.status}`;
        } catch (e) {
          errorText = `Erreur ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorText);
      }
      
      const result = await response.json();
      // Mettre à jour l'état local
      // L'API retourne directement un tableau, pas un objet avec data
      const studentsData = Array.isArray(result) ? result : (result.data || []);
      setStudents(studentsData);
      return studentsData;
    } catch (error) {
      console.error("Erreur lors du chargement des étudiants:", error);
      // Gestion d'erreur simplifiée
      setError(error instanceof Error ? error.message : 'Erreur lors du chargement des étudiants');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    students,
    isLoading,
    error,
    createStudent,
    updateStudent,
    deleteStudent,
    inviteStudent,
    loadStudents,
    refetch
  };
} 