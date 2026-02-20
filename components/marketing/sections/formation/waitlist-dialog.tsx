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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"

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
                    {loading ? "Traitement..." : isJoined ? "En attente pour la prochaine session" : "M'avertir pour la prochaine session"}
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

                <Tabs value={authView} className="w-full" onValueChange={(v: string) => setAuthView(v as 'login' | 'register')}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Connexion</TabsTrigger>
                        <TabsTrigger value="register">Inscription</TabsTrigger>
                    </TabsList>
                    <div className="relative mt-4 overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={authView === 'login' ? 'login' : 'register'}
                                initial={{ x: authView === 'login' ? -20 : 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: authView === 'login' ? 20 : -20, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                                {authView === 'login' ? (
                                    <LoginForm
                                        onRegisterClick={() => setAuthView('register')}
                                        onSuccess={handleAuthSuccess}
                                    />
                                ) : (
                                    <RegisterForm
                                        onLoginClick={() => setAuthView('login')}
                                        onSuccess={handleAuthSuccess}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
