import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export default getRequestConfig(async ({ locale }) => {
    // Validate that the incoming `locale` parameter is valid
    if (!routing.locales.includes(locale as any)) {
        console.error(`[i18n] Invalid locale: ${locale}`);
        notFound();
    }

    // Load all necessary namespaces
    const namespaces = ['common', 'landing', 'auth', 'courses', 'categories', 'marketplace'];

    const messages: Record<string, any> = {};

    try {
        for (const ns of namespaces) {
            try {
                const mod = await import(`../messages/${locale}/${ns}.json`);
                messages[ns] = mod.default;
            } catch (e) {
                console.warn(`[i18n] Could not load namespace ${ns} for locale ${locale}`);
            }
        }
    } catch (error) {
        console.error(`[i18n] Error loading messages:`, error);
    }

    return {
        messages,
        locale: locale as string
    };
});
