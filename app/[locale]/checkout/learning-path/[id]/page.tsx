"use client";

import { useState, useEffect, use, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stepper } from "@/components/payment/stepper";
import { PaymentPlan } from "@/components/payment/payment-plan";
import { PaymentProcess, PaymentItem } from "@/components/payment/payment-process";
import { PaymentConfirmation } from "@/components/payment/payment-confirmation";
import { AuthModal } from "@/components/auth/auth-modal";
import { LearningPathService } from "@/services/learning-path-service";
import { useAuth } from "@/hooks/useAuth";
import { useActiveBusinessOrg } from "@/hooks/use-active-business-org";
import {
    derivePlanDetails,
    getAvailableModes,
    getEnabledModeCount,
    getOnlyEnabledMode,
} from "@/lib/pricing";
import { LearningPath } from "@/lib/supabase/types";

export default function LearningPathCheckoutPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale, id } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const statusParam = searchParams.get('status');
    const tokenParam = searchParams.get('token');

    const { isAuthenticated } = useAuth();
    const { orgId, isBusinessAdmin, isTeachOnly, loading: orgLoading } = useActiveBusinessOrg();

    const purchaseModeParam = searchParams.get('purchaseMode');
    const initialPurchaseMode: 'individual' | 'team' = purchaseModeParam === 'team' ? 'team' : 'individual';

    const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
    const [loading, setLoading] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);
    const [currentStep, setCurrentStep] = useState(2);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [skipPaymentPlan, setSkipPaymentPlan] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "failed">("pending");
    const [paymentData, setPaymentData] = useState<any>(null);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [purchaseMode, setPurchaseMode] = useState<'individual' | 'team'>(initialPurchaseMode);
    const [seats, setSeats] = useState<number>(1);

    const resolveSaasUrl = useCallback(() => {
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
    }, []);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                if (statusParam === 'success' && tokenParam) {
                    setIsVerifying(true);
                    const fetched = await LearningPathService.getLearningPathById(id);
                    if (!isMounted) return;
                    if (fetched) setLearningPath(fetched);

                    const saasUrl = resolveSaasUrl();
                    const res = await fetch(`${saasUrl}/api/payments/check-status?ref=${tokenParam}&status=success`);
                    if (!isMounted) return;

                    if (res.ok) {
                        const data = await res.json();
                        if (data.success && data.payment) {
                            setPaymentStatus("success");
                            setPaymentData(data.payment);
                        } else {
                            setPaymentStatus("failed");
                        }
                    } else {
                        setPaymentStatus("failed");
                    }
                    setSelectedPlan({ type: 'unknown', details: {} });
                    setCurrentStep(4);
                    setIsVerifying(false);
                    setLoading(false);
                    return;
                }

                const fetched = await LearningPathService.getLearningPathById(id);
                if (!isMounted) return;

                if (fetched) {
                    setLearningPath(fetched);
                    // En team purchase, l'étape Plan reste visible (champ seats).
                    if (initialPurchaseMode === 'team') {
                        setCurrentStep(2);
                    } else {
                        const modes = getAvailableModes(fetched);
                        if (getEnabledModeCount(modes) <= 1) {
                            const onlyMode = getOnlyEnabledMode(modes) ?? 'oneTime';
                            setSkipPaymentPlan(true);
                            setSelectedPlan({
                                type: onlyMode,
                                details: derivePlanDetails(onlyMode, fetched),
                            });
                            setCurrentStep(3);
                        } else {
                            setCurrentStep(2);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch learning path", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                    setIsVerifying(false);
                }
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, [id, statusParam, tokenParam, resolveSaasUrl]);

    const handlePlanSelect = (plan: any) => {
        setSelectedPlan(plan);
        setCurrentStep(3);
    };

    const handlePaymentSuccess = (data: any) => {
        setPaymentStatus("success");
        setPaymentData(data);
        setCurrentStep(4);
    };

    const handlePaymentFailure = () => {
        setPaymentStatus("failed");
    };

    const handleAccessCourse = async () => {
        const targetPath = purchaseMode === 'team'
            ? '/admin/billing/seat-pools'
            : '/dashboard/learning-journey';
        try {
            const { createClient } = await import("@/lib/supabase/client");
            const { getAppUrl } = await import("@/lib/utils");
            const supabase = createClient();
            const { data } = await supabase.auth.getSession();
            const token = data.session?.access_token;
            window.location.href = getAppUrl(targetPath, token);
        } catch (error) {
            console.error("Erreur de redirection:", error);
            window.location.href = `${process.env.NEXT_PUBLIC_SAAS_URL || 'https://app.edupro.africa'}${targetPath}`;
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            if (currentStep === 3 && skipPaymentPlan) {
                router.push(`/${locale}/parcours/${learningPath?.slug || ''}`);
                return;
            }
            setCurrentStep(currentStep - 1);
        } else {
            router.push(`/${locale}/parcours/${learningPath?.slug || ''}`);
        }
    };

    if (loading || isVerifying) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p>{isVerifying ? "Vérification du paiement en cours..." : "Chargement du parcours..."}</p>
                </div>
            </div>
        );
    }

    if (!learningPath) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-2xl font-bold mb-4">Parcours non trouvé</h2>
                <Button onClick={() => router.push(`/${locale}/catalogue/all?type=learning_path`)}>
                    Retour au catalogue
                </Button>
            </div>
        );
    }

    const paymentItem: PaymentItem = {
        type: 'learning_path',
        id: learningPath.id,
        title: learningPath.title,
        thumbnail: learningPath.image_url ?? undefined,
    };

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center">
                Inscription au parcours
            </h1>

            <Card className="mb-8">
                <CardContent className="pt-6">
                    <Stepper
                        currentStep={currentStep}
                        steps={[
                            { id: 2, label: "Plan de paiement", skipped: skipPaymentPlan },
                            { id: 3, label: "Paiement" },
                            { id: 4, label: "Confirmation" },
                        ]}
                    />
                </CardContent>
            </Card>

            <div className="mt-8">
                {currentStep === 2 && (
                    <PaymentPlan
                        course={learningPath}
                        item={paymentItem}
                        isBusinessAdmin={isBusinessAdmin}
                        isTeachOnly={isTeachOnly}
                        organizationId={orgId}
                        purchaseMode={purchaseMode}
                        onPurchaseModeChange={setPurchaseMode}
                        seats={seats}
                        onSeatsChange={setSeats}
                        onSelect={handlePlanSelect}
                        onPrevious={handlePrevious}
                    />
                )}

                {currentStep === 3 && selectedPlan && (
                    <PaymentProcess
                        item={paymentItem}
                        plan={selectedPlan}
                        purchaseMode={purchaseMode}
                        seats={seats}
                        organizationId={orgId ?? undefined}
                        onSuccess={handlePaymentSuccess}
                        onFailure={handlePaymentFailure}
                        onPrevious={handlePrevious}
                    />
                )}

                {currentStep === 4 && (
                    <PaymentConfirmation
                        status={paymentStatus}
                        course={learningPath}
                        itemType="learning_path"
                        plan={selectedPlan}
                        paymentData={paymentData}
                        purchaseMode={purchaseMode}
                        onAccessCourse={handleAccessCourse}
                    />
                )}
            </div>

            <AuthModal
                open={authModalOpen}
                onOpenChange={setAuthModalOpen}
                onSuccess={() => setAuthModalOpen(false)}
                title="Connexion requise"
                description="Connectez-vous pour finaliser votre inscription."
            />
        </div>
    );
}
