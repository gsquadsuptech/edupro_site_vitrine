export interface ExerciseSubmission {
  id: string;
  lesson_id: string;
  student_id: string;
  course_id: string | null;
  cohort_id: string | null;
  submitted_at: string;
  files: SubmissionFile[];
  links: SubmissionLink[];
  comments?: string;
  status: 'submitted' | 'graded' | 'revision_requested';
  score?: number;
  max_score: number;
  feedback?: string;
  graded_at?: string;
  graded_by?: string;
  respects_deadline: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubmissionFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploaded_at: string;
}

export interface SubmissionLink {
  id: string;
  url: string;
  title?: string;
  description?: string;
}

export interface ExerciseStats {
  lesson_id: string;
  exercise_title: string;
  section_title: string;
  total_students: number;
  submitted_count: number;
  graded_count: number;
  pending_count: number;
  average_score?: number;
  open_at?: string;
  close_at?: string;
  deadline?: string; // alias pour close_at (compat)
  is_deadline_passed: boolean;
}

export interface CreateSubmissionRequest {
  lesson_id: string;
  files: File[];
  links: SubmissionLink[];
  comments?: string;
}

export interface GradeSubmissionRequest {
  score: number;
  feedback?: string;
  status: 'graded' | 'revision_requested';
}