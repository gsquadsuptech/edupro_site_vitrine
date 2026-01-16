'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, ClockIcon, UsersIcon } from 'lucide-react';

interface SessionSelectionProps {
    courseId: string;
    onSelect: (session: any) => void;
    onPrevious?: () => void;
}

import { CourseService } from '@/services/course-service';

export const SessionSelection = ({ courseId, onSelect, onPrevious }: SessionSelectionProps) => {
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState<any[]>([]);
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

    const handleSelect = (session: any) => {
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
                    const placesRestantes = session.max_participants ?
                        session.max_participants - (session.students_count?.[0]?.count || 0) :
                        null;

                    return (
                        <Card
                            key={session.id}
                            className={`cursor-pointer transition-shadow hover:shadow-md ${isSelected ? 'border-primary ring-2 ring-primary/20' : ''}`}
                            onClick={() => handleSelect(session)}
                        >
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle>{session.name}</CardTitle>
                                    <Badge variant={isSelected ? "default" : "outline"}>
                                        {isSelected ? 'Sélectionnée' : 'Disponible'}
                                    </Badge>
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

                                    <div className="flex items-center text-sm">
                                        <ClockIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                                        <div>
                                            <span className="font-medium">Inscription jusqu'au: </span>
                                            <span>{formatDate(session.registration_deadline)}</span>
                                        </div>
                                    </div>

                                    {placesRestantes !== null && (
                                        <div className="flex items-center text-sm">
                                            <UsersIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                                            <span>
                                                <span className="font-medium">{placesRestantes} place{placesRestantes > 1 ? 's' : ''} restante{placesRestantes > 1 ? 's' : ''}</span>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    className="w-full"
                                    variant={isSelected ? "default" : "outline"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelect(session);
                                    }}
                                >
                                    {isSelected ? 'Session sélectionnée' : 'Sélectionner cette session'}
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            {onPrevious && (
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
            )}
        </div>
    );
};
