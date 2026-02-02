import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google"; // Import fonts
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header/header";
import { Footer } from "@/components/layout/footer/footer";
import { Toaster } from "@/components/ui/sonner";
import { RecaptchaProvider } from "@/components/marketing/recaptcha-provider";
import { FloatingActions } from "@/components/ui/floating-actions";
import { AuthProvider } from "@/hooks/useAuth";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
    weight: ['400', '500', '600', '700', '800'],
    subsets: ["latin"],
    variable: "--font-poppins"
});

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
