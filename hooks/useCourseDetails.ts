import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCache } from '@/lib/cache/redis';

export interface Chapter {
  id: string;
  title: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'not-started' | 'locked';
  type: 'video' | 'quiz' | 'document' | 'exercise' | 'project';
}

export interface Module {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
  progress: number;
  isLocked?: boolean;
}

export interface Instructor {
  id: string;
  name: string;
  avatar_url?: string;
  specialization?: string;
  bio?: string;
}

export interface CourseDetails {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  instructor: Instructor;
  progress: number;
  total_duration?: number;
  enrolled_students?: number;
  access_end_date?: string | null;
  last_activity_date?: string;
  modules: Module[];
  enrollment: {
    id: string;
    status: string;
    progress: number;
    enrolled_at: string;
    completed_at?: string;
  };
  isExpired: boolean;
  timeRemainingEstimate: number;
  userStats: {
    modulesCompleted: number;
    modulesTotal: number;
    timeSpent: number;
    averageScore: number;
    lastActivity: string;
  };
}

interface UseCourseDetailsOptions {
  courseId: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useCourseDetails = ({ 
  courseId, 
  autoRefresh = true, 
  refreshInterval = 30000 
}: UseCourseDetailsOptions) => {
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { supabase, user } = useAuth();

  const fetchCourseDetails = async () => {
    if (!user || !supabase) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        setError("Token d'authentification manquant");
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/v1/student/courses/${courseId}/details`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setCourse(data);

    } catch (err) {
      console.error('Erreur lors de la récupération des détails du cours:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour récupérer les données initiales
  useEffect(() => {
    fetchCourseDetails();
  }, [user, courseId]);

  // Effet pour le rafraîchissement automatique
  useEffect(() => {
    if (!autoRefresh || !course) return;

    const interval = setInterval(() => {
      fetchCourseDetails();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, course]);

  // Fonction pour forcer le rafraîchissement
  const refresh = () => {
    fetchCourseDetails();
  };

  return {
    course,
    loading,
    error,
    refresh
  };
}; 