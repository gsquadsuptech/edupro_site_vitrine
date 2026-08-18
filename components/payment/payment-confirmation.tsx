'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon, XCircleIcon, BookOpenIcon, ClockIcon, CalendarIcon, UsersIcon } from 'lucide-react';

interface PaymentConfirmationProps {
    status: 'success' | 'failed' | 'pending';
    course: any;
    /** Type de l'item acheté (par défaut 'course' pour rétro-compat). */
    itemType?: 'course' | 'learning_path';
    session?: any;
    cohort?: any;
    plan: any;
    paymentData?: any;
    purchaseMode?: 'individual' | 'team';
    onAccessCourse: () => void;
    /** Si fourni en cas d'échec, remplace le simple reload(). Permet de
     *  reprendre le flow de paiement (typiquement après un cancel/échec
     *  côté passerelle). */
    onRetry?: () => void;
    /** Si fourni, affiche un CTA secondaire « Essayer une autre méthode »
     *  pour basculer sur la passerelle de secours (PayTech) après un
     *  cancel/échec PayDunya. */
    onRetryWithOtherGateway?: () => void;
    /** Nom de la passerelle d'origine, affiché dans le message d'échec. */
    originGateway?: string;
}

export const PaymentConfirmation = ({
    status,
    course,
    itemType = 'course',
    session,
    cohort,
    plan,
    paymentData,
    purchaseMode = 'individual',
    onAccessCourse,
    onRetry,
    onRetryWithOtherGateway,
    originGateway,
}: PaymentConfirmationProps) => {

    const isTeamPurchase = purchaseMode === 'team';

    const sessionData = cohort || session;
    const isLearningPath = itemType === 'learning_path';
    const itemLabel = isLearningPath ? 'Parcours' : 'Cours';
    const itemLabelLower = isLearningPath ? 'parcours' : 'cours';

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
        const otherGatewayLabel = originGateway && originGateway.toLowerCase() === 'paydunya'
            ? 'PayTech'
            : 'une autre méthode';
        return (
            <Card className="border-red-200">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <XCircleIcon className="h-16 w-16 text-red-500" />
                    </div>
                    <CardTitle className="text-xl text-red-700">Échec du paiement</CardTitle>
                    <CardDescription>
                        {originGateway
                            ? `Le paiement via ${originGateway} n'a pas abouti.`
                            : "Votre paiement n'a pas pu être traité."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-red-50 p-4 rounded-md mb-4">
                        <p className="text-sm text-red-700">
                            Vous pouvez réessayer immédiatement
                            {onRetryWithOtherGateway ? `, ou tenter avec ${otherGatewayLabel}` : ''}.
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={onRetry ?? (() => window.location.reload())}
                    >
                        Réessayer
                    </Button>
                    {onRetryWithOtherGateway && (
                        <Button className="w-full" onClick={onRetryWithOtherGateway}>
                            Réessayer avec {otherGatewayLabel}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        );
    }

    const isFreeCourse =
        course?.access_type === 'free' ||
        (Number(course?.one_time_price ?? course?.price ?? 0) <= 0);

    return (
        <Card className="border-green-200">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <CheckCircleIcon className="h-16 w-16 text-green-500" />
                </div>
                <CardTitle className="text-xl text-green-700">
                    {isTeamPurchase
                        ? 'Achat groupé confirmé'
                        : isFreeCourse ? 'Inscription confirmée' : 'Paiement réussi'}
                </CardTitle>
                <CardDescription>
                    {isTeamPurchase
                        ? 'Vos sièges ont été crédités à votre organisation.'
                        : isFreeCourse
                            ? 'Félicitations ! Votre inscription a été enregistrée.'
                            : 'Félicitations ! Votre paiement a été accepté'}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="bg-green-50 p-4 rounded-md">
                    <p className="text-sm text-green-700">
                        {isTeamPurchase
                            ? `Vos sièges pour ce ${itemLabelLower} sont disponibles — vous n'êtes pas inscrit vous-même.`
                            : isFreeCourse
                                ? `Vous avez maintenant accès à ce ${itemLabelLower}.`
                                : 'Nous vous remercions pour votre achat.'}
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="font-medium text-lg">Récapitulatif</h3>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-sm text-muted-foreground">{itemLabel}</span>
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

                        {!isFreeCourse && (
                            <>
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="text-sm text-muted-foreground">Plan de paiement</span>
                                    <span className="font-medium">
                                        {
                                            plan.type === 'oneTime' ? 'Paiement unique' :
                                                plan.type === 'installments' ? 'Paiement échelonné' :
                                                    plan.type === 'subscription' ? 'Abonnement mensuel' :
                                                        plan.type === 'registrationMonthly' ? 'Inscription + Mensualités' :
                                                            'Standard (via redirect)'
                                        }
                                    </span>
                                </div>

                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="text-sm text-muted-foreground">Montant total</span>
                                    <span className="font-medium">{formatPrice(getTotalAmount() || paymentData?.amount || 0)}</span>
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
                            </>
                        )}

                        {isFreeCourse && (
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-sm text-muted-foreground">Tarif</span>
                                <span className="font-medium text-green-600">Gratuit</span>
                            </div>
                        )}

                        {isTeamPurchase && paymentData?.seats && (
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-sm text-muted-foreground">Sièges achetés</span>
                                <span className="font-medium">{paymentData.seats}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-md flex">
                    <ClockIcon className="text-amber-500 mr-3 h-5 w-5 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-amber-700">
                            {isTeamPurchase ? 'Sièges disponibles' : `Accès au ${itemLabelLower}`}
                        </h4>
                        <p className="text-sm text-amber-600 mt-1">
                            {isTeamPurchase
                                ? "Vos sièges sont prêts. Invitez vos collaborateurs depuis votre espace admin."
                                : isLearningPath || course.format === 'auto-formation'
                                    ? "Accès immédiat."
                                    : "Vous êtes inscrit."
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
                    {isTeamPurchase ? (
                        <>
                            <UsersIcon className="mr-2 h-4 w-4" />
                            Inviter vos collaborateurs
                        </>
                    ) : (
                        <>
                            <BookOpenIcon className="mr-2 h-4 w-4" />
                            Accéder au {itemLabelLower}
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
};
