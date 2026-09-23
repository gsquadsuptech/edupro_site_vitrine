import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Poppins } from "next/font/google"; // Import fonts
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header/header";
import { StagingBanner } from "@/components/layout/staging-banner";
import { Footer } from "@/components/layout/footer/footer";
import { Toaster } from "@/components/ui/sonner";
import { RecaptchaProvider } from "@/components/marketing/recaptcha-provider";
import { FloatingActions } from "@/components/ui/floating-actions";
import { AuthProvider } from "@/hooks/useAuth";

// import { Inter, Poppins } from "next/font/google"; // Import fonts
// import "../globals.css";
// import { NextIntlClientProvider } from 'next-intl';
// ...

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: 'swap',
});

const poppins = Poppins({
    weight: ['300', '400', '500', '600', '700', '800'],
    subsets: ["latin"],
    variable: "--font-poppins",
    display: 'swap',
});

/**
 * `viewportFit: cover` est indispensable pour que `env(safe-area-inset-bottom)`
 * ait une valeur sur les iPhone a encoche : sans lui, la barre d'achat fixe
 * passe sous l'indicateur d'accueil et son bouton devient injoignable.
 */
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
};

export const metadata: Metadata = {
    title: {
        template: '%s | EduPro',
        default: 'EduPro - Plateforme de formation professionnelle adaptée à l\'Afrique. Entreprises, professionnels, formateurs : transformez vos talents. 🇸🇳 🇨🇮 🇰🇪',
    },
    description: 'Plateforme d\'éducation en ligne pour l\'Afrique',
    manifest: '/icons/site.webmanifest',
    icons: {
        icon: [
            { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
        ],
        apple: [
            { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
        ],
        other: [
            {
                rel: 'mask-icon',
                url: '/icons/safari-pinned-tab.svg',
                color: '#4f46e5'
            }
        ]
    },
    other: {
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'default',
        'apple-mobile-web-app-title': 'EduPro',
        'mobile-web-app-capable': 'yes',
        'msapplication-TileColor': '#4f46e5',
        'msapplication-tap-highlight': 'no',
        'format-detection': 'telephone=no',
    }
};

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const resolvedParams = await params;
    const locale = resolvedParams.locale;
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
                {/* Charge avant tout le reste, en ES5 : c'est lui qui rapporte les
                    erreurs de chargement des bundles sur les vieux navigateurs. */}
                <Script src="/error-reporter.js" strategy="beforeInteractive" />
                <NextIntlClientProvider messages={messages} locale={locale}>
                    <AuthProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="light"
                            enableSystem
                            disableTransitionOnChange
                        >
                            <RecaptchaProvider>
                                <div className="flex min-h-screen flex-col">
                                    <StagingBanner />
                                    <Header />
                                    <main className="flex-1">{children}</main>
                                    <Footer />
                                </div>
                                <Toaster />
                                <FloatingActions />
                            </RecaptchaProvider>
                        </ThemeProvider>
                    </AuthProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
