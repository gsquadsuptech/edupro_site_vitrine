import { useState, useEffect, useCallback } from 'react';
import { useOrganization } from './useOrganization';
import { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { useAuth } from './useAuth';

export interface BrandingSettings {
  id: string;
  organization_id: string;
  colors: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    background: string;
    foreground: string;
    headerBackground: string;
    headerForeground: string;
    footerBackground: string;
    footerForeground: string;
  };
  logo_url: string | null;
  favicon_url: string | null;
  enable_custom_css: boolean;
  custom_css: string | null;
  font_family: string;
  border_radius: string;
  created_at: string;
  updated_at: string;
}

type BrandingError = Error | PostgrestError | string | null;

export const useBrandingSettings = () => {
  const [settings, setSettings] = useState<BrandingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<BrandingError>(null);
  const { organization, loading: orgLoading, error: orgError } = useOrganization();
  const { supabase } = useAuth();

  const fetchSettings = useCallback(async (supabaseClient: SupabaseClient) => {
    if (orgLoading) {
      console.log("[Branding] Chargement de l'organisation en cours...");
      setLoading(true);
      return;
    }

    if (orgError) {
      console.error("[Branding] Erreur lors du chargement de l'organisation:", orgError);
      setError(orgError as BrandingError);
      setSettings(null);
      setLoading(false);
      return;
    }

    if (!organization?.id) {
      const errorMessage = "Aucune organisation trouvée pour récupérer les paramètres de branding";
      console.log("[Branding]", errorMessage);
      setSettings(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("[Branding] Récupération des paramètres de marque pour l'organisation:", organization.id);
      
      const { data, error: fetchError } = await supabaseClient
        .from('organization_branding_settings')
        .select('*')
        .eq('organization_id', organization.id)
        .single();

      if (fetchError) {
        console.error("[Branding] Erreur lors de la récupération des paramètres:", fetchError);
        setError(fetchError as BrandingError);
        setSettings(null);
      } else {
        console.log("[Branding] Paramètres de marque trouvés:", data);
        setSettings(data as BrandingSettings | null);
        setError(null);
      }
    } catch (err) {
      console.error("[Branding] Erreur dans useBrandingSettings fetch:", err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la récupération');
      setSettings(null);
    } finally {
      setLoading(false);
    }
  }, [organization?.id, orgLoading, orgError]);

  useEffect(() => {
    if (supabase) {
      fetchSettings(supabase);
    }
  }, [supabase, fetchSettings]);

  const updateSettings = async (newSettings: Partial<BrandingSettings>) => {
    if (!supabase) {
      const errorMessage = "Client Supabase non disponible";
      console.error("[Branding]", errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
    if (!organization?.id) {
      const errorMessage = "Aucune organisation trouvée";
      console.error("[Branding]", errorMessage);
      throw new Error(errorMessage);
    }

    try {
      setLoading(true);
      console.log("[Branding] Mise à jour des paramètres de marque pour l'organisation:", organization.id);
      
      const { data, error: updateError } = await supabase
        .from('organization_branding_settings')
        .upsert({
          organization_id: organization.id,
          ...newSettings,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (updateError) {
        console.error("[Branding] Erreur lors de la mise à jour des paramètres:", updateError);
        setError(updateError as BrandingError);
        throw updateError;
      }

      console.log("[Branding] Paramètres de marque mis à jour:", data);
      setSettings(data as BrandingSettings | null);
      setError(null);
      return data as BrandingSettings | null;
    } catch (err) {
      console.error("[Branding] Erreur dans updateSettings:", err);
      const specificError = err instanceof Error ? err.message : 'Une erreur est survenue lors de la mise à jour';
      setError(specificError);
      throw new Error(specificError);
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
    fetchSettings: useCallback(() => {
      if (supabase) fetchSettings(supabase);
    }, [supabase, fetchSettings]),
  };
}; 