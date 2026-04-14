"use client";

import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stepper } from "@/components/payment/stepper";
import { SessionSelection } from "@/components/payment/session-selection";
import { PaymentPlan } from "@/components/payment/payment-plan";
import { PaymentProcess } from "@/components/payment/payment-process";
import { PaymentConfirmation } from "@/components/payment/payment-confirmation";
import { CourseService } from "@/services/course-service";


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

    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);
    const [currentStep, setCurrentStep] = useState(2); // Start at step 2 (Plan) by default
    const [selectedSession, setSelectedSession] = useState<any>(null);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [skipPaymentPlan, setSkipPaymentPlan] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<
        "pending" | "success" | "failed"
    >("pending");
    const [paymentData, setPaymentData] = useState<any>(null);
    const [skipSessionStep, setSkipSessionStep] = useState(true); // Default to true, enable if cohorts found

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

                // Handle cohort selection
                if (fetchedCohorts && fetchedCohorts.length > 1) {
                    setSkipSessionStep(false);
                    if (isFree) {
                        setSkipPaymentPlan(true);
                        setSelectedPlan({ type: 'oneTime', details: { price: 0, originalPrice: 0 } });
                    }
                    setCurrentStep(1);
                } else if (fetchedCohorts && fetchedCohorts.length === 1) {
                    setSkipSessionStep(true);
                    setSelectedSession(fetchedCohorts[0]);
                    if (isFree) {
                        setSkipPaymentPlan(true);
                        setSelectedPlan({ type: 'oneTime', details: { price: 0, originalPrice: 0 } });
                        setCurrentStep(3); // Skip to payment/confirmation
                    } else {
                        setCurrentStep(2);
                    }
                } else {
                    setSkipSessionStep(true);
                    if (isFree) {
                        setSkipPaymentPlan(true);
                        setSelectedPlan({ type: 'oneTime', details: { price: 0, originalPrice: 0 } });
                        setCurrentStep(3); // Skip to payment/confirmation
                    } else {
                        setCurrentStep(2);
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

    const handleSessionSelect = (session: any) => {
        setSelectedSession(session);
        if (skipPaymentPlan) {
            setCurrentStep(3); // Skip payment plan for free courses
        } else {
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

    const handlePaymentFailure = (error: any) => {
        setPaymentStatus("failed");
        // Could set error data here
    };

    const handleAccessCourse = async () => {
        try {
            const { createClient } = await import("@/lib/supabase/client");
            const { getAppUrl } = await import("@/lib/utils");
            
            const supabase = createClient();
            const { data } = await supabase.auth.getSession();
            const token = data.session?.access_token;
            
            window.location.href = getAppUrl('/dashboard/courses', token);
        } catch (error) {
            console.error("Erreur de redirection:", error);
            // Fallback if import fails
            window.location.href = `${process.env.NEXT_PUBLIC_SAAS_URL || 'https://app.edupro.africa'}/dashboard/courses`;
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
                            { id: 3, label: "Paiement" },
                            { id: 4, label: "Confirmation" },
                        ]}
                    />
                </CardContent>
            </Card>

            <div className="mt-8">
                {currentStep === 1 && !skipSessionStep && (
                    <SessionSelection
                        courseId={courseId}
                        onSelect={handleSessionSelect}
                        onPrevious={() => router.push(`/${locale}/formation/${course.slug}`)}
                    />
                )}

                {currentStep === 2 && (
                    <PaymentPlan
                        course={course}
                        cohort={selectedSession}
                        onSelect={handlePlanSelect}
                        onPrevious={handlePrevious}
                    />
                )}

                {currentStep === 3 && (
                    <PaymentProcess
                        course={course}
                        cohort={selectedSession}
                        plan={selectedPlan}
                        onSuccess={handlePaymentSuccess}
                        onFailure={handlePaymentFailure}
                        onPrevious={handlePrevious}
                    />
                )}

                {currentStep === 4 && (
                    <PaymentConfirmation
                        status={paymentStatus}
                        course={course}
                        session={selectedSession}
                        cohort={selectedSession} // pass as cohort too for flexibility
                        plan={selectedPlan}
                        paymentData={paymentData}
                        onAccessCourse={handleAccessCourse}
                    />
                )}
            </div>
        </div>
    );
}
