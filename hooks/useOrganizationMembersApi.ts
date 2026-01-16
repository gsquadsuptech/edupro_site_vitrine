import { useCallback, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { Student } from '@/types/student';

// Types pour les paramètres de filtrage des membres
interface MemberFilters {
    search?: string;
    role?: string;
    status?: string;
    includeAllMembers?: boolean; // Nouveau paramètre pour inclure tous les membres
}

// Hook pour les opérations sur les membres de l'organisation
export function useOrganizationMembersApi() {
    const { supabase } = useAuth();
    const [members, setMembers] = useState<Student[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Récupérer la liste des membres de l'organisation
    const loadMembers = useCallback(async (filters?: MemberFilters) => {
        try {
            setIsLoading(true);
            setError(null);

            // Construire l'URL avec les paramètres de filtrage
            const params = new URLSearchParams();
            if (filters?.search) params.append('search', filters.search);
            if (filters?.role) params.append('role', filters.role);
            if (filters?.status) params.append('status', filters.status);
            if (filters?.includeAllMembers) params.append('include_all', 'true');

            const url = `/api/admin/organization-members${params.toString() ? `?${params.toString()}` : ''}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Inclure les cookies de session
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
            }

            const result = await response.json();

            // L'API retourne directement un tableau
            const membersData = Array.isArray(result) ? result : [];
            setMembers(membersData);
            return membersData;
        } catch (error) {
            console.error("Erreur lors du chargement des membres:", error);
            const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
            setError(errorMessage);

            // Retourner un tableau vide en cas d'erreur
            setMembers([]);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Rechercher des membres
    const searchMembers = useCallback(async (searchQuery: string) => {
        return await loadMembers({ search: searchQuery });
    }, [loadMembers]);

    // Recharger les membres
    const refreshMembers = useCallback(async () => {
        return await loadMembers();
    }, [loadMembers]);

    return {
        members,
        isLoading,
        error,
        loadMembers,
        searchMembers,
        refreshMembers,
    };
}
