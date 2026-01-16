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

    const simulatePayment = async () => {
        setLoading(true);
        setError(null);

        // Simulate API call delay
        setTimeout(() => {
            setLoading(false);
            // Simulate Success
            const mockSuccessData = {
                amount: initialAmount,
                reference: 'PAY-' + Math.random().toString(36).substring(7).toUpperCase(),
                created_at: new Date().toISOString(),
                nextPaymentDate: plan.type === 'installments' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null
            };
            onSuccess(mockSuccessData);
        }, 2000);
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
                        <Button
                            size="lg"
                            className="w-full bg-[#0085CA] hover:bg-[#006ca3]" // Paydunya Blue-ish
                            onClick={simulatePayment}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCardIcon className="mr-2 h-4 w-4" />}
                            Payer avec Paydunya {formatPrice(initialAmount)}
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full"
                            onClick={simulatePayment}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCardIcon className="mr-2 h-4 w-4" />}
                            Autre méthode {formatPrice(initialAmount)}
                        </Button>
                    </div>

                    <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                        <ShieldCheckIcon className="h-4 w-4 text-green-600" />
                        Paiement sécurisé (Simulation Vitrine)
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};
