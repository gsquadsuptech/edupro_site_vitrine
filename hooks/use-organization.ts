"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "./useAuth"

interface Profile {
  id: string
  organization_id: string | null
}

export function useOrganization() {
  const [organizationId, setOrganizationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { user, isLoading: isLoadingAuth, isAuthenticated, supabase } = useAuth()

  // Référence pour éviter les appels multiples
  const isFetchingRef = useRef(false)
  const lastUserIdRef = useRef<string | null>(null)

  const fetchOrganization = useCallback(async () => {
    // Éviter les appels multiples simultanés
    if (isFetchingRef.current) {
      console.log("[useOrganization] Appel déjà en cours, ignoré")
      return
    }

    if (!supabase) {
      console.warn("[useOrganization] Instance Supabase non disponible.")
      setOrganizationId(null)
      setLoading(false)
      return
    }

    if (!user || !user.id) {
      console.log("[useOrganization] Pas d'utilisateur authentifié")
      setOrganizationId(null)
      setLoading(false)
      return
    }

    // Éviter de refetch si c'est le même utilisateur
    if (lastUserIdRef.current === user.id && organizationId !== null) {
      console.log("[useOrganization] Même utilisateur, pas de refetch nécessaire")
      setLoading(false)
      return
    }

    try {
      isFetchingRef.current = true
      lastUserIdRef.current = user.id

      console.log("[useOrganization] Début de la récupération de l'organisation pour l'utilisateur:", user.id)

      // Essayer d'abord organization_members (source d'autorité)
      const { data: member } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single()

      let orgId = member?.organization_id

      // Si pas trouvé dans organization_members, essayer le profil (fallback)
      if (!orgId) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, organization_id')
          .eq('id', user.id)
          .single()

        orgId = profile?.organization_id
      }

      console.log("[useOrganization] Organization ID récupéré:", {
        fromMember: member?.organization_id,
        fromProfile: orgId,
        finalOrgId: orgId
      })

      if (!orgId) {
        console.log("[useOrganization] Aucune organisation associée")
        setOrganizationId(null)
        return
      }

      setOrganizationId(orgId)
      console.log("[useOrganization] Organization ID défini:", orgId)
    } catch (error) {
      console.error("[useOrganization] Erreur inattendue:", error)
      toast({
        title: 'Erreur',
        description: 'Une erreur inattendue est survenue',
        variant: 'destructive',
      })
      setOrganizationId(null)
    } finally {
      setLoading(false)
      isFetchingRef.current = false
    }
  }, [user?.id, supabase, toast, organizationId])

  useEffect(() => {
    // Ne déclencher que si l'authentification est terminée
    if (!isLoadingAuth) {
      if (isAuthenticated && user) {
        console.log("[useOrganization] Utilisateur authentifié, appel de fetchOrganization")
        fetchOrganization()
      } else {
        console.log("[useOrganization] Utilisateur non authentifié, réinitialisation")
        setOrganizationId(null)
        setLoading(false)
        lastUserIdRef.current = null
      }
    } else {
      console.log("[useOrganization] En attente de la fin du chargement de l'authentification...")
    }
  }, [isLoadingAuth, isAuthenticated, user?.id, fetchOrganization])

  return {
    organizationId,
    loading,
    isLoading: loading,
    refetch: fetchOrganization
  }
} 