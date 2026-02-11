'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, ExternalLink, AppWindow as WindowIcon } from 'lucide-react';

export function TestPaymentClient() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);
    const [gatewayId, setGatewayId] = useState<'paytech' | 'paydunya'>('paytech');

    const testPayment = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        // Stratégie pour contourner le blocage des popups :
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const popup = window.open('about:blank', 'PaymentPopup', `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`);

        try {
            const response = await fetch('http://localhost:3000/api/payments/initialize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'edupro_test_key_2026'
                },
                body: JSON.stringify({
                    amount: 1000,
                    courseId: 'test-course',
                    paymentPlan: 'oneTime',
                    gatewayId: gatewayId,
                    userId: 'db9b9bdc-61bc-466b-adf7-4d1c0c87874e'
                }),
            });

            if (!response.ok) {
                if (popup) popup.close();
                throw new Error('Erreur lors de l\'initialisation');
            }

            const data = await response.json();
            setResult(data);

            if (data.success && data.redirectUrl) {
                const url = data.redirectUrl;
                const mode = data.presentationMode || 'same_tab';

                if (mode === 'popup' && popup) {
                    popup.location.href = url;
                } else {
                    if (popup) popup.close();

                    if (mode === 'new_tab') {
                        window.open(url, '_blank');
                    } else {
                        window.location.href = url;
                    }
                }
            } else {
                if (popup) popup.close();
            }
        } catch (err: any) {
            if (popup) popup.close();
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>Test d&apos;Intégration Paiement</CardTitle>
                    <CardDescription>
                        Cette page simule l&apos;intégration du paiement depuis le site vitrine vers le SaaS.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="gateway">Passerelle de paiement</Label>
                        <select
                            id="gateway"
                            value={gatewayId}
                            onChange={(e) => setGatewayId(e.target.value as any)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="paytech">PayTech (Sénégal)</option>
                            <option value="paydunya">Paydunya (Sénégal/Côte d&apos;Ivoire)</option>
                        </select>
                    </div>

                    <div className="bg-muted p-4 rounded-md">
                        <p className="text-sm font-mono text-muted-foreground">
                            API Target: http://localhost:3000/api/payments/initialize
                        </p>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertTitle>Erreur</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {result && (
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Réponse Reçue :</p>
                            <pre className="bg-black text-white p-3 rounded text-xs overflow-auto max-h-40">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button onClick={testPayment} disabled={loading} className="w-full">
                        {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            `Simuler avec ${gatewayId === 'paytech' ? 'PayTech' : 'Paydunya'}`
                        )}
                    </Button>
                </CardFooter>
            </Card>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-xs text-muted-foreground uppercase tracking-widest">
                <div className="flex flex-col items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    <span>Same Tab</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <WindowIcon className="h-4 w-4" />
                    <span>Popup</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="border border-current rounded px-1">+</div>
                    <span>New Tab</span>
                </div>
            </div>
        </div>
    );
}
