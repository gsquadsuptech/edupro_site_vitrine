/**
 * Hook useInstructor - Gestion authentification et profil instructeur
 * 
 * Récupère et gère le profil instructeur lié à l'utilisateur connecté
 * Vérifie que l'utilisateur a bien le rôle instructeur
 */

'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from './useAuth';

export interface Instructor {
  id: string;
  user_id: string;
  name: string;
  email: string;
  avatar_url?: string | null;
  specialization?: string | null;
  bio?: string | null;
  rating?: number;
  status: string;
  courses_count?: number;
  students_count?: number;
  organization_id: string;
  commission_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface InstructorCommission {
  id: string;
  instructor_id: string;
  percentage: number;
  start_date: string;
  end_date?: string | null;
  created_at: string;
  updated_at: string;
}

interface UseInstructorReturn {
  instructor: Instructor | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useInstructor = (): UseInstructorReturn => {
  const { user, supabase } = useAuth();
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  const fetchInstructor = async () => {
    if (!user || !supabase) {
      setInstructor(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Récupérer le profil instructeur via user_id
      const { data: instructorData, error: instructorError } = await supabase
        .from('instructors')
        .select(`
          id,
          user_id,
          name,
          email,
          avatar_url,
          specialization,
          bio,
          rating,
          status,
          courses_count,
          students_count,
          organization_id,
          created_at,
          updated_at
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (instructorError) {
        if (instructorError.code === 'PGRST116') {
          // Aucun enregistrement trouvé
          setError('Profil instructeur non trouvé');
          setInstructor(null);
        } else {
          console.error('Erreur lors de la récupération du profil instructeur:', instructorError);
          setError('Erreur de chargement du profil instructeur');
          setInstructor(null);
        }
        return;
      }

      if (!instructorData) {
        setError('Profil instructeur non trouvé');
        setInstructor(null);
        return;
      }

      // Vérifier que le statut est actif
      if (instructorData.status !== 'active') {
        setError('Compte instructeur inactif');
        setInstructor(null);
        return;
      }

      setInstructor(instructorData);
      setError(null);

    } catch (err) {
      console.error('Exception lors de la récupération de l\'instructeur:', err);
      setError('Erreur inattendue lors du chargement');
      setInstructor(null);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    // Réinitialiser l'état pour éviter un écran vide avec des données obsolètes
    setInstructor(null);
    setLoading(true);
    await fetchInstructor();
  };

  useEffect(() => {
    fetchInstructor();
  }, [user, supabase]);

  // Refetch lorsqu'on change d'URL (utile au basculement d'interface)
  useEffect(() => {
    if (!pathname) return;
    // Délaisser si pas encore de session
    if (!user || !supabase) return;
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Écoute un événement global déclenché par le hook useInterfaceRefresh
  useEffect(() => {
    const handleInterfaceChanged = () => {
      refetch();
    };
    try {
      window.addEventListener('interfaceChanged', handleInterfaceChanged as EventListener);
      return () => window.removeEventListener('interfaceChanged', handleInterfaceChanged as EventListener);
    } catch {
      // no-op SSR
    }
  }, [refetch]);

  return {
    instructor,
    loading,
    error,
    refetch
  };
};