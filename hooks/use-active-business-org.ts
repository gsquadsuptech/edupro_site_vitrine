"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./useAuth"

interface UseActiveBusinessOrgResult {
  /** ID de l'org Business pour laquelle l'utilisateur est admin actif. */
  orgId: string | null
  loading: boolean
  /** True si l'utilisateur est admin d'au moins une org Business. */
  isBusinessAdmin: boolean
  /**
   * True si l'utilisateur a une org TEACH active mais aucune org Business
   * — utile pour afficher le message « TEACH ne peut pas acheter ».
   */
  isTeachOnly: boolean
}

interface MembershipRow {
  organization_id: string
  role: string | null
  role_code: string | null
  is_active: boolean | null
  organizations: { organization_type: string | null } | { organization_type: string | null }[] | null
}

const isAdminRole = (m: MembershipRow): boolean =>
  (m.role === 'admin' || m.role_code === 'admin')

const orgType = (m: MembershipRow): string | null => {
  if (!m.organizations) return null
  const orgs = m.organizations as any
  if (Array.isArray(orgs)) return orgs[0]?.organization_type ?? null
  return orgs.organization_type ?? null
}

export function useActiveBusinessOrg(): UseActiveBusinessOrgResult {
  const { user, isLoading: isLoadingAuth, supabase } = useAuth()
  const [orgId, setOrgId] = useState<string | null>(null)
  const [isTeachOnly, setIsTeachOnly] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      if (isLoadingAuth) return
      if (!user || !supabase) {
        setOrgId(null)
        setIsTeachOnly(false)
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('organization_members')
          .select('organization_id, role, role_code, is_active, organizations!inner(organization_type)')
          .eq('user_id', user.id)
          .eq('is_active', true)

        if (cancelled) return

        if (error) {
          console.error('[useActiveBusinessOrg]', error)
          setOrgId(null)
          setIsTeachOnly(false)
          return
        }

        const memberships = (data || []) as unknown as MembershipRow[]
        const businessAdmin = memberships.find(m => isAdminRole(m) && orgType(m) === 'business')
        const teachActive = memberships.find(m => orgType(m) === 'teach')

        setOrgId(businessAdmin?.organization_id ?? null)
        setIsTeachOnly(!businessAdmin && !!teachActive)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    setLoading(true)
    run()
    return () => { cancelled = true }
  }, [isLoadingAuth, user?.id, supabase])

  return {
    orgId,
    loading,
    isBusinessAdmin: !!orgId,
    isTeachOnly,
  }
}
