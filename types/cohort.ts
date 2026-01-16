import { Course } from './course';
import { User } from './user';

// Statut possible pour une cohorte
export type CohortStatus = 'active' | 'draft' | 'completed' | 'archived';

// Type pour une session planifiée
export interface CohortSession {
  id?: string;
  cohort_id?: string;
  day: string;
  startTime: string;
  endTime: string;
}

// Type pour un lien live
export interface LiveLink {
  id?: string;
  cohort_id?: string;
  url: string;
  description: string;
}

// Type pour un code de réduction
export interface Discount {
  id?: string;
  cohort_id?: string;
  code: string;
  percentage: number;
}

// Type pour un participant à une cohorte
export interface CohortParticipant {
  id: string;
  cohort_id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'enrolled' | 'completed' | 'dropped';
  enrollment_date: string;
  progress: number;
  profile?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
    email: string;
  };
}

// Type pour une cohorte
export interface Cohort {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  status: CohortStatus;
  max_students?: number;
  created_at: string;
  updated_at: string;
  
  // Relations
  courses?: Course[];
  instructors?: User[];
  students_count?: number;
  instructors_count?: number;
  courses_count?: number;
  
  // Ces champs sont chargés séparément
  sessions?: CohortSession[];
  liveLinks?: LiveLink[];
  discounts?: Discount[];
  participants?: CohortParticipant[];
}

// Type pour les filtres de recherche des cohortes
export interface CohortFilters {
  courseId?: string;
  status?: CohortStatus;
  search?: string;
  page?: number;
  limit?: number;
} 