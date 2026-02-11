"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Bell, Loader2, Check } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { CourseService } from "@/services/course-service"
import { useToast } from "@/hooks/use-toast"
import { LoginForm } from "@/components/pages/auth/login-form"
import { RegisterForm } from "@/components/pages/auth/register-form"

interface WaitlistDialogProps {
    courseId: string
    courseSlug: string
    courseTitle: string
    cohortId?: string
}

export function WaitlistDialog({ courseId, courseSlug, courseTitle, cohortId }: WaitlistDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isJoined, setIsJoined] = useState(false)
    const [authView, setAuthView] = useState<'none' | 'login' | 'register'>('none')

    const { user, isAuthenticated } = useAuth()
    const { toast } = useToast()

    // Check for pending waitlist join after reload
    useEffect(() => {
        const checkPendingJoin = async () => {
            const pendingCourseId = sessionStorage.getItem('pendingWaitlistJoin')

            if (pendingCourseId === courseId && isAuthenticated && user) {
                // Clear immediately to prevent loop
                sessionStorage.removeItem('pendingWaitlistJoin')
                await addToWaitlist()
            }
        }

        checkPendingJoin()
    }, [isAuthenticated, user, courseId])

    const handleWaitlistClick = async (e: React.MouseEvent) => {
        if (isJoined) return; // Already joined

        if (!isAuthenticated) {
            e.preventDefault()
            setAuthView('login')
            setOpen(true)
        } else {
            // Authenticated: Direct add
            // We prevent default to handle it nicely with feedback
            e.preventDefault()
            await addToWaitlist()
        }
    }

    const addToWaitlist = async () => {
        if (!user) return

        setLoading(true)
        try {
            const { success, error } = await CourseService.addToWaitlist(courseId, user.id)
            if (success) {
                setIsJoined(true)
                toast({
                    title: "Inscrit sur liste d'attente",
                    description: "Vous serez prévenu dès l'ouverture des inscriptions.",
                    variant: "default",
                })
                // We don't necessarily need to open the dialog if it's a direct action,
                // but the user wants "En attente" button state.
            } else {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Impossible de vous ajouter. Réessayez.",
                })
            }
        } catch (err) {
            console.error(err)
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Une erreur est survenue.",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleAuthSuccess = async () => {
        // Set flag for auto-join after reload
        sessionStorage.setItem('pendingWaitlistJoin', courseId)

        setAuthView('none')
        setOpen(false) // Close auth modal

        // Small delay to ensure token propagation
        setTimeout(() => {
            window.location.reload()
        }, 500)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    onClick={handleWaitlistClick}
                    disabled={loading || isJoined}
                    className={`mb-4 w-full text-lg text-white ${isJoined ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}`}
                >
                    {loading ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : isJoined ? (
                        <Check className="mr-2 h-5 w-5" />
                    ) : (
                        <Bell className="mr-2 h-5 w-5" />
                    )}
                    {loading ? "Traitement..." : isJoined ? "En attente" : "M'avertir"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {authView === 'login' ? "Connexion requise" : "Créer un compte"}
                    </DialogTitle>
                    <DialogDescription>
                        Vous devez être connecté pour rejoindre la liste d'attente.
                    </DialogDescription>
                </DialogHeader>

                {authView === 'login' && (
                    <div className="py-2">
                        <LoginForm
                            onRegisterClick={() => setAuthView('register')}
                            onSuccess={handleAuthSuccess}
                        />
                    </div>
                )}

                {authView === 'register' && (
                    <div className="py-2">
                        <RegisterForm
                            onLoginClick={() => setAuthView('login')}
                            onSuccess={handleAuthSuccess}
                        />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
