import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { decodeJWT, isTokenExpired } from '@/lib/utils/jwt'
import { getAllCookies } from '@/lib/cookies'

export const useAuthDebug = () => {
  const { supabase } = useAuth()

  useEffect(() => {
    const debugAuthState = async () => {
      if (!supabase) {
        console.log('[Auth Debug] Supabase client non initialisé dans useAuth.')
        return
      }
      try {
        console.log('[Auth Debug] Début du diagnostic d\'authentification...')
        
        // Vérifier localStorage
        const localStorageTokens = {
          accessToken: localStorage.getItem('sb-access-token'),
          refreshToken: localStorage.getItem('sb-refresh-token'),
          authToken: localStorage.getItem('auth-token')
        }
        console.log('[Auth Debug] LocalStorage tokens:', localStorageTokens)
        
        // Vérifier les tokens JWT
        if (localStorageTokens.accessToken) {
          const decodedToken = decodeJWT(localStorageTokens.accessToken)
          console.log('[Auth Debug] Token décodé:', decodedToken)
          console.log('[Auth Debug] Token expiré:', isTokenExpired(localStorageTokens.accessToken))
        }
        
        // Vérifier la session Supabase côté client
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('[Auth Debug] Erreur de session Supabase:', sessionError)
        }
        
        console.log('[Auth Debug] Session Supabase (via useAuth):', session)
        
        // Vérifier les cookies
        const cookies = getAllCookies()
        console.log('[Auth Debug] Cookies:', cookies)
        
        // Vérifier la session côté serveur
        try {
          console.log('[Auth Debug] Vérification de la session côté serveur...')
          
          const response = await fetch('/api/auth/debug-session', {
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          })
          
          if (!response.ok) {
            const errorText = await response.text()
            console.error('[Auth Debug] Réponse serveur:', {
              status: response.status,
              statusText: response.statusText,
              body: errorText
            })
          } else {
            const contentType = response.headers.get('content-type')
            if (contentType && contentType.includes('application/json')) {
              const data = await response.json()
              console.log('[Auth Debug] Session serveur:', data)
            } else {
              const text = await response.text()
              console.log('[Auth Debug] Réponse serveur (non-JSON):', text)
            }
          }
        } catch (error) {
          console.error('[Auth Debug] Erreur vérification serveur:', error)
        }
      } catch (error) {
        console.error('[Auth Debug] Erreur générale dans debugAuthState:', error)
      }
    }
    
    debugAuthState()
  }, [supabase])
} 