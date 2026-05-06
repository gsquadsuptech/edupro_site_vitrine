import { createClient } from '@/lib/supabase/client'

export interface OrganizationInfo {
    id: string
    name: string
    logo_url: string | null
}

export const OrganizationService = {
    async getPartnerInstitutes(): Promise<OrganizationInfo[]> {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('organizations')
            .select('id, name, logo_url')
            .eq('is_active', true)
            .not('logo_url', 'is', null)
            .neq('logo_url', '')
            .order('name', { ascending: true })
            .limit(24)

        if (error) {
            console.error('Error fetching partner institutes:', error)
            return []
        }

        return data.map((item: any) => ({
            id: item.id,
            name: item.name,
            logo_url: item.logo_url
        }))
    }
}
