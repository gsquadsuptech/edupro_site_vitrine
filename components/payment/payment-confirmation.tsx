'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon, XCircleIcon, BookOpenIcon, ClockIcon, CalendarIcon } from 'lucide-react';

interface PaymentConfirmationProps {
    status: 'success' | 'failed' | 'pending';
    course: any;
    session?: any;
    cohort?: any;
    plan: any;
    paymentData?: any;
    onAccessCourse: () => void;
}

export const PaymentConfirmation = ({
    status,
    course,
    session,
    cohort,
    plan,
    paymentData,
    onAccessCourse
}: PaymentConfirmationProps) => {

    const sessionData = cohort || session;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const options: Intl.DateTimeFormatOptions = {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            };
            return new Intl.DateTimeFormat('fr-FR', options).format(date);
        } catch (error) {
            return 'Date non disponible';
        }
    };

    const getTotalAmount = () => {
        switch (plan.type) {
            case 'oneTime':
                return plan.details.price;
            case 'installments':
                return plan.details.totalAmount;
            case 'subscription':
                return plan.details.monthlyPrice * 6;
            case 'registrationMonthly':
                return plan.details.registrationFee + (plan.details.monthlyFee * 6);
            default:
                return 0;
        }
    };

    const getRemainingAmount = () => {
        if (paymentData && 'remainingAmount' in paymentData) {
            return paymentData.remainingAmount;
        }

        const totalAmount = getTotalAmount();
        const paidAmount = paymentData?.amount || 0;

        return totalAmount - paidAmount;
    };

    if (status === 'failed') {
        return (
            <Card className="border-red-200">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <XCircleIcon className="h-16 w-16 text-red-500" />
                    </div>
                    <CardTitle className="text-xl text-red-700">Échec du paiement</CardTitle>
                    <CardDescription>Votre paiement n'a pas pu être traité</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-red-50 p-4 rounded-md mb-4">
                        <p className="text-sm text-red-700">
                            Une erreur simulateur est survenue.
                        </p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>Réessayer</Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="border-green-200">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <CheckCircleIcon className="h-16 w-16 text-green-500" />
                </div>
                <CardTitle className="text-xl text-green-700">Paiement réussi</CardTitle>
                <CardDescription>Félicitations ! Votre paiement a été accepté</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="bg-green-50 p-4 rounded-md">
                    <p className="text-sm text-green-700">
                        Nous vous remercions pour votre achat. C'est une simulation, aucun débit n'a été effectué.
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="font-medium text-lg">Récapitulatif financier</h3>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-sm text-muted-foreground">Cours</span>
                            <span className="font-medium">{course.title}</span>
                        </div>

                        {sessionData && (
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-sm text-muted-foreground">
                                    {cohort ? 'Cohorte' : 'Session'}
                                </span>
                                <span className="font-medium">{sessionData.name}</span>
                            </div>
                        )}

                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-sm text-muted-foreground">Plan de paiement</span>
                            <span className="font-medium">
                                {
                                    plan.type === 'oneTime' ? 'Paiement unique' :
                                        plan.type === 'installments' ? 'Paiement échelonné' :
                                            plan.type === 'subscription' ? 'Abonnement mensuel' :
                                                'Inscription + Mensualités'
                                }
                            </span>
                        </div>

                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-sm text-muted-foreground">Montant total</span>
                            <span className="font-medium">{formatPrice(getTotalAmount())}</span>
                        </div>

                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-sm text-muted-foreground">Montant payé</span>
                            <span className="font-medium text-green-600">{formatPrice(paymentData?.amount || 0)}</span>
                        </div>

                        {paymentData?.reference && (
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-sm text-muted-foreground">Référence de transaction</span>
                                <span className="font-medium">{paymentData.reference}</span>
                            </div>
                        )}

                        {paymentData?.created_at && (
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-sm text-muted-foreground">Date de paiement</span>
                                <span className="font-medium">{formatDate(paymentData.created_at)}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-md flex">
                    <ClockIcon className="text-amber-500 mr-3 h-5 w-5 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-amber-700">Accès au cours</h4>
                        <p className="text-sm text-amber-600 mt-1">
                            {course.format === 'auto-formation'
                                ? "Accès immédiat (Simulation)."
                                : "Vous êtes inscrit (Simulation)."
                            }
                        </p>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
                <Button
                    className="w-full"
                    onClick={onAccessCourse}
                >
                    <BookOpenIcon className="mr-2 h-4 w-4" />
                    Accéder au cours
                </Button>
            </CardFooter>
        </Card>
    );
};
