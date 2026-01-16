import { useCallback, useEffect, useState } from 'react';
// import { supabase } from '@/lib/supabase'; // Supprimé
import { useAuth } from './useAuth';

export interface Organization {
  id: string;
  name: string;
  subdomain?: string;
  slug: string;
  logo_url?: string;
  sector?: string;
  status?: string;
  billing_email?: string;
  max_users?: number;
  subscription_start_date?: string;
  subscription_end_date?: string;
  billing_cycle?: string;
  automatic_renewal?: boolean;
  storage_used_bytes?: number;
  mrr?: number;
  plan_id?: string;
  created_at: string;
  updated_at: string;

  legal_name?: string;
  description?: string;
  founded_year?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  contact_email?: string;
  phone?: string;
  website_url?: string;
  registration_number?: string;
  tax_id?: string;
  social_facebook_url?: string;
  social_twitter_url?: string;
  social_linkedin_url?: string;
  social_instagram_url?: string;
}

export function useOrganization() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated, supabase } = useAuth();

  const fetchOrganization = useCallback(async () => {
    try {
      setLoading(true);
      console.log("[Organization] Récupération de l'organisation...");
      
      if (!isAuthenticated || !user || !supabase) {
        console.log("[Organization] Aucun utilisateur connecté ou client Supabase non disponible");
        setOrganization(null);
        return;
      }

      console.log("[Organization] Utilisateur connecté:", user.id, user.email);

      // Récupérer d'abord le profil de l'utilisateur pour obtenir l'organization_id
      console.log("[Organization] Récupération du profil de l'utilisateur...");
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, organization_id, email')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error("[Organization] Erreur lors de la récupération du profil:", profileError);
        throw profileError;
      }

      console.log("[Organization] Profil trouvé:", profileData);

      if (!profileData) {
        console.error("[Organization] Aucun profil trouvé pour l'utilisateur");
        setOrganization(null);
        return;
      }

      if (!profileData.organization_id) {
        console.error("[Organization] L'utilisateur n'a pas d'organisation associée");
        setOrganization(null);
        return;
      }

      // Récupérer l'organisation à partir de l'organization_id
      console.log("[Organization] Récupération de l'organisation avec l'ID:", profileData.organization_id);
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', profileData.organization_id)
        .single();

      if (error) {
        console.error("[Organization] Erreur lors de la récupération de l'organisation:", error);
        throw error;
      }

      console.log("[Organization] Organisation trouvée:", data);
      setOrganization(data);
    } catch (err) {
      console.error("[Organization] Erreur dans useOrganization:", err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setOrganization(null);
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated, supabase]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchOrganization();
    } else {
      setOrganization(null);
      setLoading(false);
    }
  }, [fetchOrganization, isAuthenticated, user]);

  return {
    organization,
    loading,
    error,
    refreshOrganization: fetchOrganization,
  };
} 