export interface CourseValidationComment {
  id: string;
  course_id: string;
  user_id: string;
  comment_text: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    full_name: string;
    avatar_url: string;
  } | null;
}

export interface Course {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  thumbnail?: string;
  preview_video?: string;
  category_id?: string;
  level?: string;
  language?: string;
  duration?: number;
  format?: string;
  status: string;
  access_type?: string;
  one_time_price?: number;
  organization_id?: string;
  instructor_id?: string;
  created_at: string;
  updated_at: string;
  objectives?: string[];
  prerequisites?: string[];
  expected_results?: string[];
  enable_certificate?: boolean;
  enable_community?: boolean;
  sections: {
    id: string;
    title: string;
    position: number;
    lessons: {
      id: string;
      title: string;
      type?: string;
      duration?: number;
      position: number;
      is_preview?: boolean;
      content?: string;
    }[];
  }[];
  category?: {
    name: string;
    id: string;
  };
  instructor?: {
    id: string;
    name: string;
    bio?: string;
    avatar_url?: string;
  };
  organization?: {
    id: string;
    name: string;
    logo_url?: string;
  };
}

export interface VideoContent {
  url: string;
  duration?: number; // en secondes
}

export interface ArticleContent {
  text: string;
}

export interface DocumentContent {
  url: string;
  file_name: string;
  file_type?: string;
  size?: number; // en octets
  duration?: number; // en minutes
}

export interface AudioContent {
  url: string;
  duration?: number; // en secondes
  file_name?: string; // Ajouté pour gérer les fichiers audio locaux
  size?: number; // Ajouté pour gérer les fichiers audio locaux
}

export interface QuizContent {
  quiz_id: string;
  duration?: number; // en minutes
}

export interface ExerciseResource {
  url: string;
  label?: string;
}

export interface EvaluationCriterion {
  description: string;
  points: number;
}

export interface ExerciseContent {
  exercise_id: string;
  // Champs optionnels utilisés côté UI
  points?: number;
  estimated_duration?: number; // minutes
  deadline?: string; // ISO
  open_at?: string; // ISO
  max_attempts?: number;
  submission_type?: 'files' | 'links' | 'mixed';
  instructions?: string;
  resources?: ExerciseResource[];
  evaluation_criteria?: EvaluationCriterion[];
}

export type LessonContentData =
  | VideoContent
  | ArticleContent
  | DocumentContent
  | AudioContent
  | QuizContent
  | ExerciseContent;

export interface Lesson {
  id: string;
  section_id: string;
  title: string;
  description?: string;
  type: 'video' | 'article' | 'document' | 'audio' | 'quiz' | 'exercise';
  duration?: number;
  position: number;
  is_preview: boolean;
  content: LessonContentData | null; // Les données spécifiques au type de leçon
  created_at: string;
  updated_at: string;
}

export interface Section {
  id: string;
  course_id: string;
  title: string;
  position: number;
  created_at: string;
  updated_at: string;
  lessons: Lesson[]; // Liste des leçons de cette section
} 