'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

/**
 * Hook pour vérifier que les traductions sont disponibles avant de rendre le contenu
 * Utile lors d'une navigation SPA où les messages peuvent ne pas être immédiatement disponibles
 */
export function useTranslationsReady(namespace: string, testKey: string): boolean {
  const t = useTranslations(namespace);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Vérifier que les traductions sont disponibles
    const checkReady = () => {
      try {
        const value = t(testKey as any);
        // Si on obtient une clé au lieu d'une traduction, les messages ne sont pas encore prêts
        if (value && typeof value === 'string' && !value.startsWith(`${namespace}.`) && !value.startsWith('settings.')) {
          setIsReady(true);
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    };

    // Vérifier immédiatement
    if (checkReady()) {
      return;
    }

    // Si pas prêt, attendre un peu et réessayer (pour les navigations SPA)
    const timer = setTimeout(() => {
      if (checkReady()) {
        return;
      }
      // Après plusieurs tentatives, considérer comme prêt quand même pour éviter un blocage infini
      setIsReady(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [t, namespace, testKey]);

  return isReady;
}

