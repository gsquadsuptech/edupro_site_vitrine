/**
 * Hook useInstructorStudents - Gestion des étudiants pour les instructeurs
 * 
 * Hook personnalisé pour gérer les étudiants d'un instructeur:
 * - Récupération avec filtres et pagination
 * - Gestion des étudiants inactifs
 * - Fonctions d'export et de messagerie
 * - Cache et refresh automatique
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useInstructor } from './useInstructor';

export interface InstructorStudent {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  course: string;
  courseId: string;
  progress: number;
  lastActivity: string;
  status: 'active' | 'inactive' | 'completed';
  completedLessons: number;
  totalLessons: number;
  timeSpent: number;
  enrollmentDate: string;
  averageScore?: number;
  moduleProgress?: Array<{
    module: string;
    progress: number;
    completedAt?: string;
  }>;
  activityHistory?: Array<{
    date: string;
    action: string;
    details: string;
  }>;
}

export interface InactiveStudent {
  id: string;
  name: string;
  email: string;
  course: string;
  courseId: string;
  lastActivity: string;
  daysInactive: number;
  progress: number;
}

export interface StudentsFilters {
  search?: string;
  course?: string;
  status?: 'all' | 'active' | 'inactive' | 'completed';
  progress?: 'all' | 'low' | 'medium' | 'high';
  sortBy?: 'name' | 'course' | 'progress' | 'lastActivity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface StudentsData {
  students: InstructorStudent[];
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  completedCount: number;
  filters: StudentsFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MessageData {
  subject: string;
  content: string;
  studentIds: string[];
  template?: string;
  scheduledAt?: string;
}

interface UseInstructorStudentsReturn {
  data: StudentsData | null;
  inactiveStudents: InactiveStudent[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateFilters: (filters: Partial<StudentsFilters>) => void;
  sendMessage: (messageData: MessageData) => Promise<boolean>;
  markAsContacted: (studentId: string) => Promise<boolean>;
  exportData: (format: 'csv' | 'xlsx') => Promise<string>;
  getStudentDetails: (studentId: string, courseId: string) => Promise<InstructorStudent | null>;
  refreshInactiveStudents: () => Promise<void>;
}

export const useInstructorStudents = (): UseInstructorStudentsReturn => {
  const { instructor } = useInstructor();
  const [data, setData] = useState<StudentsData | null>(null);
  const [inactiveStudents, setInactiveStudents] = useState<InactiveStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StudentsFilters>({
    search: '',
    course: 'all',
    status: 'all',
    progress: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1,
    limit: 50
  });

  const fetchStudents = useCallback(async () => {
    if (!instructor?.id) {
      setLoading(false);
      return;
    }

    try {
      setError(null);

      // Construire les paramètres de requête
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/instructor/students?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la récupération des étudiants');
      }

      const result = await response.json();
      setData(result.data);

    } catch (err) {
      console.error('Erreur récupération étudiants:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [instructor?.id, filters]);

  const fetchInactiveStudents = useCallback(async () => {
    if (!instructor?.id) return;

    try {
      const response = await fetch('/api/instructor/students/inactive?days=7', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setInactiveStudents(result.data);
      }
    } catch (err) {
      console.warn('Erreur récupération étudiants inactifs:', err);
    }
  }, [instructor?.id]);

  const updateFilters = useCallback((newFilters: Partial<StudentsFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1 // Reset page si autres filtres changent
    }));
  }, []);

  const sendMessage = useCallback(async (messageData: MessageData): Promise<boolean> => {
    if (!instructor?.id) return false;

    try {
      const response = await fetch('/api/instructor/messaging', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'send',
          data: messageData
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message');
      }

      return true;
    } catch (err) {
      console.error('Erreur envoi message:', err);
      return false;
    }
  }, [instructor?.id]);

  const markAsContacted = useCallback(async (studentId: string): Promise<boolean> => {
    if (!instructor?.id) return false;

    try {
      const response = await fetch('/api/instructor/messaging', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'mark_contacted',
          data: { studentId }
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du marquage comme contacté');
      }

      return true;
    } catch (err) {
      console.error('Erreur marquage contact:', err);
      return false;
    }
  }, [instructor?.id]);

  const exportData = useCallback(async (format: 'csv' | 'xlsx' = 'csv'): Promise<string> => {
    if (!instructor?.id) return '';

    try {
      const response = await fetch('/api/instructor/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'export',
          data: { filters, format }
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'export');
      }

      const result = await response.json();
      return result.data;
    } catch (err) {
      console.error('Erreur export:', err);
      return '';
    }
  }, [instructor?.id, filters]);

  const getStudentDetails = useCallback(async (
    studentId: string,
    courseId: string
  ): Promise<InstructorStudent | null> => {
    if (!instructor?.id) return null;

    try {
      const response = await fetch(
        `/api/instructor/students/${studentId}?courseId=${courseId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des détails');
      }

      const result = await response.json();
      return result.data;
    } catch (err) {
      console.error('Erreur détails étudiant:', err);
      return null;
    }
  }, [instructor?.id]);

  const refreshInactiveStudents = useCallback(async () => {
    await fetchInactiveStudents();
  }, [fetchInactiveStudents]);

  const refetch = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchStudents(), fetchInactiveStudents()]);
  }, [fetchStudents, fetchInactiveStudents]);

  // Chargement initial
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Chargement des étudiants inactifs
  useEffect(() => {
    fetchInactiveStudents();
  }, [fetchInactiveStudents]);

  // Nettoyage si plus d'instructeur
  useEffect(() => {
    if (!instructor) {
      setData(null);
      setInactiveStudents([]);
      setError(null);
    }
  }, [instructor]);

  return {
    data,
    inactiveStudents,
    loading,
    error,
    refetch,
    updateFilters,
    sendMessage,
    markAsContacted,
    exportData,
    getStudentDetails,
    refreshInactiveStudents
  };
};