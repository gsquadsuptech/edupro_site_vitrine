'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, ClockIcon, UsersIcon, XCircle } from 'lucide-react';
import { CourseService, getCohortAvailability } from '@/services/course-service';
import { Cohort, Course } from '@/lib/supabase/types';
import { WaitlistDialog } from '@/components/marketing/sections/formation/waitlist-dialog';

interface SessionSelectionProps {
    courseId: string;
    course?: Course;
    onSelect: (session: any) => void;
    onPrevious?: () => void;
}

export const SessionSelection = ({ courseId, course, onSelect, onPrevious }: SessionSelectionProps) => {
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState<Cohort[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const fetchedCohorts = await CourseService.getCohortsByCourseId(courseId);
                setSessions(fetchedCohorts);
            } catch (error) {
                console.error("Failed to fetch cohorts", error);
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchSessions();
        }
    }, [courseId]);

    const handleSelect = (session: Cohort) => {
        setSelectedSessionId(session.id);
        onSelect(session);
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <p>Chargement des sessions disponibles...</p>
            </div>
        );
    }

    if (sessions.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Aucune session disponible</CardTitle>
                    <CardDescription>
                        Il n'y a actuellement aucune session ouverte pour ce cours.
                        Veuillez vérifier ultérieurement ou contacter l'instructeur.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Choisissez votre session</h2>

            <div className="grid gap-4 md:grid-cols-2">
                {sessions.map((session) => {
                    const isSelected = selectedSessionId === session.id;
                    const { isOpen, isFull, isDeadlinePassed, remainingPlaces } = getCohortAvailability(session);
                    const isDisabled = !isOpen;
                    const isFreeCourse = course?.access_type === 'free';

                    return (
                        <Card
                            key={session.id}
                            className={`transition-all ${
                                isDisabled
                                    ? 'opacity-70 grayscale-[30%] bg-muted/40 border-dashed border-muted-foreground/30 cursor-not-allowed'
                                    : `cursor-pointer hover:shadow-md ${isSelected ? 'border-primary ring-2 ring-primary/20 shadow-lg' : ''}`
                            }`}
                            onClick={() => !isDisabled && handleSelect(session)}
                        >
                            <CardHeader>
                                <div className="flex justify-between items-start gap-2">
                                    <CardTitle className={isDisabled ? 'text-muted-foreground' : ''}>{session.name}</CardTitle>
                                    {isFull ? (
                                        <Badge variant="destructive" className="flex items-center gap-1 shrink-0">
                                            <XCircle className="h-3 w-3" />
                                            Complet
                                        </Badge>
                                    ) : isDeadlinePassed ? (
                                        <Badge variant="secondary" className="flex items-center gap-1 shrink-0 bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                            <XCircle className="h-3 w-3" />
                                            Fermé
                                        </Badge>
                                    ) : (
                                        <Badge variant={isSelected ? "default" : "outline"} className="shrink-0">
                                            {isSelected ? 'Sélectionnée' : 'Disponible'}
                                        </Badge>
                                    )}
                                </div>
                                <CardDescription>{session.description || "Aucune description disponible"}</CardDescription>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center text-sm">
                                        <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                                        <div>
                                            <span className="font-medium">Dates: </span>
                                            <span>Du {formatDate(session.start_date)} au {formatDate(session.end_date)}</span>
                                        </div>
                                    </div>

                                    {session.registration_deadline && (
                                        <div className="flex items-center text-sm">
                                            <ClockIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                                            <div>
                                                <span className="font-medium">Inscription jusqu'au: </span>
                                                <span className={isDeadlinePassed ? 'text-red-500 line-through' : ''}>
                                                    {formatDate(session.registration_deadline)}
                                                </span>
                                                {isDeadlinePassed && <span className="text-red-500 ml-2 text-xs">(dépassée)</span>}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center text-sm">
                                        <UsersIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                                        <span>
                                            {session.max_students != null ? (
                                                <span className={`font-medium ${isFull ? 'text-red-500' : ''}`}>
                                                    {session.current_students_count}/{session.max_students} inscrits
                                                    {remainingPlaces != null && remainingPlaces > 0 && (
                                                        <span className="text-muted-foreground font-normal"> ({remainingPlaces} place{remainingPlaces > 1 ? 's' : ''} restante{remainingPlaces > 1 ? 's' : ''})</span>
                                                    )}
                                                </span>
                                            ) : (
                                                <span className="font-medium">{session.current_students_count} inscrits</span>
                                            )}
                                        </span>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-border">
                                        <div className="text-sm font-medium text-muted-foreground mb-1">Prix de la session</div>
                                        <div className="text-xl font-bold text-primary">
                                            {(() => {
                                                const isFree = course?.access_type === 'free';
                                                if (isFree) return 'Gratuit';
                                                const price = session.one_time_price
                                                    ? Number(session.one_time_price)
                                                    : Number(course?.one_time_price ?? course?.price ?? 0);
                                                return price >= 1
                                                    ? `${price.toLocaleString()} FCFA`
                                                    : 'Gratuit';
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter>
                                {isDisabled && course ? (
                                    <div className="w-full" onClick={(e) => e.stopPropagation()}>
                                        <WaitlistDialog
                                            courseId={course.id}
                                            courseSlug={course.slug}
                                            courseTitle={course.title}
                                            cohortId={isFull && session.enable_waitlist ? session.id : undefined}
                                        />
                                    </div>
                                ) : (
                                    <Button
                                        className="w-full"
                                        variant={isSelected ? "default" : "outline"}
                                        disabled={isDisabled}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isDisabled) handleSelect(session);
                                        }}
                                    >
                                        {isSelected
                                            ? 'Session sélectionnée'
                                            : isFreeCourse
                                                ? "S'inscrire à cette session"
                                                : 'Sélectionner cette session'}
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            {
                onPrevious && (
                    <div className="mt-6 flex justify-start">
                        <Button
                            variant="outline"
                            onClick={onPrevious}
                            className="flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Retour
                        </Button>
                    </div>
                )
            }
        </div >
    );
};
