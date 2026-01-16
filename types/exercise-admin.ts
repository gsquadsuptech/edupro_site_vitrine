export interface Exercise {
  id: string;
  organization_id: string;
  title: string;
  description?: string;
  instructions?: string;
  points: number;
  estimated_duration?: number; // en minutes
  deadline_type: 'none' | 'fixed' | 'relative';
  fixed_deadline?: string;
  relative_deadline_days?: number;
  submission_type: 'files' | 'links' | 'mixed';
  max_attempts: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  resources: { url: string; label?: string }[];
  evaluation_criteria: { description: string; points: number }[];
  status: 'draft' | 'published' | 'archived';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateExerciseData {
  title: string;
  description?: string;
  instructions?: string;
  points: number;
  estimated_duration?: number;
  deadline_type: 'none' | 'fixed' | 'relative';
  fixed_deadline?: string;
  relative_deadline_days?: number;
  submission_type: 'files' | 'links' | 'mixed';
  max_attempts: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  resources: { url: string; label?: string }[];
  evaluation_criteria: { description: string; points: number }[];
}

export interface ExerciseStats {
  exercise_id: string;
  total_lessons: number;
  total_submissions: number;
  average_score?: number;
  usage_by_course: {
    course_id: string;
    course_title: string;
    lessons_count: number;
    submissions_count: number;
  }[];
}