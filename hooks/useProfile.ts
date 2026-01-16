import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';

interface ProfileData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  avatarUrl: string | null;
  preferences: {
    language: string;
    timezone: string;
    emailNotifications: {
      newCourses: boolean;
      courseReminders: boolean;
      instructorMessages: boolean;
      promotions: boolean;
    };
    pushNotifications: {
      browserEnabled: boolean;
    };
    privacySettings: {
      profilePublic: boolean;
      showProgress: boolean;
      anonymousStats: boolean;
    };
    videoQuality: string;
    accessibilitySettings: {
      highContrast: boolean;
      largeText: boolean;
      reducedMotion: boolean;
    };
  } | null;
  createdAt: string;
  updatedAt: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Construit les en-têtes avec Authorization Bearer depuis la session courante
  const getAuthHeaders = async (isJson: boolean = true): Promise<Record<string, string>> => {
    const { data: { session } } = await supabase.auth.getSession();
    const headers: Record<string, string> = {};
    if (isJson) headers['Content-Type'] = 'application/json';
    if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
    return headers;
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/student/profile/info', {
        headers: await getAuthHeaders(true)
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setProfile(data.profile);
      } else {
        throw new Error(data.error || 'Erreur lors du chargement du profil');
      }
    } catch (err) {
      console.error('[useProfile] Erreur lors du chargement du profil:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<ProfileData>, skipRefetch = false) => {
    try {
      const response = await fetch('/api/v1/student/profile/info', {
        method: 'PUT',
        headers: await getAuthHeaders(true),
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Optionnellement recharger le profil (éviter lors des mises à jour optimistes)
        if (!skipRefetch) {
          await fetchProfile();
        }
        return { success: true, message: data.message };
      } else {
        throw new Error(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error('[useProfile] Erreur lors de la mise à jour:', err);
      throw err;
    }
  };

  const updatePreferences = async (preferences: any, skipRefetch = false) => {
    try {
      const response = await fetch('/api/v1/student/settings/preferences', {
        method: 'PUT',
        headers: await getAuthHeaders(true),
        body: JSON.stringify(preferences)
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Mettre à jour immédiatement le profil local avec les préférences retournées
        // pour éviter les problèmes de cache
        if (profile && data.preferences) {
          setProfile({
            ...profile,
            preferences: {
              ...profile.preferences,
              ...data.preferences
            }
          });
        }
        
        // Optionnellement recharger le profil (éviter lors des mises à jour optimistes)
        if (!skipRefetch) {
          await fetchProfile();
        }
        return { success: true, message: data.message };
      } else {
        throw new Error(data.error || 'Erreur lors de la mise à jour des préférences');
      }
    } catch (err) {
      console.error('[useProfile] Erreur lors de la mise à jour des préférences:', err);
      throw err;
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/v1/student/profile/avatar', {
        method: 'POST',
        headers: await getAuthHeaders(false),
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Recharger le profil pour obtenir la nouvelle URL d'avatar
        await fetchProfile();
        return { success: true, avatarUrl: data.avatarUrl, message: data.message };
      } else {
        throw new Error(data.error || 'Erreur lors de l\'upload de l\'avatar');
      }
    } catch (err) {
      console.error('Erreur lors de l\'upload de l\'avatar:', err);
      throw err;
    }
  };

  const deleteAvatar = async () => {
    try {
      const response = await fetch('/api/v1/student/profile/avatar', {
        method: 'DELETE',
        headers: await getAuthHeaders(false)
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Recharger le profil pour refléter la suppression
        await fetchProfile();
        return { success: true, message: data.message };
      } else {
        throw new Error(data.error || 'Erreur lors de la suppression de l\'avatar');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'avatar:', err);
      throw err;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    try {
      const response = await fetch('/api/v1/student/settings/account/password', {
        method: 'PUT',
        headers: await getAuthHeaders(true),
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Erreur ${response.status}: ${response.statusText}`);
      }

      if (data.success) {
        return { success: true, message: data.message };
      } else {
        throw new Error(data.error || 'Erreur lors du changement de mot de passe');
      }
    } catch (err) {
      console.error('Erreur lors du changement de mot de passe:', err);
      throw err;
    }
  };

  const getLoginHistory = async () => {
    try {
      const response = await fetch('/api/v1/student/settings/login-history', {
        headers: await getAuthHeaders(true)
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return data.loginHistory;
      } else {
        throw new Error(data.error || 'Erreur lors de la récupération de l\'historique');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'historique:', err);
      throw err;
    }
  };

  const exportUserData = async () => {
    try {
      const response = await fetch('/api/v1/student/settings/data-export', {
        method: 'POST',
        headers: await getAuthHeaders(false)
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      // Créer un blob et télécharger le fichier
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `edupro_data_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return { success: true, message: 'Export terminé avec succès' };
    } catch (err) {
      console.error('Erreur lors de l\'export des données:', err);
      throw err;
    }
  };

  const requestAccountDeletion = async (reason?: string) => {
    try {
      const response = await fetch('/api/v1/student/settings/account-deletion', {
        method: 'POST',
        headers: await getAuthHeaders(true),
        body: JSON.stringify({ reason })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Erreur ${response.status}: ${response.statusText}`);
      }

      if (data.success) {
        return { success: true, message: data.message };
      } else {
        throw new Error(data.error || 'Erreur lors de la demande de suppression');
      }
    } catch (err) {
      console.error('Erreur lors de la demande de suppression:', err);
      throw err;
    }
  };

  const getDeletionRequest = async () => {
    try {
      const response = await fetch('/api/v1/student/settings/account-deletion', {
        headers: await getAuthHeaders(true)
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return data;
      } else {
        throw new Error(data.error || 'Erreur lors de la vérification de la demande');
      }
    } catch (err) {
      console.error('Erreur lors de la vérification de la demande:', err);
      throw err;
    }
  };

  const logoutSession = async (sessionId: string) => {
    try {
      const response = await fetch('/api/v1/student/settings/logout-session', {
        method: 'POST',
        headers: await getAuthHeaders(true),
        body: JSON.stringify({ sessionId })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Erreur ${response.status}: ${response.statusText}`);
      }

      if (data.success) {
        return { success: true, message: data.message };
      } else {
        throw new Error(data.error || 'Erreur lors de la déconnexion');
      }
    } catch (err) {
      console.error('Erreur lors de la déconnexion de la session:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    setProfile,
    fetchProfile,
    updateProfile,
    updatePreferences,
    uploadAvatar,
    deleteAvatar,
    changePassword,
    getLoginHistory,
    exportUserData,
    requestAccountDeletion,
    getDeletionRequest,
    logoutSession
  };
};