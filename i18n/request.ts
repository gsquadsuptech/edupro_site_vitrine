import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from './routing';

export default getRequestConfig(async ({ locale: localeArg }) => {
    // In some cases (like build time or early lifecycle), locale could be undefined
    // We fallback to the default locale to avoid 404s
    const locale = localeArg || routing.defaultLocale;

    console.log(`[i18n] Loading config for locale: ${locale} (arg was: ${localeArg})`);

    // Validate that the incoming `locale` parameter is valid
    if (!routing.locales.includes(locale as any)) {
        console.error(`[i18n] Invalid locale detected: ${locale}`);
        notFound();
    }

    // Load all necessary namespaces
    const namespaces = ['common', 'landing', 'auth', 'courses', 'categories', 'marketplace'];

    const messages: Record<string, any> = {};

    try {
        for (const ns of namespaces) {
            try {
                // Using relative path for import
                const mod = await import(`../messages/${locale}/${ns}.json`);
                messages[ns] = mod.default;
            } catch (e) {
                console.warn(`[i18n] Could not load namespace ${ns} for locale ${locale}`);
            }
        }
    } catch (error) {
        console.error(`[i18n] Error loading messages for ${locale}:`, error);
    }

    return {
        messages,
        locale: locale as string
    };
});
