import { useState, useEffect } from 'react';
import { UserCourse, UserCoursesStats } from '@/lib/services/user-courses-service';

export interface UseUserCoursesOptions {
  status?: string;
  searchQuery?: string;
}

export function useUserCourses(options: UseUserCoursesOptions = {}) {
  const [courses, setCourses] = useState<UserCourse[]>([]);
  const [stats, setStats] = useState<UserCoursesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = '/api/users/courses';
      
      if (options.status || options.searchQuery) {
        const params = new URLSearchParams();
        if (options.status && options.status !== 'all') {
          params.append('status', options.status);
        }
        if (options.searchQuery) {
          params.append('q', options.searchQuery);
        }
        url = `/api/users/courses/search?${params.toString()}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCourses(data);
    } catch (err) {
      console.error('Erreur lors du chargement des cours:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/users/courses/stats');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
    }
  };

  // Update course progress
  const updateProgress = async (enrollmentId: string, progress: number) => {
    try {
      const response = await fetch('/api/users/courses/progress', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enrollmentId,
          progress
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh courses after updating progress
      await fetchCourses();
      await fetchStats();
      
      return true;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du progrès:', err);
      throw err;
    }
  };

  // Refresh data
  const refresh = async () => {
    await Promise.all([fetchCourses(), fetchStats()]);
  };

  // Filter courses by status
  const getCoursesByStatus = (status: string) => {
    switch (status) {
      case 'ongoing':
        return courses.filter(c => c.status === 'active');
      case 'completed':
        return courses.filter(c => c.status === 'completed');
      case 'tostart':
        return courses.filter(c => c.status === 'pending' || c.status === 'inactive');
      default:
        return courses;
    }
  };

  // Search courses
  const searchCourses = (query: string) => {
    if (!query) return courses;
    
    const searchTerm = query.toLowerCase();
    return courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm) ||
      course.instructor.name.toLowerCase().includes(searchTerm) ||
      course.category.toLowerCase().includes(searchTerm)
    );
  };

  // Initial data fetch
  useEffect(() => {
    fetchCourses();
    fetchStats();
  }, [options.status, options.searchQuery]);

  return {
    courses,
    stats,
    loading,
    error,
    refresh,
    updateProgress,
    getCoursesByStatus,
    searchCourses
  };
}

// Hook for specific course status
export function useUserCoursesByStatus(status: string) {
  return useUserCourses({ status });
}

// Hook for course search
export function useUserCoursesSearch(searchQuery: string) {
  return useUserCourses({ searchQuery });
}