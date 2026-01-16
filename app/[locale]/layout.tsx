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

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
    weight: ['400', '500', '600', '700', '800'],
    subsets: ["latin"],
    variable: "--font-poppins"
});

export const metadata: Metadata = {
    title: "EduPro - Formation Professionnelle en Afrique",
    description: "Plateforme de formation professionnelle leader en Afrique",
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
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
