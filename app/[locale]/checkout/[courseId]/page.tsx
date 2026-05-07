"use client";

import { useState, useEffect, use, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stepper } from "@/components/payment/stepper";
import { SessionSelection } from "@/components/payment/session-selection";
import { PaymentPlan } from "@/components/payment/payment-plan";
import { PaymentProcess } from "@/components/payment/payment-process";
import { PaymentConfirmation } from "@/components/payment/payment-confirmation";
import { AuthModal } from "@/components/auth/auth-modal";
import { CourseService } from "@/services/course-service";
import { useAuth } from "@/hooks/useAuth";
import { useActiveBusinessOrg } from "@/hooks/use-active-business-org";
import { PaymentItem } from "@/components/payment/payment-process";
import { toast } from "sonner";
import {
    derivePlanDetails,
    getAvailableModes,
    getEnabledModeCount,
    getOnlyEnabledMode,
} from "@/lib/pricing";


export default function CheckoutPage({
    params,
}: {
    params: Promise<{ locale: string; courseId: string }>;
}) {
    const { locale, courseId } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const statusParam = searchParams.get('status');
    const tokenParam = searchParams.get('token');

    const { user, isAuthenticated } = useAuth();
    const { orgId, isBusinessAdmin, isTeachOnly } = useActiveBusinessOrg();
    const purchaseModeParam = searchParams.get('purchaseMode');
    const initialPurchaseMode: 'individual' | 'team' = purchaseModeParam === 'team' ? 'team' : 'individual';
    const [purchaseMode, setPurchaseMode] = useState<'individual' | 'team'>(initialPurchaseMode);
    const [seats, setSeats] = useState<number>(1);
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);
    const [currentStep, setCurrentStep] = useState(2); // Start at step 2 (Plan) by default
    const [selectedSession, setSelectedSession] = useState<any>(null);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [skipPaymentPlan, setSkipPaymentPlan] = useState(false);
    const [skipPayment, setSkipPayment] = useState(false); // Skip payment step entirely for free courses
    const [paymentStatus, setPaymentStatus] = useState<
        "pending" | "success" | "failed"
    >("pending");
    const [paymentData, setPaymentData] = useState<any>(null);
    const [skipSessionStep, setSkipSessionStep] = useState(true); // Default to true, enable if cohorts found
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [enrollingFree, setEnrollingFree] = useState(false);
    const [pendingEnrollment, setPendingEnrollment] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                if (statusParam === 'success' && tokenParam) {
                    setIsVerifying(true);
                    
                    const fetchedCourse = await CourseService.getCourseById(courseId);
                    if (!isMounted) return;
                    if (fetchedCourse) setCourse(fetchedCourse);
                    
                    let saasUrl = process.env.NEXT_PUBLIC_SAAS_URL || '';
                    if (!saasUrl || saasUrl.includes('localhost')) {
                        saasUrl = 'http://localhost:3000';
                    }

                    const res = await fetch(`${saasUrl}/api/payments/check-status?ref=${tokenParam}&status=success`);
                    if (!isMounted) return;

                    if (res.ok) {
                        const data = await res.json();
                        if (data.success && data.payment) {
                            setPaymentStatus("success");
                            setPaymentData(data.payment);
                            setSkipSessionStep(true);
                            setSelectedPlan({ type: 'unknown', details: {} });
                            setCurrentStep(4);
                        } else {
                            setPaymentStatus("failed");
                            setSelectedPlan({ type: 'unknown', details: {} });
                            setCurrentStep(4);
                        }
                    } else {
                        setPaymentStatus("failed");
                        setSelectedPlan({ type: 'unknown', details: {} });
                        setCurrentStep(4);
                    }
                    setIsVerifying(false);
                    setLoading(false);
                    return;
                }

                const [fetchedCourse, fetchedCohorts] = await Promise.all([
                    CourseService.getCourseById(courseId),
                    CourseService.getCohortsByCourseId(courseId)
                ]);

                if (!isMounted) return;

                if (fetchedCourse) {
                    setCourse(fetchedCourse);
                }

                const isFree = fetchedCourse?.access_type === 'free' || (fetchedCourse?.price || 0) <= 0;

                if (isFree) {
                    setSkipPaymentPlan(true);
                    setSkipPayment(true);
                    setSelectedPlan({ type: 'oneTime', details: { price: 0, originalPrice: 0 } });
                }

                // Helper: when we already know which cohort applies (0 or 1 cohort),
                // pre-compute available modes and pre-select the plan if there's only one.
                // En mode team purchase, on N'OPTIMISE PAS : on garde l'étape Plan
                // pour laisser l'utilisateur saisir le nombre de sièges.
                const presetSinglePaymentMode = (selectedCohort?: any) => {
                    if (isFree) return; // already handled above
                    if (initialPurchaseMode === 'team') return; // garder l'étape Plan visible
                    const modes = getAvailableModes(fetchedCourse, selectedCohort);
                    if (getEnabledModeCount(modes) <= 1) {
                        const onlyMode = getOnlyEnabledMode(modes) ?? 'oneTime';
                        setSkipPaymentPlan(true);
                        setSelectedPlan({
                            type: onlyMode,
                            details: derivePlanDetails(onlyMode, fetchedCourse, selectedCohort),
                        });
                    }
                };

                // Handle cohort selection
                if (fetchedCohorts && fetchedCohorts.length > 1) {
                    setSkipSessionStep(false);
                    setCurrentStep(1);
                } else if (fetchedCohorts && fetchedCohorts.length === 1) {
                    setSkipSessionStep(true);
                    setSelectedSession(fetchedCohorts[0]);
                    presetSinglePaymentMode(fetchedCohorts[0]);
                    // For free courses, we'll trigger enrollment flow via a separate effect
                    // once we know auth status. Don't set currentStep to 3 here.
                    if (!isFree) {
                        // En team purchase, l'étape Plan reste visible (champ seats).
                        if (initialPurchaseMode === 'team') {
                            setCurrentStep(2);
                        } else {
                            const modes = getAvailableModes(fetchedCourse, fetchedCohorts[0]);
                            setCurrentStep(getEnabledModeCount(modes) <= 1 ? 3 : 2);
                        }
                    }
                } else {
                    setSkipSessionStep(true);
                    presetSinglePaymentMode();
                    if (!isFree) {
                        if (initialPurchaseMode === 'team') {
                            setCurrentStep(2);
                        } else {
                            const modes = getAvailableModes(fetchedCourse);
                            setCurrentStep(getEnabledModeCount(modes) <= 1 ? 3 : 2);
                        }
                    }
                }

            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                    setIsVerifying(false);
                }
            }
        };

        fetchData();
        
        return () => {
            isMounted = false;
        };
    }, [courseId, statusParam, tokenParam]);

    const handleFreeEnrollment = useCallback(async (session?: any) => {
        if (enrollingFree) return;
        if (!user?.id || !user?.email) {
            // Auth not ready yet — defer until the user object is available
            setPendingEnrollment(true);
            return;
        }
        setEnrollingFree(true);
        try {
            const response = await fetch('/api/enroll/free', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId: course?.id,
                    cohortId: (session ?? selectedSession)?.id,
                }),
            });

            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(data.error || "Échec de l'inscription gratuite");
            }

            setPaymentStatus("success");
            setPaymentData(data.enrollment || data);
            setCurrentStep(4);
        } catch (err: any) {
            console.error(err);
            toast.error(err?.message || "Erreur lors de l'inscription gratuite");
        } finally {
            setEnrollingFree(false);
        }
    }, [course?.id, selectedSession, user, enrollingFree]);

    const handleSessionSelect = (session: any) => {
        setSelectedSession(session);
        if (skipPayment) {
            // Free course: require auth, then enroll directly
            if (!isAuthenticated || !user?.id || !user?.email) {
                setPendingEnrollment(true);
                setAuthModalOpen(true);
            } else {
                handleFreeEnrollment(session);
            }
            return;
        }

        // Re-evaluate available modes against the picked cohort — it can override
        // the course-level pricing modes via use_course_price === false.
        const modes = getAvailableModes(course, session);
        if (getEnabledModeCount(modes) <= 1) {
            const onlyMode = getOnlyEnabledMode(modes) ?? 'oneTime';
            setSkipPaymentPlan(true);
            setSelectedPlan({
                type: onlyMode,
                details: derivePlanDetails(onlyMode, course, session),
            });
            setCurrentStep(3);
        } else {
            setSkipPaymentPlan(false);
            setCurrentStep(2);
        }
    };

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

    const handleAuthSuccess = useCallback(() => {
        setAuthModalOpen(false);
        if (skipPayment) {
            // Defer: an effect will pick this up once the auth context exposes the user
            setPendingEnrollment(true);
        }
    }, [skipPayment]);

    // Auto-trigger free enrollment when user is authenticated and on a free course with no session selection step
    useEffect(() => {
        if (!loading && skipPayment && skipSessionStep && currentStep !== 4) {
            if (isAuthenticated) {
                if (paymentStatus === "pending" && !enrollingFree) {
                    setPendingEnrollment(true);
                }
            } else {
                setAuthModalOpen(true);
            }
        }
    }, [loading, skipPayment, skipSessionStep, isAuthenticated, currentStep, paymentStatus, enrollingFree]);

    // Execute deferred enrollment once user is fully loaded
    useEffect(() => {
        if (pendingEnrollment && user?.id && user?.email && !enrollingFree && currentStep !== 4) {
            setPendingEnrollment(false);
            handleFreeEnrollment();
        }
    }, [pendingEnrollment, user?.id, user?.email, enrollingFree, currentStep, handleFreeEnrollment]);

    const handleAccessCourse = () => {
        if (purchaseMode === 'team') {
            const adminBase = process.env.NEXT_PUBLIC_DASHBOARD_ADMIN_URL
                || 'https://app.edupro.africa/admin';
            window.location.href = `${adminBase}/billing/seat-pools`;
        } else {
            const studentBase = process.env.NEXT_PUBLIC_DASHBOARD_STUDENT_URL
                || 'https://app.edupro.africa/dashboard';
            window.location.href = `${studentBase}/courses`;
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            if (currentStep === 3 && skipPaymentPlan) {
                // Go back to session selection or course page
                if (skipSessionStep) {
                    router.push(`/${locale}/formation/${course?.slug}`);
                } else {
                    setCurrentStep(1);
                }
                return;
            }
            if (currentStep === 2 && skipSessionStep) {
                router.push(`/${locale}/formation/${course?.slug}`);
                return;
            }
            setCurrentStep(currentStep - 1);
        } else {
            router.push(`/${locale}/formation/${course?.slug}`);
        }
    };

    if (loading || isVerifying) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p>{isVerifying ? "Vérification du paiement en cours..." : "Chargement des informations du cours..."}</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-2xl font-bold mb-4">Cours non trouvé</h2>
                <Button onClick={() => router.push(`/${locale}/catalogue/all`)}>
                    Retour au catalogue
                </Button>
            </div>
        );
    }

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center">
                Inscription au cours
            </h1>

            <Card className="mb-8">
                <CardContent className="pt-6">
                    <Stepper
                        currentStep={currentStep}
                        steps={[
                            { id: 1, label: "Choisir la session", skipped: skipSessionStep },
                            { id: 2, label: "Plan de paiement", skipped: skipPaymentPlan },
                            { id: 3, label: "Paiement", skipped: skipPayment },
                            { id: 4, label: "Confirmation" },
                        ]}
                    />
                </CardContent>
            </Card>

            <div className="mt-8">
                {currentStep === 1 && !skipSessionStep && (
                    <SessionSelection
                        courseId={courseId}
                        course={course}
                        onSelect={handleSessionSelect}
                        onPrevious={() => router.push(`/${locale}/formation/${course.slug}`)}
                    />
                )}

                {currentStep === 2 && (
                    <PaymentPlan
                        course={course}
                        cohort={selectedSession}
                        item={course ? { type: 'course', id: course.id, title: course.title } : undefined}
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

                {currentStep === 3 && !skipPayment && (
                    <PaymentProcess
                        course={course}
                        cohort={selectedSession}
                        plan={selectedPlan}
                        purchaseMode={purchaseMode}
                        seats={seats}
                        organizationId={orgId ?? undefined}
                        onSuccess={handlePaymentSuccess}
                        onFailure={handlePaymentFailure}
                        onPrevious={handlePrevious}
                    />
                )}

                {skipPayment && enrollingFree && currentStep !== 4 && (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                            <p>Finalisation de votre inscription...</p>
                        </div>
                    </div>
                )}

                {currentStep === 4 && (
                    <PaymentConfirmation
                        status={paymentStatus}
                        course={course}
                        session={selectedSession}
                        cohort={selectedSession} // pass as cohort too for flexibility
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
                onSuccess={handleAuthSuccess}
                title="Connexion requise"
                description={skipPayment
                    ? "Connectez-vous pour finaliser votre inscription gratuite."
                    : "Connectez-vous pour continuer votre inscription."}
            />
        </div>
    );
}
