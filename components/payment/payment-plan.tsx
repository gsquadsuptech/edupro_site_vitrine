"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CheckIcon, Info } from "lucide-react"; // Changed from @radix-ui/react-icons for consistency if needed, but keeping CheckIcon
import {
    CreditCardIcon,
    CalendarIcon,
    ArrowRightIcon,
    PercentIcon, // Replaced BadgePercentIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/pages/auth/login-form";
import { RegisterForm } from "@/components/pages/auth/register-form";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";

interface PaymentPlanProps {
    course: any;
    session?: any;
    cohort?: any;
    onSelect: (plan: any) => void;
    onPrevious?: () => void;
}

export const PaymentPlan = ({
    course,
    cohort: propCohort,
    session,
    onSelect,
    onPrevious,
}: PaymentPlanProps) => {
    const { isAuthenticated } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authTab, setAuthTab] = useState<"login" | "register">("login");
    const [pendingPlan, setPendingPlan] = useState<{ type: string, details: any } | null>(null);

    // Unifier cohort et session car ils sont utilisés de manière interchangeable
    const cohort = propCohort || session;

    // Fonction pour parser les modes de paiement qui peuvent être des chaînes JSON ou des objets
    const parsePricingModes = (pricingModes: any) => {
        if (!pricingModes) return {};

        // Si c'est déjà un objet, le retourner tel quel
        if (typeof pricingModes === "object" && !Array.isArray(pricingModes)) {
            return pricingModes;
        }

        // Si c'est une chaîne, essayer de la parser en JSON
        if (typeof pricingModes === "string") {
            try {
                return JSON.parse(pricingModes);
            } catch (e) {
                console.error("Erreur lors du parsing des modes de paiement:", e);
                return {};
            }
        }

        return {};
    };

    const parseInstallments = (installments: any) => {
        if (Array.isArray(installments)) return installments;
        if (typeof installments === "string") {
            try {
                return JSON.parse(installments);
            } catch (e) {
                console.error("Erreur lors du parsing des échelonnements:", e);
                return [];
            }
        }
        return [];
    };

    // Parser les modes de paiement
    const coursePricingModes = parsePricingModes(course?.pricing_modes);
    const cohortPricingModes = parsePricingModes(cohort?.pricing_modes);

    // Déterminer quel mode de tarification utiliser
    // Si une cohorte est sélectionnée et qu'elle n'utilise pas le prix du cours, on prioritise ses réglages
    const isUsingCoursePrice = !cohort || cohort.use_course_price !== false;

    const availableModes = {
        oneTime: isUsingCoursePrice
            ? (coursePricingModes.oneTime || coursePricingModes.one_time || false)
            : (cohortPricingModes.oneTime || cohortPricingModes.one_time || false),
        installments: isUsingCoursePrice
            ? (coursePricingModes.installments || false)
            : (cohortPricingModes.installments || false),
        subscription: isUsingCoursePrice
            ? (coursePricingModes.subscription || false)
            : (cohortPricingModes.subscription || false),
        registrationMonthly: isUsingCoursePrice
            ? (coursePricingModes.registration_monthly || coursePricingModes.registrationMonthly || false)
            : (cohortPricingModes.registration_monthly || cohortPricingModes.registrationMonthly || false),
    };

    // Si aucun mode n'est détecté, créer au moins un mode par défaut
    if (!Object.values(availableModes).some(Boolean)) {
        availableModes.oneTime = true;
    }

    const oneTimePrice = isUsingCoursePrice
        ? parseFloat(course?.one_time_price || "0")
        : parseFloat(cohort?.one_time_price || "0");

    const oneTimeDiscount = isUsingCoursePrice
        ? parseFloat(course?.one_time_discount || "0") / 100
        : parseFloat(cohort?.one_time_discount || "0") / 100;

    const discountedPrice = oneTimePrice * (1 - oneTimeDiscount);

    const monthlyPrice = isUsingCoursePrice
        ? parseFloat(course?.monthly_price || "0")
        : parseFloat(cohort?.monthly_price || "0");

    const registrationFee = isUsingCoursePrice
        ? parseFloat(course?.registration_fee || "0")
        : parseFloat(cohort?.registration_fee || "0");

    const monthlyFee = isUsingCoursePrice
        ? parseFloat(course?.monthly_fee || "0")
        : parseFloat(cohort?.monthly_fee || "0");

    const installments = isUsingCoursePrice
        ? parseInstallments(course?.installments)
        : parseInstallments(cohort?.installments);

    const totalInstallmentAmount = Array.isArray(installments)
        ? installments.reduce(
            (acc: number, item: any) => acc + parseFloat(item.amount || 0),
            0
        )
        : 0;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
    };

    const handlePlanSelect = (planType: string, planDetails: any) => {
        if (!isAuthenticated) {
            setPendingPlan({ type: planType, details: planDetails });
            setAuthModalOpen(true);
            return;
        }

        setSelectedPlan(planType);
        onSelect({
            type: planType,
            details: planDetails,
        });
    };

    const handleOAuthSignIn = async (provider: 'google' | 'facebook') => {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: window.location.href,
            },
        });
        if (error) {
            console.error("OAuth error:", error);
        }
    };

    const handleAuthSuccess = () => {
        setAuthModalOpen(false);
        if (pendingPlan) {
            setSelectedPlan(pendingPlan.type);
            onSelect({
                type: pendingPlan.type,
                details: pendingPlan.details,
            });
            setPendingPlan(null);
        }
    };

    const handlePrevious = () => {
        if (onPrevious) {
            onPrevious();
        }
    };

    if (!Object.values(availableModes).some(Boolean)) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Options de paiement non disponibles</CardTitle>
                    <CardDescription>
                        Ce cours ne propose actuellement pas d'options de paiement. Veuillez
                        contacter l'administrateur pour plus d'informations.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button onClick={handlePrevious} variant="outline" className="w-full">
                        Retour
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                    Choisissez votre plan de paiement
                </h2>
                {onPrevious && (
                    <Button onClick={handlePrevious} variant="outline">
                        Retour
                    </Button>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Option de paiement unique */}
                {availableModes.oneTime && (
                    <Card
                        className={`cursor-pointer transition-shadow hover:shadow-md ${selectedPlan === "oneTime"
                            ? "border-primary ring-2 ring-primary/20"
                            : ""
                            }`}
                        onClick={() =>
                            handlePlanSelect("oneTime", {
                                price: discountedPrice,
                                originalPrice: oneTimePrice,
                            })
                        }
                    >
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <CreditCardIcon className="h-4 w-4 text-primary" />
                                    <CardTitle className="text-lg">Paiement unique</CardTitle>
                                </div>
                                {selectedPlan === "oneTime" && (
                                    <CheckIcon className="h-5 w-5 text-primary" />
                                )}
                            </div>
                            <CardDescription>Payez la totalité en une fois</CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary">
                                        {discountedPrice > 0 ? formatPrice(discountedPrice) : "Gratuit"}
                                    </div>

                                    {oneTimeDiscount > 0 && (
                                        <div className="mt-1 flex items-center justify-center">
                                            <span className="text-sm line-through text-muted-foreground mr-2">
                                                {formatPrice(oneTimePrice)}
                                            </span>
                                            <Badge
                                                className="bg-green-100 text-green-800 hover:bg-green-100"
                                                variant="outline"
                                            >
                                                <PercentIcon className="h-3 w-3 mr-1" />
                                                {Math.round(oneTimeDiscount * 100)}% de réduction
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                        <span className="text-sm">Économie avec la réduction</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                        <span className="text-sm">Pas de paiements récurrents</span>
                                    </li>
                                </ul>
                            </div>
                        </CardContent>

                        <CardFooter>
                            <Button
                                className="w-full"
                                variant={selectedPlan === "oneTime" ? "default" : "outline"}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePlanSelect("oneTime", {
                                        price: discountedPrice,
                                        originalPrice: oneTimePrice,
                                    });
                                }}
                            >
                                Choisir ce plan
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {/* Option de paiement échelonné */}
                {availableModes.installments &&
                    Array.isArray(installments) &&
                    installments.length > 0 && (
                        <Card
                            className={`cursor-pointer transition-shadow hover:shadow-md ${selectedPlan === "installments"
                                ? "border-primary ring-2 ring-primary/20"
                                : ""
                                }`}
                            onClick={() =>
                                handlePlanSelect("installments", {
                                    installments,
                                    totalAmount: totalInstallmentAmount,
                                })
                            }
                        >
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <CalendarIcon className="h-4 w-4 text-primary" />
                                        <CardTitle className="text-lg">
                                            Paiement échelonné
                                        </CardTitle>
                                    </div>
                                    {selectedPlan === "installments" && (
                                        <CheckIcon className="h-5 w-5 text-primary" />
                                    )}
                                </div>
                                <CardDescription>Payez en plusieurs versements</CardDescription>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-primary">
                                            {formatPrice(totalInstallmentAmount)}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            en {installments.length} versements
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {installments.map((inst: any, index: number) => (
                                            <div
                                                key={index}
                                                className="flex flex-col gap-1 p-3 rounded-lg border border-border/50 bg-muted/30 transition-colors hover:bg-muted/50"
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                                                        Versement {index + 1}
                                                    </div>
                                                    <span className="text-sm font-bold whitespace-nowrap">
                                                        {formatPrice(parseFloat(inst.amount))}
                                                    </span>
                                                </div>
                                                {index === 0 && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[9px] uppercase tracking-wider h-5 px-2 bg-primary/10 text-primary border-primary/20 font-bold self-start"
                                                    >
                                                        Maintenant
                                                    </Badge>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    className="w-full"
                                    variant={
                                        selectedPlan === "installments" ? "default" : "outline"
                                    }
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePlanSelect("installments", {
                                            installments,
                                            totalAmount: totalInstallmentAmount,
                                        });
                                    }}
                                >
                                    Choisir ce plan
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                {/* Option d'abonnement mensuel */}
                {availableModes.subscription && (
                    <Card
                        className={`cursor-pointer transition-shadow hover:shadow-md ${selectedPlan === "subscription"
                            ? "border-primary ring-2 ring-primary/20"
                            : ""
                            }`}
                        onClick={() => handlePlanSelect("subscription", { monthlyPrice })}
                    >
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <ArrowRightIcon className="h-4 w-4 text-primary" />
                                    <CardTitle className="text-lg">Abonnement mensuel</CardTitle>
                                </div>
                                {selectedPlan === "subscription" && (
                                    <CheckIcon className="h-5 w-5 text-primary" />
                                )}
                            </div>
                            <CardDescription>Payez chaque mois</CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary">
                                        {formatPrice(monthlyPrice)}
                                    </div>
                                    <div className="text-sm text-muted-foreground">par mois</div>
                                </div>

                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                        <span className="text-sm">
                                            Paiements mensuels flexibles
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                        <span className="text-sm">Annulation à tout moment</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Info className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                                        <span className="text-sm">Renouvellement automatique</span>
                                    </li>
                                </ul>
                            </div>
                        </CardContent>

                        <CardFooter>
                            <Button
                                className="w-full"
                                variant={
                                    selectedPlan === "subscription" ? "default" : "outline"
                                }
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePlanSelect("subscription", { monthlyPrice });
                                }}
                            >
                                Choisir ce plan
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {/* Option d'abonnement avec frais d'inscription */}
                {availableModes.registrationMonthly && (
                    <Card
                        className={`cursor-pointer transition-shadow hover:shadow-md ${selectedPlan === "registrationMonthly"
                            ? "border-primary ring-2 ring-primary/20"
                            : ""
                            }`}
                        onClick={() =>
                            handlePlanSelect("registrationMonthly", {
                                registrationFee,
                                monthlyFee,
                            })
                        }
                    >
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <ArrowRightIcon className="h-4 w-4 text-primary" />
                                    <CardTitle className="text-lg">
                                        Inscription + Mensualités
                                    </CardTitle>
                                </div>
                                {selectedPlan === "registrationMonthly" && (
                                    <CheckIcon className="h-5 w-5 text-primary" />
                                )}
                            </div>
                            <CardDescription>
                                Frais d'inscription puis mensualités
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-md">
                                        <span className="text-sm">Frais d'inscription</span>
                                        <div className="flex items-center">
                                            <span className="font-medium">
                                                {formatPrice(registrationFee)}
                                            </span>
                                            <Badge
                                                className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100"
                                                variant="outline"
                                            >
                                                Maintenant
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-md">
                                        <span className="text-sm">Mensualité</span>
                                        <span className="font-medium">
                                            {formatPrice(monthlyFee)}/mois
                                        </span>
                                    </div>
                                </div>

                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                        <span className="text-sm">Frais d'inscription réduits</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                        <span className="text-sm">Mensualités abordables</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Info className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                                        <span className="text-sm">Engagement minimum requis</span>
                                    </li>
                                </ul>
                            </div>
                        </CardContent>

                        <CardFooter>
                            <Button
                                className="w-full"
                                variant={
                                    selectedPlan === "registrationMonthly" ? "default" : "outline"
                                }
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePlanSelect("registrationMonthly", {
                                        registrationFee,
                                        monthlyFee,
                                    });
                                }}
                            >
                                Choisir ce plan
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </div>

            {/* Modal d'authentification */}
            <Dialog open={authModalOpen} onOpenChange={setAuthModalOpen}>
                <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Connexion requise</DialogTitle>
                        <DialogDescription>
                            Connectez-vous pour continuer votre inscription.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Email/password form */}
                    <Tabs value={authTab} onValueChange={(v) => setAuthTab(v as any)} className="w-full mt-2">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Connexion</TabsTrigger>
                            <TabsTrigger value="register">Inscription</TabsTrigger>
                        </TabsList>
                        <div className="mt-3">
                            {authTab === 'login' ? (
                                <LoginForm
                                    onSuccess={handleAuthSuccess}
                                    onRegisterClick={() => setAuthTab("register")}
                                    compact
                                />
                            ) : (
                                <RegisterForm
                                    onSuccess={handleAuthSuccess}
                                    onLoginClick={() => setAuthTab("login")}
                                    compact
                                />
                            )}
                        </div>
                    </Tabs>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-1">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-xs text-muted-foreground">Ou continuer avec</span>
                        <div className="h-px flex-1 bg-border" />
                    </div>

                    {/* Social login at the bottom */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            type="button"
                            className="gap-2 bg-transparent hover:bg-muted"
                            onClick={() => handleOAuthSignIn('google')}
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </Button>
                        <Button
                            variant="outline"
                            type="button"
                            className="gap-2 bg-transparent hover:bg-muted"
                            onClick={() => handleOAuthSignIn('facebook')}
                        >
                            <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
