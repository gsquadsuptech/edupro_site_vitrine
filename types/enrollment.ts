export type EnrollmentStatus = 'active' | 'inactive' | 'completed' | 'suspended'

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  cohort_id?: string
  payment_id?: string
  status: EnrollmentStatus
  progress: number
  enrolled_at: string
  completed_at?: string
  suspended_at?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface CohortParticipant {
  id: string
  cohort_id: string
  user_id: string
  status: 'active' | 'inactive' | 'completed' | 'dropped'
  joined_at: string
  attended_sessions: string[] // JSON array of session IDs
  completion_rate?: number
  created_at: string
  updated_at: string
}