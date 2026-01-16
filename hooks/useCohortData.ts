import { useState, useEffect, useMemo } from "react";
import { useRouter } from 'next/navigation';
import type { Course } from "@/types/course";
import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";

// Type pour les formateurs
interface Instructor {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  email: string;
  created_at?: string;
  updated_at?: string;
  organization_id?: string;
  user_id?: string;
}

// Données de démonstration pour les cours
const mockCourses: Course[] = [
  {
    id: "1",
    title: "Introduction à JavaScript",
    description: "Un cours complet sur les bases de JavaScript",
    slug: "intro-javascript",
    image_url: "/placeholder-course.jpg",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: "demo-user-1",
    level: "beginner",
    duration: 10,
    format: "session"
  },
  {
    id: "2",
    title: "React pour les débutants",
    description: "Apprendre React depuis zéro",
    slug: "react-debutants",
    image_url: "/placeholder-course.jpg",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: "demo-user-1",
    level: "beginner",
    duration: 12,
    format: "session"
  },
  {
    id: "3",
    title: "Avancé NextJS",
    description: "Techniques avancées avec NextJS",
    slug: "nextjs-avance",
    image_url: "/placeholder-course.jpg",
    status: "draft",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: "demo-user-2",
    level: "advanced",
    duration: 15,
    format: "session"
  }
];

// Données de démonstration pour les formateurs
const mockInstructors: Instructor[] = [
  {
    id: "1",
    first_name: "Fatou",
    last_name: "Diop",
    email: "fatou.diop@example.com",
    avatar_url: "/placeholder.svg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    organization_id: "org_senegal_digital",
    user_id: "user_fatou_123",
  },
  {
    id: "2",
    first_name: "Cheikh",
    last_name: "Ndiaye",
    email: "cheikh.ndiaye@example.com",
    avatar_url: "/placeholder.svg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    organization_id: "org_senegal_digital",
    user_id: "user_cheikh_456",
  },
  {
    id: "3",
    first_name: "Aïssatou",
    last_name: "Sow",
    email: "aissatou.sow@example.com",
    avatar_url: "/placeholder.svg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    organization_id: "org_senegal_digital",
    user_id: "user_aissatou_789",
  },
];

const EMPTY_COURSES_ARRAY: Course[] = [];
const EMPTY_INSTRUCTORS_ARRAY: Instructor[] = [];

export function useCohortData() {
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({});
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  
  // Utiliser notre hook d'authentification amélioré
  const { isAuthenticated, bypassEnabled } = useAuth();
  const router = useRouter();
  
  // Mise à jour du debug info
  const updateDebugInfo = (updater: (prev: Record<string, any>) => Record<string, any>) => {
    setDebugInfo(prev => updater(prev));
  };

  // Utilisation de notre nouveau hook useApi pour les cours
  const {
    data: courses,
    isLoading: isLoadingCourses,
    error: coursesError,
    useMockData: useCourseMockData,
  } = useApi<Course[]>({
    url: '/api/admin/cohorts/available-courses',
    mockData: mockCourses,
    deps: [isAuthenticated, bypassEnabled],
    onBeforeRequest: () => {
      updateDebugInfo(prev => ({
        ...prev,
        courses_fetch: {
          start_time: new Date().toISOString(),
          status: 'pending'
        }
      }));
    },
    onSuccess: (data) => {
      console.log("[useCohortData] Cours récupérés avec succès:", data?.length || 0);
      updateDebugInfo(prev => ({
        ...prev,
        courses_fetch: {
          ...prev.courses_fetch,
          completed: true,
          data_received: true,
          courses_count: data?.length || 0,
          end_time: new Date().toISOString(),
          loading: false
        }
      }));
    },
    onError: (error) => {
      console.error("[useCohortData] Erreur lors de la récupération des cours:", error);
      updateDebugInfo(prev => ({
        ...prev,
        courses_fetch: {
          ...prev.courses_fetch,
          error: error instanceof Error ? error.message : String(error),
          using_mock_data: true,
          end_time: new Date().toISOString(),
          loading: false
        }
      }));
    }
  });

  // Utilisation de notre nouveau hook useApi pour les instructeurs
  const {
    data: instructors,
    isLoading: isLoadingInstructors,
    error: instructorsError,
    useMockData: useInstructorMockData,
  } = useApi<Instructor[]>({
    url: '/api/admin/instructors',
    mockData: mockInstructors,
    deps: [isAuthenticated, bypassEnabled, useCourseMockData],
    onBeforeRequest: () => {
      // Si on utilise des données mockées pour les cours, ne pas faire de requête pour les instructeurs
      if (useCourseMockData) {
        return;
      }
      
      updateDebugInfo(prev => ({
        ...prev,
        instructors_fetch: {
          start_time: new Date().toISOString(),
          status: 'pending'
        }
      }));
    },
    onSuccess: (data) => {
      console.log("[useCohortData] Instructeurs récupérés avec succès:", data?.length || 0);
      updateDebugInfo(prev => ({
        ...prev,
        instructors_fetch: {
          ...prev.instructors_fetch,
          completed: true,
          data_received: true,
          instructors_count: data?.length || 0,
          end_time: new Date().toISOString(),
          loading: false
        }
      }));
    },
    onError: (error) => {
      console.error("[useCohortData] Erreur lors de la récupération des instructeurs:", error);
      updateDebugInfo(prev => ({
        ...prev,
        instructors_fetch: {
          ...prev.instructors_fetch,
          error: error instanceof Error ? error.message : String(error),
          using_mock_data: true,
          end_time: new Date().toISOString(),
          loading: false
        }
      }));
    }
  });

  // Déterminer si on utilise des données mockées (soit pour les cours, soit pour les instructeurs)
  const useMockData = useCourseMockData || useInstructorMockData;

  // Ajouter les informations d'authentification au debug
  useEffect(() => {
    updateDebugInfo(prev => ({
      ...prev,
      auth_state: {
        timestamp: new Date().toISOString(),
        is_authenticated: isAuthenticated,
        bypass_enabled: bypassEnabled,
        using_mock_data: useMockData
      }
    }));
  }, [isAuthenticated, bypassEnabled]);

  // Déterminer l'erreur à afficher (priorité aux erreurs des cours)
  const error = coursesError || instructorsError;

  return {
    courses: courses || EMPTY_COURSES_ARRAY,
    instructors: instructors || EMPTY_INSTRUCTORS_ARRAY,
    isLoadingCourses,
    isLoadingInstructors,
    error,
    useMockData,
    debugInfo,
    isCheckingAuth
  };
} 