import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from './routing'; // Does not exist yet, but let's check args first

const locales = ['fr', 'en'];

export default getRequestConfig(async (args) => {
    console.log('[i18n/request] RequestConfig called with args:', args);

    // Try to find locale in args
    let locale = args?.locale;
    // If undefined, maybe it's requestLocale (Promise)
    if (!locale && args?.requestLocale) {
        console.log('[i18n/request] Awaiting requestLocale...');
        locale = await args.requestLocale;
    }

    console.log('[i18n/request] Resolved locale:', locale);

    // Validate that the incoming `locale` parameter is valid
    if (!locale || !locales.includes(locale as any)) {
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
        locale // Return the resolved locale
    };
});
