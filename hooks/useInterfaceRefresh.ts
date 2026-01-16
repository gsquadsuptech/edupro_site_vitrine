"use client";

import { useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from './useAuth';

/**
 * Hook pour gérer le rechargement automatique des données lors du changement d'interface
 * Détecte les changements de route entre les différentes interfaces (admin, instructor, dashboard)
 * et déclenche un rechargement des données utilisateur
 */
export function useInterfaceRefresh() {
    const pathname = usePathname();
    const { refreshSession } = useAuth();

    // Fonction pour déterminer l'interface actuelle basée sur le pathname
    const getCurrentInterface = useCallback((path: string): string | null => {
        if (path.startsWith('/admin')) return 'admin';
        if (path.startsWith('/instructor')) return 'instructor';
        if (path.startsWith('/dashboard') || path === '/') return 'student';
        return null;
    }, []);

    // Fonction pour recharger les données utilisateur (stable)
    const refreshUserData = useCallback(async () => {
        try {
            console.log('[useInterfaceRefresh] Rechargement des données utilisateur...');

            // Rafraîchir la session pour obtenir les dernières données
            await refreshSession();

            // Événement (informatisé) – n'entraîne pas de refetch côté hooks
            try {
                window.dispatchEvent(new CustomEvent('interfaceChanged', {
                    detail: {
                        interface: getCurrentInterface(pathname),
                        timestamp: Date.now()
                    }
                }));
            } catch { }

            console.log('[useInterfaceRefresh] Données utilisateur rechargées avec succès');
        } catch (error) {
            console.error('[useInterfaceRefresh] Erreur lors du rechargement des données:', error);
        }
    }, [refreshSession, pathname, getCurrentInterface]);

    // Détecter les changements d'interface (anti-boucle: comparer avec la précédente)
    const lastInterfaceRef = useRef<string | null>(null);
    const lastRunAtRef = useRef<number>(0);

    useEffect(() => {
        const currentInterface = getCurrentInterface(pathname);
        const prev = lastInterfaceRef.current;

        if (!currentInterface) return;

        const now = Date.now();
        const recentlyRan = now - lastRunAtRef.current < 800; // throttle ~0.8s

        if (currentInterface !== prev && !recentlyRan) {
            console.log(`[useInterfaceRefresh] Changement d'interface détecté: ${currentInterface}`);
            lastInterfaceRef.current = currentInterface;
            lastRunAtRef.current = now;
            const timeoutId = setTimeout(() => {
                refreshUserData();
            }, 120);
            return () => clearTimeout(timeoutId);
        }
    }, [pathname, getCurrentInterface, refreshUserData]);

    // Fonction utilitaire pour forcer un rechargement manuel
    const forceRefresh = useCallback(() => {
        refreshUserData();
    }, [refreshUserData]);

    return {
        currentInterface: getCurrentInterface(pathname),
        forceRefresh,
        refreshUserData
    };
}
