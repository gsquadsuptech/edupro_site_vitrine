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

interface PaymentPlanProps {
    course: any;
    session?: any;
    cohort?: any;
    onSelect: (plan: any) => void;
    onPrevious?: () => void;
}

export const PaymentPlan = ({
    course,
    cohort,
    onSelect,
    onPrevious,
}: PaymentPlanProps) => {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

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

        // Cas par défaut
        return {};
    };

    // Parser les modes de paiement du cours (nous utiliserons toujours ceux du cours)
    const coursePricingModes = parsePricingModes(course?.pricing_modes);
    const cohortPricingModes = parsePricingModes(cohort?.pricing_modes);

    // IMPORTANT: Forcer l'utilisation des modes de paiement du cours si au moins l'un d'eux est disponible
    const hasCoursePricingModes =
        coursePricingModes &&
        (coursePricingModes.oneTime ||
            coursePricingModes.one_time ||
            coursePricingModes.installments ||
            coursePricingModes.subscription ||
            coursePricingModes.registration_monthly);

    const availableModes = {
        oneTime: hasCoursePricingModes
            ? coursePricingModes.oneTime || coursePricingModes.one_time || false
            : cohortPricingModes.oneTime || cohortPricingModes.one_time || false,
        installments: hasCoursePricingModes
            ? coursePricingModes.installments || false
            : cohortPricingModes.installments || false,
        subscription: hasCoursePricingModes
            ? coursePricingModes.subscription || false
            : cohortPricingModes.subscription || false,
        registrationMonthly: hasCoursePricingModes
            ? coursePricingModes.registration_monthly || false
            : cohortPricingModes.registration_monthly || false,
    };

    // Si aucun mode n'est détecté, créer au moins un mode par défaut si le cours a un prix
    if (
        !Object.values(availableModes).some(Boolean) &&
        parseFloat(course?.one_time_price || "0") > 0
    ) {
        availableModes.oneTime = true;
    }

    // Calcul des informations pour l'affichage
    const isUsingCoursePrice =
        (cohort && cohort.use_course_price !== false) || hasCoursePricingModes;

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
        ? course?.installments || []
        : cohort?.installments || [];

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
        setSelectedPlan(planType);
        onSelect({
            type: planType,
            details: planDetails,
        });
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
                                        {formatPrice(discountedPrice)}
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
                                        {installments.map((installment: any, index: number) => (
                                            <div
                                                key={index}
                                                className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-md"
                                            >
                                                <span className="text-sm">Versement {index + 1}</span>
                                                <div className="flex items-center">
                                                    <span className="font-medium">
                                                        {formatPrice(parseFloat(installment.amount || 0))}
                                                    </span>
                                                    {index === 0 && (
                                                        <Badge
                                                            className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100"
                                                            variant="outline"
                                                        >
                                                            Maintenant
                                                        </Badge>
                                                    )}
                                                </div>
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
        </div>
    );
};
