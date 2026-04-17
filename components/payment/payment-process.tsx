'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircleIcon, CreditCardIcon, ShieldCheckIcon, Loader2, LogIn } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/auth/auth-modal';

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
    onPrevious?: () => void;
}

export const PaymentProcess = ({ course, cohort, plan, onSuccess, onFailure, onPrevious }: PaymentProcessProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const { user, isAuthenticated } = useAuth();

    const formatPrice = (price: number | undefined | null) => {
        if (price === undefined || price === null) return 'N/A';
        return new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF' }).format(price);
    };

    const getInitialPaymentAmount = () => {
        if (!plan || !plan.details) return 0;
        switch (plan.type) {
            case 'oneTime':
                return Number(plan.details.price) || 0;
            case 'installments':
                return parseFloat(plan.details.installments?.[0]?.amount || 0);
            case 'subscription':
                return Number(plan.details.monthlyPrice) || 0;
            case 'registrationMonthly':
                // First payment covers the registration fee + the first month
                return (Number(plan.details.registrationFee) || 0)
                    + (Number(plan.details.monthlyFee) || 0);
            default:
                return 0;
        }
    };

    const initialAmount = getInitialPaymentAmount();

    const handlePayment = async () => {
        if (!isAuthenticated) {
            setAuthModalOpen(true);
            return;
        }

        setLoading(true);
        setError(null);

        // Stratégie pour contourner le blocage des popups
        const width = 600;
        const height = 700;
        const left = (typeof window !== 'undefined' ? window.screenX : 0) + ((typeof window !== 'undefined' ? window.outerWidth : 0) - width) / 2;
        const top = (typeof window !== 'undefined' ? window.screenY : 0) + ((typeof window !== 'undefined' ? window.outerHeight : 0) - height) / 2;

        // On n'ouvre la popup que si nécessaire
        let popup: Window | null = null;
        if (typeof window !== 'undefined') {
            popup = window.open('about:blank', 'PaymentPopup', `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`);
        }

        try {
            // URL de l'API SaaS (détection dynamique pour staging/production)
            let saasUrl = process.env.NEXT_PUBLIC_SAAS_URL || '';

            if (typeof window !== 'undefined') {
                const hostname = window.location.hostname;

                // Détection dynamique de l'environnement SaaS
                if (hostname.includes('site.edupro.africa')) {
                    saasUrl = 'https://staging.edupro.africa';
                } else if (hostname.includes('edupro.africa') && (!saasUrl || saasUrl.includes('localhost'))) {
                    saasUrl = 'https://edupro.africa';
                }
            }

            if (!saasUrl || saasUrl.includes('localhost')) {
                saasUrl = 'http://localhost:3000';
            }

            const response = await fetch(`${saasUrl}/api/payments/initialize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_SAAS_API_KEY || ''
                },
                body: JSON.stringify({
                    amount: initialAmount,
                    courseId: course.id,
                    cohortId: cohort?.id,
                    paymentPlan: plan.type,
                    userId: user?.id,
                    email: user?.email,
                    firstName: user?.user_metadata?.first_name,
                    lastName: user?.user_metadata?.last_name,
                    description: buildInvoiceDescription(),
                    returnUrl: `${window.location.origin}/checkout/${course.id}?status=success`,
                    cancelUrl: `${window.location.origin}/checkout/${course.id}?status=cancelled`,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (popup) popup.close();
                throw new Error(errorData.message || 'Erreur lors de l\'initialisation du paiement');
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

    const buildInvoiceDescription = () => {
        const title = (course?.title || '').trim() || 'Formation EduPro';
        const sessionPart = cohort?.name ? ` — Session: ${cohort.name}` : '';

        switch (plan.type) {
            case 'subscription':
                return `Abonnement mensuel — ${title}${sessionPart}`;
            case 'installments': {
                const total = plan.details?.installments?.length;
                const suffix = total ? ` (1/${total})` : '';
                return `Paiement échelonné${suffix} — ${title}${sessionPart}`;
            }
            case 'registrationMonthly':
                return `Inscription + 1ère mensualité — ${title}${sessionPart}`;
            case 'oneTime':
            default:
                return cohort
                    ? `Inscription — ${title}${sessionPart}`
                    : `Achat de la formation — ${title}`;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Finaliser votre inscription</h2>
                {onPrevious && (
                    <Button variant="outline" onClick={onPrevious} disabled={loading}>
                        Retour
                    </Button>
                )}
            </div>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl">Récapitulatif & Informations</CardTitle>
                    <CardDescription>Vérifiez vos informations avant de procéder au paiement.</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {!isAuthenticated && (
                        <Alert className="bg-primary/5 border-primary/20">
                            <LogIn className="h-4 w-4 text-primary" />
                            <AlertTitle>Connexion requise</AlertTitle>
                            <AlertDescription className="flex flex-col gap-3">
                                <span>Vous devez être connecté pour finaliser votre inscription.</span>
                                <Button
                                    type="button"
                                    variant="default"
                                    className="w-fit"
                                    onClick={() => setAuthModalOpen(true)}
                                >
                                    Se connecter
                                </Button>
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="bg-muted/50 p-4 rounded-md border text-sm">
                        <h3 className="font-semibold text-base mb-2">{course.title}</h3>
                        {cohort && (
                            <p className="text-muted-foreground mb-1">
                                Session : <span className="font-medium text-foreground">{cohort.name}</span>
                            </p>
                        )}
                        <p className="text-muted-foreground">
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
                                disabled={loading || !isAuthenticated}
                            >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCardIcon className="mr-2 h-4 w-4" />}
                                Payez {formatPrice(initialAmount)}
                            </Button>
                        ) : (
                            <Button
                                size="lg"
                                className="w-full"
                                onClick={handlePayment}
                                disabled={loading || !isAuthenticated}
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

            <AuthModal
                open={authModalOpen}
                onOpenChange={setAuthModalOpen}
                onSuccess={() => setAuthModalOpen(false)}
                description="Connectez-vous pour finaliser votre inscription."
            />
        </div>
    );
};
