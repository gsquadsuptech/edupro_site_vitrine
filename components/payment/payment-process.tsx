'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircleIcon, CreditCardIcon, ShieldCheckIcon, Loader2, LogIn, Users } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/auth/auth-modal';
import { toast } from 'sonner';

interface PaymentPlan {
    type: string;
    details: any;
}

export interface PaymentItem {
    type: 'course' | 'learning_path';
    id: string;
    title: string;
    thumbnail?: string;
}

interface PaymentProcessProps {
    /** Nouveau : item discriminé (course | learning_path). */
    item?: PaymentItem;
    /** Legacy : course brut (rétro-compat avec checkout/[courseId]). */
    course?: any;
    cohort?: any;
    plan: PaymentPlan;
    /** Phase 5 — team purchase. */
    purchaseMode?: 'individual' | 'team';
    seats?: number;
    organizationId?: string;
    onSuccess: (data: any) => void;
    onFailure: (error: any) => void;
    onPrevious?: () => void;
}

const FRONTEND_TO_BACKEND_PLAN: Record<string, string> = {
    oneTime: 'one_time',
    installments: 'installments',
    subscription: 'subscription',
    registrationMonthly: 'registration_monthly',
};

const toBackendPlanCode = (planType: string): string => FRONTEND_TO_BACKEND_PLAN[planType] || planType;

const resolveSaasUrl = (): string => {
    let saasUrl = process.env.NEXT_PUBLIC_SAAS_URL || '';
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname.includes('site.edupro.africa')) {
            saasUrl = 'https://staging.edupro.africa';
        } else if (hostname.includes('edupro.africa') && (!saasUrl || saasUrl.includes('localhost'))) {
            saasUrl = 'https://edupro.africa';
        }
    }
    if (!saasUrl || saasUrl.includes('localhost')) {
        saasUrl = 'http://localhost:3000';
    }
    return saasUrl;
};

const mapTeamPurchaseError = (status: number, code?: string, message?: string): string => {
    const c = (code || '').toLowerCase();
    if (status === 403 && c === 'teach_org_cannot_purchase') {
        return 'Votre organisation TEACH ne peut pas acheter sur le marketplace.';
    }
    if (status === 403 && c === 'not_org_admin') {
        return 'Seul un admin peut effectuer un achat groupé.';
    }
    if (status === 400 && c === 'plan_not_supported') {
        return "En V1, l'achat équipe n'est qu'en paiement unique.";
    }
    if (status === 409 && c === 'active_pool_exists') {
        return 'Un pool actif existe déjà pour ce contenu.';
    }
    return message || 'Une erreur est survenue';
};

export const PaymentProcess = ({
    item,
    course,
    cohort,
    plan,
    purchaseMode = 'individual',
    seats,
    organizationId,
    onSuccess,
    onFailure,
    onPrevious,
}: PaymentProcessProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const { user, isAuthenticated, supabase } = useAuth();

    // Normalisation : si on reçoit un course legacy, on construit l'item équivalent.
    const normalizedItem: PaymentItem = item
        ? item
        : { type: 'course', id: course?.id, title: course?.title, thumbnail: course?.thumbnail };

    const isTeam = purchaseMode === 'team';
    const seatsCount = isTeam ? Math.max(1, Number(seats || 1)) : 1;

    const formatPrice = (price: number | undefined | null) => {
        if (price === undefined || price === null) return 'N/A';
        return new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF' }).format(price);
    };

    const getInitialPaymentAmount = () => {
        if (!plan || !plan.details) return 0;
        let baseAmount = 0;
        switch (plan.type) {
            case 'oneTime':
                baseAmount = Number(plan.details.price) || 0;
                break;
            case 'installments':
                baseAmount = parseFloat(plan.details.installments?.[0]?.amount || 0);
                break;
            case 'subscription':
                baseAmount = Number(plan.details.monthlyPrice) || 0;
                break;
            case 'registrationMonthly':
                baseAmount = (Number(plan.details.registrationFee) || 0)
                    + (Number(plan.details.monthlyFee) || 0);
                break;
            default:
                baseAmount = 0;
        }
        // Pour le team purchase V1, on multiplie par le nombre de sièges (one_time only).
        return isTeam ? baseAmount * seatsCount : baseAmount;
    };

    const initialAmount = getInitialPaymentAmount();

    const buildInvoiceDescription = () => {
        const title = (normalizedItem.title || '').trim() || 'Formation EduPro';
        const sessionPart = cohort?.name ? ` — Session: ${cohort.name}` : '';
        const teamSuffix = isTeam ? ` — Achat équipe (${seatsCount} sièges)` : '';

        switch (plan.type) {
            case 'subscription':
                return `Abonnement mensuel — ${title}${sessionPart}${teamSuffix}`;
            case 'installments': {
                const total = plan.details?.installments?.length;
                const suffix = total ? ` (1/${total})` : '';
                return `Paiement échelonné${suffix} — ${title}${sessionPart}${teamSuffix}`;
            }
            case 'registrationMonthly':
                return `Inscription + 1ère mensualité — ${title}${sessionPart}${teamSuffix}`;
            case 'oneTime':
            default:
                return cohort
                    ? `Inscription — ${title}${sessionPart}${teamSuffix}`
                    : `Achat de la formation — ${title}${teamSuffix}`;
        }
    };

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

        let popup: Window | null = null;
        if (typeof window !== 'undefined') {
            popup = window.open('about:blank', 'PaymentPopup', `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`);
        }

        try {
            const saasUrl = resolveSaasUrl();
            const returnPath = normalizedItem.type === 'learning_path'
                ? `/checkout/learning-path/${normalizedItem.id}`
                : `/checkout/${normalizedItem.id}`;

            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                'x-api-key': process.env.NEXT_PUBLIC_SAAS_API_KEY || '',
            };

            // Phase 4 — Auth cross-app : pour les achats équipe, on passe le JWT
            // en header pour permettre l'authentification du user côté saas-2,
            // que les cookies soient partagés ou non (utile en localhost et cross-domain).
            if (isTeam && supabase) {
                try {
                    const { data: sessionData } = await supabase.auth.getSession();
                    const accessToken = sessionData.session?.access_token;
                    if (accessToken) {
                        headers['Authorization'] = `Bearer ${accessToken}`;
                    }
                } catch {
                    // Si on ne peut pas récupérer la session, on tente sans : saas-2 renverra
                    // not_org_admin si nécessaire (qu'on mappera ensuite côté UI).
                }
            }

            const body: Record<string, any> = {
                amount: initialAmount,
                courseId: normalizedItem.type === 'course' ? normalizedItem.id : null,
                cohortId: cohort?.id,
                paymentPlan: toBackendPlanCode(plan.type),
                userId: user?.id,
                email: user?.email,
                firstName: user?.user_metadata?.first_name,
                lastName: user?.user_metadata?.last_name,
                description: buildInvoiceDescription(),
                returnUrl: `${window.location.origin}${returnPath}?status=success`,
                cancelUrl: `${window.location.origin}${returnPath}?status=cancelled`,
                // Type explicite pour les nouveaux endpoints
                itemType: normalizedItem.type,
                itemId: normalizedItem.id,
            };

            // Workaround : EnrollmentService.createLearningPathEnrollment lit
            // payment.payment_details.learningPathId côté saas-2. À retirer
            // quand le refacto saas-2 sera fait.
            if (normalizedItem.type === 'learning_path') {
                body.paymentDetails = {
                    learningPathId: normalizedItem.id,
                    itemType: normalizedItem.type,
                    itemId: normalizedItem.id,
                };
            }

            // Phase 5 — Team purchase
            if (isTeam) {
                body.purchaseMode = 'team';
                body.seats = seatsCount;
                body.organizationId = organizationId;
            }

            const response = await fetch(`${saasUrl}/api/payments/initialize`, {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (popup) popup.close();
                const friendly = isTeam
                    ? mapTeamPurchaseError(response.status, errorData.code, errorData.message)
                    : (errorData.message || "Erreur lors de l'initialisation du paiement");
                if (isTeam) toast.error(friendly);
                throw new Error(friendly);
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
                throw new Error(data.message || "L'initialisation a échoué");
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
        const base = (() => {
            switch (plan.type) {
                case 'oneTime': return 'Paiement unique';
                case 'installments': return `Paiement en ${plan.details.installments?.length || 'N/A'} fois`;
                case 'subscription': return 'Abonnement mensuel';
                case 'registrationMonthly': return "Frais d'inscription + mensualités";
                default: return 'Plan non spécifié';
            }
        })();
        return isTeam ? `${base} • Achat équipe (${seatsCount} sièges)` : base;
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
                        <h3 className="font-semibold text-base mb-2">{normalizedItem.title}</h3>
                        {cohort && (
                            <p className="text-muted-foreground mb-1">
                                Session : <span className="font-medium text-foreground">{cohort.name}</span>
                            </p>
                        )}
                        <p className="text-muted-foreground">
                            Plan : <span className="font-medium text-foreground">{getPlanDescription()}</span>
                        </p>
                        {isTeam && (
                            <p className="text-muted-foreground flex items-center gap-1 mt-1">
                                <Users className="h-3.5 w-3.5" />
                                <span>Achat équipe : <span className="font-medium text-foreground">{seatsCount} sièges</span></span>
                            </p>
                        )}
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
                                disabled={loading || !isAuthenticated || (isTeam && !organizationId)}
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
