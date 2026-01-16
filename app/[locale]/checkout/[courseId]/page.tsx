"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
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

    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(2); // Start at step 2 (Plan) by default
    const [selectedSession, setSelectedSession] = useState<any>(null);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [paymentStatus, setPaymentStatus] = useState<
        "pending" | "success" | "failed"
    >("pending");
    const [paymentData, setPaymentData] = useState<any>(null);
    const [skipSessionStep, setSkipSessionStep] = useState(true); // Skip session as we don't have real sessions yet

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const fetchedCourse = await CourseService.getCourseById(courseId);

                if (fetchedCourse) {
                    // Adapt Course to PaymentPlan expectations
                    const adaptedCourse = {
                        ...fetchedCourse,
                        one_time_price: fetchedCourse.price,
                        // inferred pricing modes
                        pricing_modes: {
                            oneTime: (fetchedCourse.price || 0) > 0,
                            // Add other modes if you can infer them or fetch them
                        }
                    };
                    setCourse(adaptedCourse);
                }
            } catch (error) {
                console.error("Failed to fetch course", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    const handleSessionSelect = (session: any) => {
        setSelectedSession(session);
        setCurrentStep(2);
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

    const handleAccessCourse = () => {
        // Redirect to dashboard or home
        router.push(`/${locale}`);
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            if (currentStep === 2 && skipSessionStep) {
                router.push(`/${locale}/formation/${course?.slug}`);
                return;
            }
            setCurrentStep(currentStep - 1);
        } else {
            router.push(`/${locale}/formation/${course?.slug}`);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p>Chargement des informations du cours...</p>
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
                            { id: 2, label: "Plan de paiement" },
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
                        session={selectedSession}
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
