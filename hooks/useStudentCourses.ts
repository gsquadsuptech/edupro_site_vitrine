import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';

export interface StudentCourse {
  id: string;
  title: string;
  progress: number;
  lastActivityDate: string;
  modulesCompleted: number;
  modulesTotal: number;
  instructorName: string;
  isExpired: boolean;
  enrollmentId: string;
  status: 'active' | 'completed' | 'pending' | 'inactive' | 'suspended';
  category: string;
  level: string;
  duration: number;
  language: string;
  imageUrl?: string;
  description?: string;
  cohortName?: string;
  cohortId?: string;
  timeRemainingEstimate: number;
  enrolledAt: string;
  completedAt?: string;
  successRate?: number; // moyenne des exercices réussis pour ce cours
}

export interface CourseStats {
  totalCount: number;
  ongoingCount: number;
  completedCount: number;
  toStartCount: number;
  modulesCompleted?: number; // somme des modules complétés
  avgSuccessRate?: number;   // moyenne des successRate des cours
}

export interface CoursePagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface UseStudentCoursesOptions {
  filter?: 'all' | 'ongoing' | 'completed' | 'tostart';
  search?: string;
  sort?: 'recent' | 'progress' | 'alphabetical';
  page?: number;
  limit?: number;
}

export interface UseStudentCoursesReturn {
  courses: StudentCourse[];
  stats: CourseStats | null;
  pagination: CoursePagination | null;
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateFilter: (filter: UseStudentCoursesOptions['filter']) => void;
  updateSearch: (search: string) => void;
  updateSort: (sort: UseStudentCoursesOptions['sort']) => void;
  updatePage: (page: number) => void;
}

export const useStudentCourses = (options: UseStudentCoursesOptions = {}): UseStudentCoursesReturn => {
  const { user, supabase } = useAuth();
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [stats, setStats] = useState<CourseStats | null>(null);
  const [pagination, setPagination] = useState<CoursePagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState(options.filter || 'all');
  const [search, setSearch] = useState(options.search || '');
  const [sort, setSort] = useState(options.sort || 'recent');
  const [page, setPage] = useState(options.page || 1);

  // Debounce pour la recherche
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const fetchCourses = async () => {
    if (!user || !supabase) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        setError("Token d'authentification manquant");
        setIsLoading(false);
        return;
      }

      // Construction des paramètres de requête
      const params = new URLSearchParams();
      if (filter && filter !== 'all') params.append('filter', filter);
      if (search) params.append('search', search);
      if (sort) params.append('sort', sort);
      if (page) params.append('page', page.toString());
      if (options.limit) params.append('limit', options.limit.toString());

      const response = await fetch(`/api/v1/student/courses/enrolled?${params.toString()}`, {
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
      const fetchedCourses: StudentCourse[] = data.courses || [];
      setCourses(fetchedCourses);

      // Stats API de base
      const baseStats: CourseStats | null = data.stats || null;

      // Stats dérivées (modules complétés + taux de réussite moyen)
      const modulesCompleted = fetchedCourses.reduce((sum, c) => sum + (c.modulesCompleted || 0), 0);
      const successRates = fetchedCourses.map(c => typeof c.successRate === 'number' ? c.successRate! : null).filter(v => v !== null) as number[];
      const avgSuccessRate = successRates.length > 0 ? Math.round(successRates.reduce((s, v) => s + v, 0) / successRates.length) : 0;

      setStats(baseStats ? { ...baseStats, modulesCompleted, avgSuccessRate } : { totalCount: 0, ongoingCount: 0, completedCount: 0, toStartCount: 0, modulesCompleted, avgSuccessRate });
      setPagination(data.pagination || null);

    } catch (err) {
      console.error('Erreur lors de la récupération des cours:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setCourses([]);
      setStats(null);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Effet pour récupérer les cours quand les paramètres changent
  useEffect(() => {
    fetchCourses();
  }, [user, filter, search, sort, page]);

  // Fonctions de mise à jour
  const updateFilter = (newFilter: UseStudentCoursesOptions['filter']) => {
    setFilter(newFilter || 'all');
    setPage(1); // Reset à la première page
  };

  const updateSearch = (newSearch: string) => {
    // Annuler le timeout précédent
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Indiquer que la recherche est en cours
    setIsSearching(true);

    // Définir un nouveau timeout pour le debounce (300ms)
    searchTimeoutRef.current = setTimeout(() => {
      setSearch(newSearch);
      setPage(1); // Reset à la première page
      setIsSearching(false);
    }, 300);
  };

  const updateSort = (newSort: UseStudentCoursesOptions['sort']) => {
    setSort(newSort || 'recent');
    setPage(1); // Reset à la première page
  };

  const updatePage = (newPage: number) => {
    setPage(newPage);
  };

  const refresh = async () => {
    await fetchCourses();
  };

  return {
    courses,
    stats,
    pagination,
    isLoading,
    isSearching,
    error,
    refresh,
    updateFilter,
    updateSearch,
    updateSort,
    updatePage,
  };
}; 