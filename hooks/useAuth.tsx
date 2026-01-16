"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { type User } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase/client';
import { canAccessRoute, getDefaultRouteForUser } from '@/lib/role-guard';

// Token storage keys
const AUTH_BYPASS_KEY = 'auth-bypass';

type AppSupabaseClient = typeof supabase;

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; user?: User | null; error?: any }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  refreshSession: () => Promise<void>;
  enableDevBypass: () => void;
  disableDevBypass: () => void;
  bypassEnabled: boolean;
  supabase: AppSupabaseClient;
  resendConfirmation: (email: string) => Promise<void>;
  // Multi-rôles
  roles?: string[];
  currentRole?: string | null;
  setCurrentRole?: (role: string | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Constante pour l'intervalle de rafraîchissement du token (15 minutes)
const TOKEN_REFRESH_INTERVAL = 15 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [bypassEnabled, setBypassEnabled] = useState<boolean>(false);
  // Multi-rôles
  const [roles, setRoles] = useState<string[]>([]);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Référence pour gérer l'intervalle de rafraîchissement du token
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // Référence pour accéder à l'utilisateur courant dans les callbacks
  const userRef = useRef<User | null>(null);
  useEffect(() => { userRef.current = user; }, [user]);

  // Utiliser le client Supabase centralisé
  const supabaseInstance = useMemo(() => supabase, []);

  // Fonction pour activer le mode bypass
  const enableDevBypass = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
      localStorage.setItem(AUTH_BYPASS_KEY, 'true');
      setBypassEnabled(true);
      console.log("[Auth] Mode bypass activé (Développement uniquement)");
      toast({
        title: "Mode développement activé",
        description: "Contournement d'authentification activé pour le développement",
      });
    } else {
      console.warn("[Auth] Impossible d'activer le bypass en production");
    }
  }, [toast]);

  // Fonction pour désactiver le mode bypass
  const disableDevBypass = useCallback(() => {
    localStorage.removeItem(AUTH_BYPASS_KEY);
    setBypassEnabled(false);
    console.log("[Auth] Mode bypass désactivé");
    toast({
      title: "Mode développement désactivé",
      description: "Contournement d'authentification désactivé",
    });
  }, [toast]);

  // Fonction pour récupérer et vérifier la session courante
  const refreshSession = useCallback(async () => {
    try {
      console.log("[Auth] Récupération de la session courante...");

      const { data, error: sessionError } = await supabaseInstance.auth.getSession();

      if (sessionError) {
        console.error("[Auth] Erreur lors de la récupération de la session:", sessionError);
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      if (data.session) {
        console.log("[Auth] Session trouvée:", data.session.user.email);
        setUser(data.session.user);
        setIsAuthenticated(true);
      } else {
        console.log("[Auth] Aucune session trouvée");

        if (process.env.NODE_ENV === 'development' && localStorage.getItem(AUTH_BYPASS_KEY) === 'true') {
          console.log("[Auth] Mode bypass actif");
          setBypassEnabled(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    } catch (err) {
      console.error("[Auth] Erreur lors du rafraîchissement de la session:", err);
      setError("Erreur lors du rafraîchissement de la session");
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [supabaseInstance.auth]);

  // Fonction pour configurer l'intervalle de rafraîchissement du token
  const setupTokenRefresh = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    refreshIntervalRef.current = setInterval(async () => {
      if (isAuthenticated) {
        console.log("[Auth] Rafraîchissement automatique du token...");
        try {
          const { error: refreshError } = await supabaseInstance.auth.refreshSession();

          if (refreshError) {
            console.error("[Auth] Erreur lors du rafraîchissement du token:", refreshError);
          } else {
            console.log("[Auth] Tentative de rafraîchissement du token effectuée.");
          }
        } catch (err) {
          console.error("[Auth] Erreur lors du rafraîchissement automatique:", err);
        }
      }
    }, TOKEN_REFRESH_INTERVAL);
  }, [isAuthenticated, supabaseInstance.auth]);

  useEffect(() => {
    const fetchUser = async () => {
      const bypass = localStorage.getItem(AUTH_BYPASS_KEY) === 'true';
      if (bypass && process.env.NODE_ENV === 'development') {
        setBypassEnabled(true);
        console.log("[Auth] Mode bypass détecté au démarrage");
      }

      await refreshSession();

      // Charger les rôles étendus via /api/auth/me uniquement si une session existe
      // (évite un 401 bruyant sur les pages publiques / marketing)
      try {
        const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
        const isAuthFlow = pathname.startsWith('/auth/');
        if (isAuthFlow) {
          setIsLoading(false);
          return;
        }

        const { data: sessionData } = await supabaseInstance.auth.getSession();
        if (!sessionData?.session) {
          setIsLoading(false);
          return;
        }

        if (!isAuthFlow) {
          const res = await fetch('/api/auth/me');
          if (res.ok) {
            const me = await res.json();
            const fetchedRoles: string[] = Array.isArray(me?.roles) ? me.roles : [];
            setRoles(fetchedRoles);
            // Priorité: superadmin > instructor > admin > student
            const priority = ['superadmin', 'instructor', 'admin', 'student'];
            const preferred = priority.find(r => fetchedRoles.includes(r)) || null;
            setCurrentRole(prev => prev || preferred);
          }
        }
      } catch { }
      setIsLoading(false);
    };

    fetchUser();

    const { data: authListener } = supabaseInstance.auth.onAuthStateChange(
      async (event, session) => {
        console.log("[Auth] Changement d'état d'authentification:", event, session);

        if (session) {
          // Ignorer complètement TOKEN_REFRESHED pour éviter les reloads au retour de focus
          if (event === 'TOKEN_REFRESHED') {
            setIsLoading(false);
            return;
          }
          // Ignorer les événements redondants pour le même utilisateur (évite remounts)
          const isSameUser = userRef.current && session.user && userRef.current.id === session.user.id;
          if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && isSameUser) {
            setIsLoading(false);
            return;
          }
          setUser(session.user);
          setIsAuthenticated(true);
          setupTokenRefresh();

          // Ne faire les redirections qu'au moment du SIGNED_IN
          if (event === 'SIGNED_IN') {
            // Garde: ne pas rediriger depuis les écrans d'activation/réinitialisation
            try {
              const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
              const isActivationOrRecoveryFlow =
                pathname.startsWith('/auth/activate') ||
                pathname.startsWith('/auth/activate-account') ||
                pathname.startsWith('/auth/reset-password') ||
                pathname.startsWith('/auth/update-password') ||
                pathname.startsWith('/auth/confirm-email') ||
                pathname.startsWith('/auth/verify-email') ||
                pathname.startsWith('/auth/instructor-activate');
              if (isActivationOrRecoveryFlow) {
                console.log('[Auth] Redirection post-login ignorée (flow activation/réinitialisation)');
                setIsLoading(false);
                return;
              }
            } catch { }
            try {
              const res = await fetch('/api/auth/me');
              if (res.ok) {
                const me = await res.json();
                // Mettre à jour les rôles lorsqu'on se connecte
                const fetchedRoles: string[] = Array.isArray(me?.roles) ? me.roles : [];
                setRoles(fetchedRoles);
                const priority = ['superadmin', 'instructor', 'admin', 'student'];
                const preferred = priority.find(r => fetchedRoles.includes(r)) || null;
                setCurrentRole(preferred);
                // Utiliser la logique centralisée de role-guard pour éviter les redirections forcées
                const userRoles = Array.isArray(me?.roles) ? me.roles : [];
                const currentPath = location.pathname;

                // Ne rediriger que si l'utilisateur ne peut pas accéder à sa route actuelle
                if (!canAccessRoute(userRoles, currentPath)) {
                  const defaultRoute = getDefaultRouteForUser(userRoles);
                  console.log("[Auth] Redirection nécessaire de", currentPath, "vers", defaultRoute);
                  router.push(defaultRoute);
                } else {
                  console.log("[Auth] L'utilisateur peut rester sur sa route actuelle:", currentPath);
                }
              }
            } catch (e) {
              console.warn('[Auth] Redirection post-login ignorée (profil non dispo)');
            }
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
          if (refreshIntervalRef.current) {
            clearInterval(refreshIntervalRef.current);
            refreshIntervalRef.current = null;
          }
        }
        setIsLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [refreshSession, setupTokenRefresh, supabaseInstance.auth, router]);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: signInError } = await supabaseInstance.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        const { getPublicAuthError, getSanitizedForLog } = await import("@/lib/error-utils");
        console.log("[Auth] Erreur de connexion gérée:", getSanitizedForLog(signInError));
        const safeMessage = getPublicAuthError(signInError);
        setError(safeMessage);
        setIsAuthenticated(false);
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: safeMessage,
        });
        return { success: false, error: signInError };
      }

      if (data.user) {
        setUser(data.user as User);
        setIsAuthenticated(true);
        setupTokenRefresh();

        // Synchroniser le cookie NEXT_LOCALE avec les préférences utilisateur
        try {
          const syncResponse = await fetch('/api/auth/sync-locale', {
            method: 'POST',
            credentials: 'include'
          });

          if (syncResponse.ok) {
            const { language } = await syncResponse.json();
            console.log('[Auth] Cookie de langue synchronisé:', language);

            // Charger les messages pour la nouvelle langue
            const messages = await loadMessagesForLocale(language);

            // Déclencher un événement pour notifier le changement de langue
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { locale: language, messages }
              }));
            }
          }
        } catch (syncError) {
          console.error('[Auth] Erreur lors de la synchronisation du cookie de langue:', syncError);
          // Ne pas bloquer la connexion si la synchro échoue
        }

        toast({
          title: "Connexion réussie",
          description: "Bienvenue !",
        });
        return { success: true, user: data.user as User, session: data.session };
      }
      return { success: false, error: { message: "Aucun utilisateur retourné après la connexion" } };
    } catch (err: any) {
      const { getPublicAuthError, getSanitizedForLog } = await import("@/lib/error-utils");
      console.error("[Auth] Erreur inattendue lors de la connexion:", getSanitizedForLog(err));
      setError(getPublicAuthError(err));
      setIsAuthenticated(false);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: getPublicAuthError(err),
      });
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  }, [supabaseInstance.auth, toast, setupTokenRefresh]);

  const signUp = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("[Auth] Tentative d'inscription avec email:", email);
      const { data, error: signUpError } = await supabaseInstance.auth.signUp({
        email,
        password
      });

      if (signUpError) {
        console.error("[Auth] Erreur d'inscription:", signUpError.message);
        throw signUpError;
      }

      console.log("[Auth] Inscription initiée (attente de confirmation):", data?.user?.id);
      toast({
        title: "Inscription initiée",
        description: data.user?.identities?.length === 0
          ? "Utilisateur déjà existant. Essayez de vous connecter."
          : "Vérifiez votre email pour confirmer votre compte.",
      });
      return { success: true, user: data.user };
    } catch (error: any) {
      console.error("[Auth] Erreur d'inscription catch:", error.message, error);
      setError(error.message || "Erreur d'inscription inconnue");
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue lors de l'inscription.",
      });
      return { success: false, error: error };
    } finally {
      setIsLoading(false);
    }
  }, [supabaseInstance.auth, toast]);

  const signOut = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      console.log("[Auth] Déconnexion en cours...");

      const { error: signOutError } = await supabaseInstance.auth.signOut();

      if (signOutError) {
        console.error("[Auth] Erreur lors de la déconnexion:", signOutError);
        toast({
          title: "Erreur de déconnexion",
          description: signOutError.message,
          variant: "destructive",
        });
        return;
      }
      console.log("[Auth] Déconnexion réussie");

      // Nettoyer les états
      setUser(null);
      setIsAuthenticated(false);
      setBypassEnabled(false);

      // Nettoyer le localStorage
      localStorage.removeItem(AUTH_BYPASS_KEY);

      // Nettoyer les cookies d'organisation utilisés par l'UI
      try {
        document.cookie = 'org_id=; Path=/; Max-Age=0';
        document.cookie = 'org_name=; Path=/; Max-Age=0';
      } catch { }

      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });

      // Rediriger vers la page de connexion
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        } else {
          router.push('/auth/login');
        }
      }, 300);
    } catch (err: any) {
      console.error("[Auth] Erreur lors de la déconnexion catch:", err);
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    }
  }, [supabaseInstance.auth, toast, router]);

  const resendConfirmation = useCallback(async (email: string): Promise<void> => {
    try {
      console.log("[Auth] Renvoi de l'email de confirmation pour:", email);

      const { error } = await supabaseInstance.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        console.error("[Auth] Erreur lors du renvoi de l'email:", error);
        throw error;
      }

      console.log("[Auth] Email de confirmation renvoyé avec succès");
    } catch (err: any) {
      console.error("[Auth] Erreur lors du renvoi de l'email:", err);
      throw err;
    }
  }, [supabaseInstance.auth]);

  const authContextValue = useMemo<AuthContextProps>(
    () => ({
      user,
      isLoading,
      error,
      signIn,
      signUp,
      signOut,
      isAuthenticated,
      refreshSession,
      enableDevBypass,
      disableDevBypass,
      bypassEnabled,
      supabase: supabaseInstance,
      resendConfirmation,
      roles,
      currentRole,
      setCurrentRole,
    }),
    [
      user,
      isLoading,
      error,
      isAuthenticated,
      bypassEnabled,
      signIn,
      signUp,
      signOut,
      refreshSession,
      enableDevBypass,
      disableDevBypass,
      supabaseInstance,
      resendConfirmation,
      roles,
      currentRole,
    ]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}

// Fonction utilitaire pour charger les messages d'une locale
async function loadMessagesForLocale(locale: string) {
  try {
    const namespaces = ['common', 'errors', 'profile', 'admin', 'dashboard', 'courses', 'students'];
    const messages: Record<string, any> = {};

    await Promise.all(
      namespaces.map(async (namespace) => {
        try {
          const msgs = await import(`@/messages/${locale}/${namespace}.json`);
          messages[namespace] = msgs.default;
        } catch (error) {
          console.warn(`[Auth] Could not load namespace "${namespace}" for locale "${locale}"`);
          messages[namespace] = {};
        }
      })
    );

    return messages;
  } catch (error) {
    console.error('[Auth] Error loading messages:', error);
    return {};
  }
} 