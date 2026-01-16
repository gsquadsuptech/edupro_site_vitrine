"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Stepper } from "@/components/payment/stepper";
import { SessionSelection } from "@/components/payment/session-selection";
import { PaymentPlan } from "@/components/payment/payment-plan";
import { PaymentProcess } from "@/components/payment/payment-process";
import { PaymentConfirmation } from "@/components/payment/payment-confirmation";
import { MOCK_COURSE } from "@/data/mock-formation";

export default function CheckoutPage({
    params,
}: {
    params: Promise<{ locale: string; courseId: string }>;
}) {
    const { locale, courseId } = use(params);
    const router = useRouter();

    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedSession, setSelectedSession] = useState<any>(null);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [paymentStatus, setPaymentStatus] = useState<
        "pending" | "success" | "failed"
    >("pending");
    const [paymentData, setPaymentData] = useState<any>(null);
    const [skipSessionStep, setSkipSessionStep] = useState(false);

    useEffect(() => {
        // Simulate fetching course
        setTimeout(() => {
            // In reality, search MOCK_COURSE or similar by ID. 
            // For now, we reuse MOCK_COURSE for everything or adjust title.
            setCourse({
                ...MOCK_COURSE,
                id: courseId,
                title: MOCK_COURSE.title + ` (ID: ${courseId})`
            });

            // Mock logic for skip session
            if (MOCK_COURSE.format === "auto-formation") {
                setSkipSessionStep(true);
                setCurrentStep(2);
            }

            setLoading(false);
        }, 500);
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
                router.push(`/${locale}/formation/${course?.slug || 'intelligence-artificielle-pratique'}`);
                return;
            }
            setCurrentStep(currentStep - 1);
        } else {
            router.push(`/${locale}/formation/${course?.slug || 'intelligence-artificielle-pratique'}`);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Chargement des informations du cours...</p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-2xl font-bold mb-4">Cours non trouvé</h2>
                <Button onClick={() => router.push(`/${locale}/catalogue`)}>
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
