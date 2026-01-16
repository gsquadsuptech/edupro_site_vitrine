import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Types pour les réponses API (basés sur nos endpoints)
export interface APICohortData {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  timezone: string;
  type: 'hybrid';
  instructor: {
    id: string;
    name: string;
    first_name: string;
    last_name: string;
    avatar: string;
    email: string;
    title: string;
    phone: string;
  };
  progress: {
    overall: number;
    completed_modules: number;
    total_modules: number;
    completed_items: number;
    total_items: number;
    time_spent_hours: number;
    average_score: number | null;
  };
  stats: {
    total_participants: number;
    active_participants: number;
    total_modules: number;
    completed_modules: number;
    total_sessions: number;
    completed_sessions: number;
    attendance_rate: number;
  };
  next_session: {
    id: string;
    title: string;
    description: string;
    date: string;
    start_time: string;
    end_time: string;
    live_links: any;
    is_recorded: boolean;
  } | null;
  current_week: {
    id: string;
    title: string;
    description: string;
    week_number: number;
    start_date: string;
    end_date: string;
    objectives: string[];
    estimated_duration_hours: number;
    content_items: any[];
  } | null;
  notifications: {
    unread_count: number;
    recent: any[];
  };
  participation: {
    id: string;
    status: string;
    joined_at: string;
  };
}

export interface APIContentResponse {
  cohort_id: string;
  course_id: string;
  sections: ContentSection[];
  stats: {
    total_sections: number;
    total_lessons: number;
    completed_lessons: number;
    in_progress_lessons: number;
    overall_progress: number;
  };
  meta: {
    filtered_by_section: string | null;
    include_unpublished: boolean;
    total_sections: number;
  };
}

export interface ContentSection {
  id: string;
  title: string;
  position: number;
  created_at: string;
  updated_at: string;
  lessons: ContentLesson[];
  stats: {
    total_lessons: number;
    completed_lessons: number;
    in_progress_lessons: number;
  };
}

export interface ContentLesson {
  id: string;
  title: string;
  type: string;
  content: any;
  position: number;
  duration: number | null;
  is_preview: boolean;
  created_at: string;
  updated_at: string;
  progress: {
    status: 'not_started' | 'in_progress' | 'completed';
    progress_percentage: number;
    completed_at: string | null;
    current_time: number;
    total_duration: number;
  };
}

export interface APISessionsResponse {
  cohort_id: string;
  sessions: any[];
  stats: {
    total_sessions: number;
    upcoming_sessions: number;
    completed_sessions: number;
    attended_sessions: number;
    attendance_rate: number;
    next_session: any;
  };
  meta: {
    total_count: number;
    limit: number;
    offset: number;
    filtered_by_status: string | null;
    has_next_page: boolean;
    has_previous_page: boolean;
  };
}

export interface APIResourcesResponse {
  cohort_id: string;
  resources: any[];
  resources_by_module: Record<string, any>;
  stats: {
    total_resources: number;
    documents: number;
    recordings: number;
    links: number;
    total_size_mb: number;
    categories: any[];
  };
  meta: {
    total_count: number;
    limit: number;
    offset: number;
    filtered_by_category: string | null;
    has_next_page: boolean;
    has_previous_page: boolean;
    available_categories: string[];
  };
}

export interface APIParticipantsResponse {
  cohort_id: string;
  participants: any[];
  participants_by_role: {
    instructors: any[];
    students: any[];
  };
  stats: {
    total_participants: number;
    active_participants: number;
    inactive_participants: number;
    instructors: number;
    students: number;
    online_participants: number;
    away_participants: number;
    offline_participants: number;
  };
  meta: {
    total_count: number;
    limit: number;
    offset: number;
    filtered_by_status: string | null;
    search_query: string | null;
    has_next_page: boolean;
    has_previous_page: boolean;
    available_statuses: string[];
    available_roles: string[];
  };
}

export interface APIDiscussionsResponse {
  cohort_id: string;
  messages: any[];
  pinned_messages: any[];
  stats: {
    total_messages: number;
    messages_today: number;
    active_participants: number;
    pinned_messages: number;
    messages_this_week: number;
  };
  meta: {
    total_count: number; // Ajouter totalCount
    limit: number; // Ajouter limit
    offset: number; // Ajouter offset
    order: string;
    has_next_page: boolean;
    has_previous_page: boolean;
    available_reactions: string[];
    current_user: {
      id: string;
      can_pin: boolean;
    };
  };
}

export interface APIAnnouncementsResponse {
  cohort_id: string;
  announcements: any[];
  pinned_announcements: any[];
  stats: {
    total_announcements: number;
    unread_announcements: number;
    urgent_announcements: number;
    pinned_announcements: number;
    announcements_this_week: number;
    categories: any[];
  };
  meta: {
    total_count: number;
    limit: number;
    offset: number;
    filtered_by_priority: string | null;
    filtered_by_category: string | null;
    unread_only: boolean;
    has_next_page: boolean;
    has_previous_page: boolean;
    available_priorities: string[];
    available_categories: string[];
  };
}

interface UseCohortAPIResult {
  // Données
  cohortData: APICohortData | null;
  contentData: APIContentResponse | null;
  sessionsData: APISessionsResponse | null;
  resourcesData: APIResourcesResponse | null;
  participantsData: APIParticipantsResponse | null;
  discussionsData: APIDiscussionsResponse | null;
  announcementsData: APIAnnouncementsResponse | null;
  
  // États de chargement
  isLoading: boolean;
  isLoadingContent: boolean;
  isLoadingSessions: boolean;
  isLoadingResources: boolean;
  isLoadingParticipants: boolean;
  isLoadingDiscussions: boolean;
  isLoadingAnnouncements: boolean;
  
  // Erreurs
  error: string | null;
  
  // Actions
  refreshCohortData: () => Promise<void>;
  refreshContentData: (filters?: { week?: number }) => Promise<void>;
  refreshSessionsData: (filters?: { status?: string }) => Promise<void>;
  refreshResourcesData: (filters?: { category?: string }) => Promise<void>;
  refreshParticipantsData: (filters?: { status?: string; search?: string }) => Promise<void>;
  refreshDiscussionsData: (filters?: { limit?: number; offset?: number }) => Promise<void>;
  refreshAnnouncementsData: (filters?: { priority?: string; category?: string; unread_only?: boolean }) => Promise<void>;
  
  // Actions de publication
  postMessage: (message: string, messageType?: string) => Promise<boolean>;
}

export function useCohortAPI(cohortId: string): UseCohortAPIResult {
  const { user, supabase, isAuthenticated } = useAuth();
  // États pour les données
  const [cohortData, setCohortData] = useState<APICohortData | null>(null);
  const [contentData, setContentData] = useState<APIContentResponse | null>(null);
  const [sessionsData, setSessionsData] = useState<APISessionsResponse | null>(null);
  const [resourcesData, setResourcesData] = useState<APIResourcesResponse | null>(null);
  const [participantsData, setParticipantsData] = useState<APIParticipantsResponse | null>(null);
  const [discussionsData, setDiscussionsData] = useState<APIDiscussionsResponse | null>(null);
  const [announcementsData, setAnnouncementsData] = useState<APIAnnouncementsResponse | null>(null);

  // États de chargement
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);
  const [isLoadingDiscussions, setIsLoadingDiscussions] = useState(false);
  const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(false);

  // Erreur globale
  const [error, setError] = useState<string | null>(null);

  // Helper pour les appels API
  const apiCall = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    if (!cohortId || !isAuthenticated) {
      console.warn(`[useCohortAPI] apiCall skipped: missing cohortId or not authenticated. Endpoint: ${endpoint}`);
      return null;
    }

    // L'endpoint contient déjà la chaîne de requête (ex: /discussions?limit=5&offset=5)
    const url = `/api/v1/student/cohorts/${cohortId}${endpoint}`;

    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    const headers = new Headers(options.headers);
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    headers.set('Content-Type', 'application/json');

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
    }

    return response.json();
  }, [cohortId, supabase, isAuthenticated]);

  // Fonctions de chargement des données - utiliser useCallback pour éviter les re-rendus infinis
  const refreshCohortData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const data = await apiCall('');
      
      // Seulement réinitialiser l'erreur une fois les données chargées avec succès
      setError(null);
      setCohortData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des données de cohorte';
      console.error('[useCohortAPI] Erreur cohort data:', err);
      setCohortData(null); // Reset les données en cas d'erreur
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [cohortId, supabase, isAuthenticated, apiCall]);

  const refreshContentData = useCallback(async (filters: { week?: number } = {}) => {
    // Forcer un rechargement à chaque appel (le cache serveur gère la fraîcheur)
    setIsLoadingContent(true);
    try {
      const query = new URLSearchParams();
      if (filters.week) query.set('week', filters.week.toString());
      
      const data = await apiCall(`/content?${query.toString()}`);
      setContentData(data);
    } catch (err) {
      console.error('[useCohortAPI] Erreur content data:', err);
    } finally {
      setIsLoadingContent(false);
    }
  }, [cohortId, supabase, isAuthenticated, apiCall]);

  const refreshSessionsData = useCallback(async (filters: { status?: string } = {}) => {
    setIsLoadingSessions(true);
    try {
      const query = new URLSearchParams();
      if (filters.status) query.set('status', filters.status);
      
      const data = await apiCall(`/sessions?${query.toString()}`);
      setSessionsData(data);
    } catch (err) {
      console.error('Erreur sessions data:', err);
    } finally {
      setIsLoadingSessions(false);
    }
  }, [cohortId, supabase, isAuthenticated, apiCall]);

  const refreshResourcesData = useCallback(async (filters: { category?: string } = {}) => {
    setIsLoadingResources(true);
    try {
      const query = new URLSearchParams();
      if (filters.category) query.set('category', filters.category);
      
      const data = await apiCall(`/resources?${query.toString()}`);
      setResourcesData(data);
    } catch (err) {
      console.error('Erreur resources data:', err);
    } finally {
      setIsLoadingResources(false);
    }
  }, [cohortId, supabase, isAuthenticated, apiCall]);

  const refreshParticipantsData = useCallback(async (filters: { status?: string; search?: string } = {}) => {
    setIsLoadingParticipants(true);
    try {
      const query = new URLSearchParams();
      if (filters.status) query.set('status', filters.status);
      if (filters.search) query.set('search', filters.search);
      
      const data = await apiCall(`/participants?${query.toString()}`);
      setParticipantsData(data);
    } catch (err) {
      console.error('Erreur participants data:', err);
    } finally {
      setIsLoadingParticipants(false);
    }
  }, [cohortId, supabase, isAuthenticated, apiCall]);

  const refreshDiscussionsData = useCallback(async (filters: { limit?: number; offset?: number } = {}) => {
    setIsLoadingDiscussions(true);
    try {
      const query = new URLSearchParams();
      if (filters.limit) {
        query.set('limit', filters.limit.toString());
      }
      if (filters.offset !== undefined && filters.offset !== null) {
        query.set('offset', filters.offset.toString());
      }
      
      const apiEndpoint = `/discussions?${query.toString()}`;

      const response = await apiCall(apiEndpoint); // Récupérer la réponse structurée

      const discussionsData: APIDiscussionsResponse = {
        cohort_id: cohortId,
        messages: response.messages || [],
        pinned_messages: [], // À implémenter si nécessaire
        stats: {
          total_messages: response.totalCount || 0,
          messages_today: 0, // À calculer si nécessaire
          active_participants: 0, // À calculer si nécessaire
          pinned_messages: 0,
          messages_this_week: 0, // À calculer si nécessaire
        },
        meta: {
          total_count: response.totalCount || 0,
          limit: response.limit || filters.limit || 50,
          offset: response.offset || filters.offset || 0,
          order: 'desc',
          has_next_page: (response.offset + response.messages.length) < response.totalCount, // Calculer has_next_page
          has_previous_page: response.offset > 0, // Calculer has_previous_page
          available_reactions: [], // À implémenter si nécessaire
          current_user: {
            id: '', // À remplir avec l'ID de l'utilisateur actuel
            can_pin: false, // À implémenter si nécessaire
          },
        },
      };
      
      // Si un offset est fourni, ajouter les messages aux messages existants
      if (filters.offset && discussionsData) {
        setDiscussionsData((prevData) => {
          if (!prevData) {
            return discussionsData;
          }
          const newMessages = [...prevData.messages, ...(response.messages || [])];
          const newHasNextPage = (response.offset + (response.messages || []).length + prevData.messages.length) < response.totalCount; // Utiliser la longueur combinée

          return {
            ...prevData,
            messages: newMessages,
            meta: {
              ...prevData.meta,
              offset: response.offset || filters.offset || 0, // Mettre à jour l'offset
              has_next_page: newHasNextPage,
            },
          };
        });
      } else {
        setDiscussionsData(discussionsData);
      }
    } catch (err) {
      console.error('Erreur discussions data:', err);
    } finally {
      setIsLoadingDiscussions(false);
    }
  }, [cohortId, supabase, isAuthenticated, apiCall]);

  const refreshAnnouncementsData = useCallback(async (filters: { priority?: string; category?: string; unread_only?: boolean } = {}) => {
    setIsLoadingAnnouncements(true);
    try {
      const query = new URLSearchParams();
      if (filters.priority) query.set('priority', filters.priority);
      if (filters.category) query.set('category', filters.category);
      if (filters.unread_only) query.set('unread_only', 'true');
      
      const data = await apiCall(`/announcements?${query.toString()}`);
      setAnnouncementsData(data);
    } catch (err) {
      console.error('Erreur announcements data:', err);
    } finally {
      setIsLoadingAnnouncements(false);
    }
  }, [cohortId, supabase, isAuthenticated, apiCall]);

  // Action de publication de message
  const postMessage = useCallback(async (message: string, messageType: string = 'text'): Promise<boolean> => {
    try {
      await apiCall('/discussions', {
        method: 'POST',
        body: JSON.stringify({ message, message_type: messageType }),
      });
      
      // Rafraîchir les discussions après publication
      await refreshDiscussionsData();
      return true;
    } catch (err) {
      console.error('Erreur post message:', err);
      return false;
    }
  }, [cohortId, supabase, isAuthenticated, refreshDiscussionsData, apiCall]);

  // Référence pour éviter les rechargements inutiles
  const hasInitializedRef = useRef(false);
  const lastCohortIdRef = useRef<string | null>(null);

  // Chargement initial des données de base avec gestion d'erreur améliorée
  useEffect(() => {
    if (cohortId && user && supabase) {
      // Éviter les rechargements si les données sont déjà chargées pour ce cohortId
      if (hasInitializedRef.current && lastCohortIdRef.current === cohortId && cohortData) {
        return;
      }

      refreshCohortData().then(() => {
        hasInitializedRef.current = true;
        lastCohortIdRef.current = cohortId;
      });
    } else {
      console.log('[useCohortAPI] Skipping initial load - missing requirements:', {
        cohortId: !!cohortId,
        user: !!user,
        supabase: !!supabase
      });
    }
  }, [cohortId, user, supabase, isAuthenticated, refreshCohortData, cohortData]);

  return {
    // Données
    cohortData,
    contentData,
    sessionsData,
    resourcesData,
    participantsData,
    discussionsData,
    announcementsData,
    
    // États de chargement
    isLoading,
    isLoadingContent,
    isLoadingSessions,
    isLoadingResources,
    isLoadingParticipants,
    isLoadingDiscussions,
    isLoadingAnnouncements,
    
    // Erreurs
    error,
    
    // Actions
    refreshCohortData,
    refreshContentData,
    refreshSessionsData,
    refreshResourcesData,
    refreshParticipantsData,
    refreshDiscussionsData,
    refreshAnnouncementsData,
    postMessage,
  };
}