export type QuizType = 'quiz' | 'exam' | 'assessment_ungraded';

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'long_answer' | 'matching';

export interface QuizOption {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: number;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'long_answer' | 'matching';
  text: string;
  options?: QuizOption[];
  points: number;
  correctAnswer?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  course_id?: string;
  quiz_questions?: Array<{ count: number }>;
  passing_score?: number;
  shuffle_questions?: boolean;
  shuffle_options?: boolean;
  show_results?: boolean;
  allow_retries?: boolean;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  type: QuizType;
  duration?: number;
  estimated_duration?: number;
  organization_id: string;
  created_by: string;
  courses?: { title: string } | null;
  evaluation_tag?: 'pre_training' | 'post_training';
}

export interface CreateQuizInput {
  title: string;
  description: string;
  type: QuizType;
  courseId?: string;
  duration: number;
  questions: Omit<QuizQuestion, 'id'>[];
  evaluation_tag?: 'pre_training' | 'post_training';
} 