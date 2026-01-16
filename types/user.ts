export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role?: 'admin' | 'instructor' | 'student';
  created_at: string;
  updated_at?: string;
  last_login?: string;
  bio?: string;
  social_media?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    website?: string;
  };
} 