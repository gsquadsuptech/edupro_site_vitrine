'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Locale } from '@/i18n';

export function useLanguage() {
  const locale = useLocale() as Locale;
  const router = useRouter();

  const changeLanguage = async (newLocale: Locale) => {
    if (newLocale === locale) {
      console.log('[useLanguage] Langue déjà sélectionnée:', newLocale);
      return;
    }

    try {
      console.log('[useLanguage] Changement de langue vers:', newLocale);

      // 1. Mettre à jour le cookie NEXT_LOCALE immédiatement
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

      // 2. Attendre un peu pour s'assurer que le cookie est bien enregistré
      await new Promise(resolve => setTimeout(resolve, 100));

      // 3. Charger les nouveaux messages pour tous les namespaces
      const messages = await loadAllMessages(newLocale);

      // 4. Déclencher l'événement de changement de langue pour le provider
      window.dispatchEvent(
        new CustomEvent('languageChanged', {
          detail: { locale: newLocale, messages },
        })
      );

      // 5. Afficher un toast de confirmation avant le rechargement
      const successMessage = newLocale === 'fr'
        ? 'Langue changée en français'
        : 'Language changed to English';

      toast.success(successMessage);

      console.log('[useLanguage] Changement de langue réussi');

      // 6. Forcer un rechargement complet de la page pour s'assurer que tous les composants se mettent à jour
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('[useLanguage] Erreur lors du changement de langue:', error);
      toast.error(
        locale === 'fr'
          ? 'Erreur lors du changement de langue'
          : 'Error changing language'
      );
    }
  };

  return { locale, changeLanguage };
}

// Fonction pour charger tous les namespaces de messages
async function loadAllMessages(locale: Locale) {
  try {
    // Charger tous les namespaces disponibles
    const namespaces = [
      'common',
      'errors',
      'profile',
      'admin',
      'dashboard',
      'courses',
      'students',
      'cohorts',
      'learning-paths',
      'categories',
      'tags',
      'certifications',
      'enrollments',
      'evaluations',
      'exercises',
      'instructors',
      'quizzes',
      'settings',
      'support',
      'finance',
      'progress',
      'landing',
    ];

    const messages: Record<string, any> = {};

    await Promise.all(
      namespaces.map(async (namespace) => {
        try {
          const msgs = await import(`@/messages/${locale}/${namespace}.json`);
          messages[namespace] = msgs.default;
        } catch (error) {
          console.warn(`[useLanguage] Could not load namespace "${namespace}" for locale "${locale}"`);
          messages[namespace] = {};
        }
      })
    );

    return messages;
  } catch (error) {
    console.error('[useLanguage] Error loading messages:', error);
    return {};
  }
}
