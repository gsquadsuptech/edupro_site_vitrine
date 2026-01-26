import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "EduPro - Formation Professionnelle",
    description: "Plateforme de formation professionnelle leader en Afrique",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html>
            <body>{children}</body>
        </html>
    );
}
