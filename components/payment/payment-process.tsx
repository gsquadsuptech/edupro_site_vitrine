'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircleIcon, CreditCardIcon, ShieldCheckIcon, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { MarketplaceCourse } from '@/types/marketplace'; // Local types if needed

interface PaymentPlan {
    type: string;
    details: any;
}

interface PaymentProcessProps {
    course: any;
    cohort?: any;
    plan: PaymentPlan;
    onSuccess: (data: any) => void;
    onFailure: (error: any) => void;
}

export const PaymentProcess = ({ course, cohort, plan, onSuccess, onFailure }: PaymentProcessProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formatPrice = (price: number | undefined | null) => {
        if (price === undefined || price === null) return 'N/A';
        return new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF' }).format(price);
    };

    const getInitialPaymentAmount = () => {
        if (!plan || !plan.details) return 0;
        switch (plan.type) {
            case 'oneTime':
                return plan.details.price;
            case 'installments':
                return parseFloat(plan.details.installments?.[0]?.amount || 0);
            case 'subscription':
                return plan.details.monthlyPrice;
            case 'registrationMonthly':
                return plan.details.registrationFee;
            default:
                return 0;
        }
    };

    const initialAmount = getInitialPaymentAmount();

    const handlePayment = async () => {
        setLoading(true);
        setError(null);

        // Stratégie pour contourner le blocage des popups
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const popup = window.open('about:blank', 'PaymentPopup', `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`);

        try {
            // URL de l'API SaaS (à rendre configurable via env si possible)
            const saasUrl = process.env.NEXT_PUBLIC_SAAS_URL || 'http://localhost:3000';

            const response = await fetch(`${saasUrl}/api/payments/initialize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_SAAS_API_KEY || ''
                },
                body: JSON.stringify({
                    amount: initialAmount,
                    courseId: course.id,
                    paymentPlan: plan.type,
                    userId: course.userId || 'guest', // À adapter selon votre gestion utilisateur
                    returnUrl: `${window.location.origin}/checkout/${course.id}?status=success`,
                    cancelUrl: `${window.location.origin}/checkout/${course.id}?status=cancelled`,
                    // gatewayId: 'paydunya' // L'API SaaS gère l'opérateur dynamiquement
                }),
            });

            if (!response.ok) {
                if (popup) popup.close();
                throw new Error('Erreur lors de l\'initialisation du paiement');
            }

            const data = await response.json();

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

                // On peut potentiellement appeler onSuccess ici si on ne redirige pas, 
                // mais généralement on attend le retour du webhook sur le backend.
            } else {
                if (popup) popup.close();
                throw new Error(data.message || 'L\'initialisation a échoué');
            }
        } catch (err: any) {
            if (popup) popup.close();
            setError(err.message);
            onFailure(err);
        } finally {
            setLoading(false);
        }
    };

    const getPlanDescription = () => {
        switch (plan.type) {
            case 'oneTime':
                return 'Paiement unique';
            case 'installments':
                return `Paiement en ${plan.details.installments?.length || 'N/A'} fois`;
            case 'subscription':
                return 'Abonnement mensuel';
            case 'registrationMonthly':
                return 'Frais d\'inscription + mensualités';
            default:
                return 'Plan non spécifié';
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center md:text-left">Finaliser votre inscription</h2>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl">Récapitulatif</CardTitle>
                    <CardDescription>Vérifiez les détails avant de procéder au paiement.</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-md border">
                        <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                        {cohort && (
                            <p className="text-sm text-muted-foreground mb-1">
                                Session : <span className="font-medium text-foreground">{cohort.name}</span>
                            </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                            Plan : <span className="font-medium text-foreground">{getPlanDescription()}</span>
                        </p>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-md text-muted-foreground">Montant à payer :</span>
                            <span className="text-xl font-bold text-primary">{formatPrice(initialAmount)}</span>
                        </div>
                        {plan.type === 'installments' && plan.details.totalAmount && initialAmount !== plan.details.totalAmount && (
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Montant total :</span>
                                <span className="font-medium">{formatPrice(plan.details.totalAmount)}</span>
                            </div>
                        )}
                        {plan.type === 'subscription' && (
                            <p className="text-xs text-muted-foreground text-right">Sera facturé mensuellement</p>
                        )}
                        {plan.type === 'registrationMonthly' && plan.details.monthlyPrice && (
                            <div className="flex justify-between text-sm mt-1">
                                <span className="text-muted-foreground">Prochaine mensualité :</span>
                                <span className="font-medium">{formatPrice(plan.details.monthlyPrice)}</span>
                            </div>
                        )}
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircleIcon className="h-4 w-4" />
                            <AlertTitle>Erreur</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4 w-full">
                        {initialAmount > 0 ? (
                            <Button
                                size="lg"
                                className="w-full text-lg font-bold"
                                onClick={handlePayment}
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCardIcon className="mr-2 h-4 w-4" />}
                                Payez {formatPrice(initialAmount)}
                            </Button>
                        ) : (
                            <Button
                                size="lg"
                                className="w-full"
                                onClick={handlePayment}
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheckIcon className="mr-2 h-4 w-4" />}
                                Confirmer l'inscription gratuite
                            </Button>
                        )}
                    </div>

                    <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                        <ShieldCheckIcon className="h-4 w-4 text-green-600" />
                        Paiement sécurisé
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};
