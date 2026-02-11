'use client';

import dynamic from 'next/dynamic';

const TestPaymentClient = dynamic(
    () => import('./test-payment-client').then((mod) => mod.TestPaymentClient),
    {
        ssr: false,
        loading: () => (
            <div className="container mx-auto py-10 max-w-2xl">
                <div className="flex items-center justify-center h-64">
                    <div className="text-muted-foreground">Chargement...</div>
                </div>
            </div>
        )
    }
);

export default function TestPaymentPage() {
    return <TestPaymentClient />;
}
