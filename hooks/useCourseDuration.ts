import { useState, useEffect, useCallback } from 'react';
import { createCourseDurationService, CourseDurationService } from '@/lib/services/course-duration.service';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook pour calculer et gérer la durée d'un cours
 */
export function useCourseDuration(courseId?: string) {
  const { supabase } = useAuth();
  const [duration, setDuration] = useState<number>(0);
  const [lessonsCount, setLessonsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour recalculer la durée
  const recalculateDuration = useCallback(async () => {
    if (!courseId || !supabase) {
      setDuration(0);
      setLessonsCount(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const service = createCourseDurationService(supabase);
      // Utiliser la nouvelle méthode basée sur le contenu des leçons
      const { duration: calculatedDuration, lessonsCount: calculatedLessonsCount } = await service.calculateCourseDurationWithDetailsFromContent(courseId);
      setDuration(calculatedDuration);
      setLessonsCount(calculatedLessonsCount);
    } catch (err) {
      console.error('Erreur lors du calcul de la durée:', err);
      setError('Impossible de calculer la durée du cours');
    } finally {
      setIsLoading(false);
    }
  }, [courseId, supabase]);

  // Fonction pour mettre à jour la durée dans la base de données
  const updateDuration = useCallback(async () => {
    if (!courseId || !supabase) return 0;

    setIsLoading(true);
    setError(null);

    try {
      const service = createCourseDurationService(supabase);
      // Utiliser la nouvelle méthode basée sur le contenu des leçons
      const updatedDuration = await service.updateCourseDurationFromContent(courseId);
      setDuration(updatedDuration);
      return updatedDuration;
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la durée:', err);
      setError('Impossible de mettre à jour la durée du cours');
      return 0;
    } finally {
      setIsLoading(false);
    }
  }, [courseId, supabase]);

  // Calculer la durée lors du changement de courseId
  useEffect(() => {
    recalculateDuration();
  }, [recalculateDuration]);

  // Formatage de la durée
  const formattedDuration = CourseDurationService.formatDuration(duration);
  
  // Durée en heures décimales
  const durationInHours = CourseDurationService.minutesToHours(duration);

  return {
    duration,
    formattedDuration,
    durationInHours,
    lessonsCount,
    isLoading,
    error,
    recalculateDuration,
    updateDuration,
  };
}

/**
 * Hook pour calculer la durée de plusieurs cours
 */
export function useMultipleCourseDurations(courseIds: string[]) {
  const { supabase } = useAuth();
  const [durations, setDurations] = useState<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const calculateDurations = useCallback(async () => {
    if (courseIds.length === 0 || !supabase) {
      setDurations(new Map());
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const service = createCourseDurationService(supabase);
      const calculatedDurations = await service.calculateMultipleCourseDurations(courseIds);
      setDurations(calculatedDurations);
    } catch (err) {
      console.error('Erreur lors du calcul des durées:', err);
      setError('Impossible de calculer les durées des cours');
    } finally {
      setIsLoading(false);
    }
  }, [courseIds, supabase]);

  useEffect(() => {
    calculateDurations();
  }, [calculateDurations]);

  return {
    durations,
    isLoading,
    error,
    recalculateDurations: calculateDurations,
  };
}