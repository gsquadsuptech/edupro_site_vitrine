export interface Cohort {
  id: string;
  name: string;
}

export interface Student {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  status: 'active' | 'invited' | 'inactive' | 'late' | 'pending' | 'approved' | 'enrolled' | 'completed' | 'dropped';
  created_at: string;
  updated_at: string;
  cohorts?: Cohort[];
  payment_status?: string;
  completion_rate?: number;
} 