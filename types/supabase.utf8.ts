// Types Supabase “fallback” (non générés) pour permettre un typage sûr sans `never`.
// Quand les types Supabase générés ne sont pas disponibles, on expose au minimum la
// structure attendue par `@supabase/supabase-js` / `@supabase/ssr`.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

type GenericTable = {
  Row: Record<string, any>;
  Insert: Record<string, any>;
  Update: Record<string, any>;
  Relationships?: any[];
};

export interface Database {
  public: {
    Tables: Record<string, GenericTable>;
    Views: Record<string, any>;
    Functions: Record<string, any>;
    Enums: Record<string, any>;
    CompositeTypes?: Record<string, any>;
  };
}
