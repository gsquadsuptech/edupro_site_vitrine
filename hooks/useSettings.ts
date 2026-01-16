import { create } from 'zustand';
import { toast } from 'sonner';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { PlatformSettings, BillingSettings, SecuritySettings, EmailSettings } from '@/types/settings';

interface SettingsState {
  platformSettings: PlatformSettings | null;
  billingSettings: BillingSettings | null;
  securitySettings: SecuritySettings | null;
  emailSettings: EmailSettings | null;
  isLoading: boolean;
  error: string | null;
  fetchPlatformSettings: (supabaseClient: SupabaseClient) => Promise<void>;
  updatePlatformSettings: (supabaseClient: SupabaseClient, settings: Partial<PlatformSettings>) => Promise<void>;
  fetchBillingSettings: (supabaseClient: SupabaseClient) => Promise<void>;
  updateBillingSettings: (supabaseClient: SupabaseClient, settings: Partial<BillingSettings>) => Promise<void>;
  fetchSecuritySettings: (supabaseClient: SupabaseClient) => Promise<void>;
  updateSecuritySettings: (supabaseClient: SupabaseClient, settings: Partial<SecuritySettings>) => Promise<void>;
  fetchEmailSettings: (supabaseClient: SupabaseClient) => Promise<void>;
  updateEmailSettings: (supabaseClient: SupabaseClient, settings: Partial<EmailSettings>) => Promise<void>;
  uploadLogo: (supabaseClient: SupabaseClient, file: File) => Promise<string>;
  uploadFavicon: (supabaseClient: SupabaseClient, file: File) => Promise<string>;
}

export const useSettings = create<SettingsState>((set, get) => ({
  platformSettings: null,
  billingSettings: null,
  securitySettings: null,
  emailSettings: null,
  isLoading: false,
  error: null,

  fetchPlatformSettings: async (supabaseClient: SupabaseClient) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabaseClient
        .from('platform_settings')
        .select('*')
        .single();

      if (error) throw error;
      set({ platformSettings: data });
    } catch (error) {
      set({ error: (error as Error).message });
      toast.error('Erreur lors du chargement des paramètres de la plateforme');
    } finally {
      set({ isLoading: false });
    }
  },

  updatePlatformSettings: async (supabaseClient: SupabaseClient, settings: Partial<PlatformSettings>) => {
    set({ isLoading: true, error: null });
    try {
      const { data: existingSettings } = await supabaseClient
        .from('platform_settings')
        .select('*')
        .single();

      if (existingSettings) {
        const { error } = await supabaseClient
          .from('platform_settings')
          .update({
            ...settings,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSettings.id);

        if (error) throw error;
      } else {
        const { error } = await supabaseClient
          .from('platform_settings')
          .insert([{
            ...settings,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (error) throw error;
      }

      await get().fetchPlatformSettings(supabaseClient);
      toast.success('Paramètres de la plateforme mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres:', error);
      set({ error: (error as Error).message });
      toast.error('Erreur lors de la mise à jour des paramètres de la plateforme');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchBillingSettings: async (supabaseClient: SupabaseClient) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabaseClient
        .from('billing_settings')
        .select('*')
        .single();

      if (error) throw error;
      set({ billingSettings: data });
    } catch (error) {
      set({ error: (error as Error).message });
      toast.error('Erreur lors du chargement des paramètres de facturation');
    } finally {
      set({ isLoading: false });
    }
  },

  updateBillingSettings: async (supabaseClient: SupabaseClient, settings: Partial<BillingSettings>) => {
    set({ isLoading: true, error: null });
    try {
      const { data: existingSettings } = await supabaseClient
        .from('billing_settings')
        .select('*')
        .single();

      if (existingSettings) {
        const { error } = await supabaseClient
          .from('billing_settings')
          .update(settings)
          .eq('id', existingSettings.id);

        if (error) throw error;
      } else {
        const { error } = await supabaseClient
          .from('billing_settings')
          .insert([settings]);

        if (error) throw error;
      }

      await get().fetchBillingSettings(supabaseClient);
      toast.success('Paramètres de facturation mis à jour avec succès');
    } catch (error) {
      set({ error: (error as Error).message });
      toast.error('Erreur lors de la mise à jour des paramètres de facturation');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSecuritySettings: async (supabaseClient: SupabaseClient) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabaseClient
        .from('security_settings')
        .select('*')
        .single();

      if (error) throw error;
      set({ securitySettings: data });
    } catch (error) {
      set({ error: (error as Error).message });
      toast.error('Erreur lors du chargement des paramètres de sécurité');
    } finally {
      set({ isLoading: false });
    }
  },

  updateSecuritySettings: async (supabaseClient: SupabaseClient, settings: Partial<SecuritySettings>) => {
    set({ isLoading: true, error: null });
    try {
      const { data: existingSettings } = await supabaseClient
        .from('security_settings')
        .select('*')
        .single();

      if (existingSettings) {
        const { error } = await supabaseClient
          .from('security_settings')
          .update(settings)
          .eq('id', existingSettings.id);

        if (error) throw error;
      } else {
        const { error } = await supabaseClient
          .from('security_settings')
          .insert([settings]);

        if (error) throw error;
      }

      await get().fetchSecuritySettings(supabaseClient);
      toast.success('Paramètres de sécurité mis à jour avec succès');
    } catch (error) {
      set({ error: (error as Error).message });
      toast.error('Erreur lors de la mise à jour des paramètres de sécurité');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchEmailSettings: async (supabaseClient: SupabaseClient) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabaseClient
        .from('email_settings')
        .select('*')
        .single();

      if (error) throw error;
      set({ emailSettings: data });
    } catch (error) {
      set({ error: (error as Error).message });
      toast.error("Erreur lors du chargement des paramètres d'emails");
    } finally {
      set({ isLoading: false });
    }
  },

  updateEmailSettings: async (supabaseClient: SupabaseClient, settings: Partial<EmailSettings>) => {
    set({ isLoading: true, error: null });
    try {
      const { data: existingSettings } = await supabaseClient
        .from('email_settings')
        .select('*')
        .single();

      if (existingSettings) {
        const { error } = await supabaseClient
          .from('email_settings')
          .update(settings)
          .eq('id', existingSettings.id);

        if (error) throw error;
      } else {
        const { error } = await supabaseClient
          .from('email_settings')
          .insert([settings]);

        if (error) throw error;
      }

      await get().fetchEmailSettings(supabaseClient);
      toast.success("Paramètres d'emails mis à jour avec succès");
    } catch (error) {
      set({ error: (error as Error).message });
      toast.error("Erreur lors de la mise à jour des paramètres d'emails");
    } finally {
      set({ isLoading: false });
    }
  },

  uploadLogo: async (supabaseClient: SupabaseClient, file: File): Promise<string> => {
    set({ isLoading: true, error: null });
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `public/logos/${fileName}`;

      const { error: uploadError, data: uploadData } = await supabaseClient.storage
        .from('organization-assets') 
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }
      
      // Récupérer l'URL publique
      const { data: publicUrlData } = supabaseClient.storage
        .from('organization-assets')
        .getPublicUrl(filePath);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error("Impossible de récupérer l'URL publique du logo après l'upload.");
      }
      
      toast.success('Logo téléversé avec succès');
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Erreur lors du téléversement du logo:', error);
      set({ error: (error as Error).message });
      toast.error('Erreur lors du téléversement du logo');
      throw error; 
    } finally {
      set({ isLoading: false });
    }
  },

  uploadFavicon: async (supabaseClient: SupabaseClient, file: File): Promise<string> => {
    set({ isLoading: true, error: null });
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `public/favicons/${fileName}`;

      const { error: uploadError, data: uploadData } = await supabaseClient.storage
        .from('organization-assets') 
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabaseClient.storage
        .from('organization-assets')
        .getPublicUrl(filePath);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error("Impossible de récupérer l'URL publique du favicon après l'upload.");
      }

      toast.success('Favicon téléversé avec succès');
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Erreur lors du téléversement du favicon:', error);
      set({ error: (error as Error).message });
      toast.error('Erreur lors du téléversement du favicon');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
})); 