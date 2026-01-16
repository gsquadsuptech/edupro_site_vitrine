import { Course } from './course';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  course_count?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  usage_count?: number;
}

export interface Instructor {
  id: string;
  name: string;
  slug: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  location?: string;
  rating?: number;
  student_count?: number;
  course_count?: number;
  expertise?: string[];
  languages?: string[];
  joined_at: string;
  certifications?: Certification[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  expires_at?: string;
  credential_url?: string;
}

export interface CourseReview {
  id: string;
  course_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at?: string;
  helpful_count?: number;
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  title: string;
  description?: string;
  duration: number; // in minutes
  order: number;
  is_preview: boolean;
  type?: string; // Type de leçon : video, audio, article, document, quiz, etc.
}

export interface MarketplaceCourse extends Course {
  rating?: number;
  review_count?: number;
  student_count?: number;
  language: string;
  // URL d'image dédiée pour la marketplace (souvent mappée depuis thumbnail)
  image_url?: string;
  instructor: Instructor;
  modules?: CourseModule[];
  reviews?: CourseReview[];
  last_updated?: string;
  requirements?: string[];
  objectives?: string[];
  category?: Category;
  preview_video?: string;
  format?: 'auto-formation' | 'session';
  access_duration?: number;
  expected_results?: string[];
  tags?: Tag[];
  // Propriétés de tarification
  pricing_modes?: {
    one_time?: boolean;
    installments?: boolean;
    subscription?: boolean;
    registration_monthly?: boolean;
  };
  installments?: Array<{ amount: string | number; due_date?: string }>;
  monthly_price?: number;
  registration_fee?: number;
  monthly_fee?: number;
  one_time_discount?: number;
  one_time_price?: number;
  // Mode de publication sur la marketplace
  publication_mode?: 'prepublication' | 'official';
}

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseLanguage = 'fr' | 'en' | 'es' | 'de' | 'other';
export type CourseSortOptions = 'popular' | 'recent' | 'price_asc' | 'price_desc' | 'rating';

export interface CourseFilters {
  category?: string;
  language?: CourseLanguage[];
  priceRange?: [number, number];
  minRating?: number;
  level?: CourseLevel[];
  searchQuery?: string;
} 