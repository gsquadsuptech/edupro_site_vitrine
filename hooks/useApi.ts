import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

/**
 * Options pour le hook useApi
 */
interface UseApiOptions<T> {
  /** URL de l'API à appeler */
  url: string;
  /** Méthode HTTP (GET par défaut) */
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Corps de la requête pour les méthodes POST, PUT, PATCH */
  body?: any;
  /** Headers additionnels */
  headers?: Record<string, string>;
  /** Si true, le hook ne fera pas d'appel automatiquement au montage (utilisez la fonction fetch retournée) */
  manual?: boolean;
  /** Données mockées à utiliser en cas d'erreur */
  mockData?: T;
  /** Dépendances pour déclencher un nouvel appel (comme pour useEffect) */
  deps?: any[];
  /** Fonction à exécuter avant l'appel API */
  onBeforeRequest?: () => void;
  /** Fonction à exécuter en cas de succès */
  onSuccess?: (data: T) => void;
  /** Fonction à exécuter en cas d'erreur */
  onError?: (error: Error | string) => void;
  /** Timeout en millisecondes (30000ms = 30s par défaut) */
  timeout?: number;
}

/**
 * Résultat du hook useApi
 */
interface UseApiResult<T> {
  /** Données récupérées (null avant la récupération ou en cas d'erreur) */
  data: T | null;
  /** Indique si l'appel API est en cours */
  isLoading: boolean;
  /** Message d'erreur (null s'il n'y a pas d'erreur) */
  error: string | null;
  /** Indique si l'appel a réussi */
  isSuccess: boolean;
  /** Indique si on utilise des données mockées */
  useMockData: boolean;
  /** Fonction pour déclencher l'appel API manuellement (utile avec l'option manual) */
  fetch: (overrideBody?: any) => Promise<T | null>;
  /** Fonction pour déclencher un nouvel appel API */
  refetch: () => Promise<T | null>;
  /** Statut HTTP de la dernière réponse */
  statusCode: number | null;
}

/**
 * Hook pour effectuer des appels API avec une gestion standardisée
 * 
 * @example
 * // Utilisation basique
 * const { data, isLoading, error } = useApi<User[]>({ url: '/api/users' });
 * 
 * @example
 * // Appel manuel avec paramètres
 * const { fetch, data } = useApi<LoginResponse>({ 
 *   url: '/api/auth/login', 
 *   method: 'POST',
 *   manual: true
 * });
 * 
 * const handleLogin = async () => {
 *   await fetch({ email, password });
 * };
 */
export function useApi<T = any>(options: UseApiOptions<T>): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!options.manual);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [useMockData, setUseMockData] = useState<boolean>(false);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  
  const { isAuthenticated, bypassEnabled, supabase } = useAuth();
  
  const fetchData = useCallback(async (overrideBody?: any): Promise<T | null> => {
    if (!supabase && isAuthenticated) {
      console.warn("[useApi] Instance Supabase non disponible alors que l'utilisateur est authentifié.");
      setError("Client Supabase non initialisé.");
      setIsLoading(false);
      return null;
    }

    // Créer un controller pour l'abort
    const controller = new AbortController();
    const timeoutDuration = options.timeout || 60000; // Augmenter à 60 secondes par défaut
    
    // Ne pas démarrer le timeout immédiatement, mais l'initialiser plus tard
    let timeoutId: NodeJS.Timeout | null = null;
    
    // Définir l'URL de la requête (peut être modifiée par overrideBody)
    let requestUrl = options.url;
    
    try {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);
      setUseMockData(false);
      setStatusCode(null);
      
      if (options.onBeforeRequest) {
        options.onBeforeRequest();
      }
      
      // Vérification de la connexion réseau
      if (!navigator.onLine) {
        throw new Error('Vous êtes actuellement hors ligne. Vérifiez votre connexion internet et réessayez.');
      }
      
      // Si l'utilisateur n'est pas authentifié et qu'on n'est pas en mode bypass
      // et qu'on a des données mockées, on les utilise directement
      if (!isAuthenticated && !bypassEnabled && options.mockData) {
        console.log(`[useApi] Utilisation de données mockées pour ${requestUrl}`);
        setData(options.mockData);
        setUseMockData(true);
        setIsSuccess(true);
        
        if (options.onSuccess) {
          options.onSuccess(options.mockData);
        }
        
        return options.mockData;
      }
      
      // Récupérer le token d'authentification si disponible
      let token: string | null = null;
      if (isAuthenticated && supabase) {
        const sessionData = await supabase.auth.getSession();
        token = sessionData.data.session?.access_token || null;
      }
      
      // Préparer la requête
      let requestBody = overrideBody;
      
      // Si overrideBody contient une propriété url, l'utiliser pour remplacer l'URL par défaut
      if (overrideBody && typeof overrideBody === 'object' && 'url' in overrideBody) {
        requestUrl = overrideBody.url;
        // Supprimer la propriété url pour ne pas l'envoyer dans le corps de la requête
        const { url, ...restBody } = overrideBody;
        requestBody = Object.keys(restBody).length > 0 ? restBody : undefined;
      }
      
      const fetchOptions: RequestInit = {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          ...(options.headers || {})
        },
        signal: controller.signal,
      };
      
      // Ajouter le body pour les requêtes autres que GET
      if (fetchOptions.method !== 'GET' && (options.body || requestBody)) {
        fetchOptions.body = JSON.stringify(options.body || requestBody);
      }
      
      console.log(`[useApi] Appel API: ${requestUrl} (${fetchOptions.method})`, 
        fetchOptions.method !== 'GET' ? fetchOptions.body : '');
      
      // Démarrer le timer pour le timeout seulement maintenant
      timeoutId = setTimeout(() => {
        console.warn(`[useApi] Timeout de ${timeoutDuration/1000}s atteint pour ${requestUrl}`);
        controller.abort();
      }, timeoutDuration);
      
      // Effectuer l'appel API
      let response;
      try {
        response = await fetch(requestUrl, fetchOptions);
        setStatusCode(response.status);
      } catch (fetchError) {
        // Nettoyer le timeout avant de traiter l'erreur
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        
        console.error(`[useApi] Erreur fetch initiale:`, fetchError);
        
        // Si l'erreur est due à une annulation et qu'on a des données mockées, utiliser les données mockées
        if (fetchError instanceof Error && fetchError.name === 'AbortError' && options.mockData) {
          console.log(`[useApi] Utilisation de données mockées après timeout pour ${requestUrl}`);
          setData(options.mockData);
          setUseMockData(true);
          setIsSuccess(true);
          
          if (options.onSuccess) {
            options.onSuccess(options.mockData);
          }
          
          return options.mockData;
        }
        
        throw new Error(`Erreur de connexion: ${fetchError instanceof Error ? fetchError.message : 'Impossible de contacter le serveur'}`);
      }
      
      if (!response.ok) {
        // Extraire les détails de l'erreur si disponibles
        let errorDetails = '';
        try {
          const errorData = await response.json();
          errorDetails = errorData.message || errorData.error || JSON.stringify(errorData);
        } catch (e) {
          // Ignorer les erreurs lors de la lecture du corps de l'erreur
          console.warn(`[useApi] Impossible de parser la réponse d'erreur:`, e);
        }
        
        // Si la réponse est 401 et qu'on a des données mockées, on les utilise
        if (response.status === 401 && options.mockData) {
          console.log(`[useApi] Utilisation de données mockées après 401 pour ${requestUrl}`);
          setData(options.mockData);
          setUseMockData(true);
          setIsSuccess(true);
          
          if (options.onSuccess) {
            options.onSuccess(options.mockData);
          }
          
          return options.mockData;
        }
        
        // Personnaliser les messages d'erreur selon le code HTTP
        let errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        switch (response.status) {
          case 400:
            errorMessage = `Requête incorrecte (400): ${errorDetails || 'Vérifiez les données envoyées'}`;
            break;
          case 401:
            errorMessage = 'Session expirée ou non authentifiée (401). Veuillez vous reconnecter.';
            break;
          case 403:
            errorMessage = 'Accès refusé (403). Vous n\'avez pas les droits nécessaires.';
            break;
          case 404:
            errorMessage = `Ressource introuvable (404): ${requestUrl}`;
            break;
          case 429:
            errorMessage = 'Trop de requêtes (429). Veuillez réessayer plus tard.';
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            errorMessage = `Erreur serveur (${response.status}). Veuillez réessayer ultérieurement.`;
            break;
          default:
            errorMessage = `Erreur HTTP ${response.status}: ${errorDetails || response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }
      
      // Parser la réponse JSON
      const rawResponseData = await response.json().catch(e => { // Renommer pour clarté
        throw new Error(`Erreur lors de la lecture de la réponse: ${e.message}`);
      });
      
      // Extraire les données de la structure { data: ... } (si elle existe)
      const result = rawResponseData.data !== undefined ? rawResponseData.data : rawResponseData;

      setData(prevData => {
        // Gérer les cas null/undefined pour éviter les erreurs avec JSON.stringify
        if (result === null || result === undefined) {
          // Si les nouvelles données sont null/undefined, mettre à jour si prevData était différent
          return prevData === result ? prevData : result;
        }
        if (prevData === null || prevData === undefined) {
          // Si les anciennes données étaient null/undefined et les nouvelles ne le sont pas, mettre à jour
          return result;
        }

        // Comparaison pour les objets et tableaux
        if (typeof prevData === 'object' && typeof result === 'object') {
          try {
            if (JSON.stringify(prevData) === JSON.stringify(result)) {
              return prevData; // Les données sont identiques, on garde l'ancienne référence
            }
          } catch (e) {
            // En cas d'erreur de stringify (ex: objets circulaires, non géré ici), on met à jour par défaut
            console.warn("[useApi] Erreur lors de la comparaison JSON pour setData:", e);
            return result;
          }
        } else if (prevData === result) { // Pour les types primitifs
            return prevData;
        }
        
        return result; // Les données sont différentes, on met à jour
      });
      
      setIsSuccess(true);
      
      if (options.onSuccess) {
        options.onSuccess(result); // Utiliser result ici
      }
      
      return result; // Utiliser result ici

    } catch (err: any) {
      console.error(`[useApi] Erreur lors de l'appel à ${requestUrl}:`, err);
      
      // Formatter le message d'erreur selon le type
      let errorMessage = '';
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = `Délai d'attente dépassé (${timeoutDuration/1000}s). La requête a été interrompue.`;
        } else {
          errorMessage = err.message;
        }
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else {
        errorMessage = 'Une erreur inconnue est survenue';
      }
      
      setError(errorMessage);
      
      if (options.onError) {
        options.onError(errorMessage);
      }
      
      // Utiliser les données mockées en cas d'erreur si disponibles
      if (options.mockData) {
        console.log(`[useApi] Fallback aux données mockées après erreur pour ${requestUrl}`);
        setData(options.mockData);
        setUseMockData(true);
        
        return options.mockData;
      }
      
      return null;
    } finally {
      setIsLoading(false);
      // Nettoyer le timeout si l'appel se termine (succès ou erreur gérée)
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }, [
    options.url, 
    options.method, 
    options.manual, 
    options.mockData, 
    options.timeout,
    options.headers,
    options.body,
    isAuthenticated, 
    bypassEnabled, 
    supabase,
    JSON.stringify(options.deps || [])
  ]);
  
  useEffect(() => {
    if (!options.manual) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.manual, fetchData, JSON.stringify(options.deps || [])]);
  
  const refetch = (): Promise<T | null> => {
    return fetchData();
  };
  
  return {
    data,
    isLoading,
    error,
    isSuccess,
    useMockData,
    fetch: fetchData,
    refetch: refetch,
    statusCode
  };
} 