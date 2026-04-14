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
import { createClient } from "@/lib/supabase/client"
import { LoginForm } from "@/components/pages/auth/login-form"
import { RegisterForm } from "@/components/pages/auth/register-form"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
    const [authView, setAuthView] = useState<'login' | 'register'>('login')

    const { user, isAuthenticated } = useAuth()
    const { toast } = useToast()

    useEffect(() => {
        const checkPendingJoin = async () => {
            const pendingCourseId = sessionStorage.getItem('pendingWaitlistJoin')
            if (pendingCourseId === courseId && isAuthenticated && user) {
                sessionStorage.removeItem('pendingWaitlistJoin')
                await addToWaitlist()
            }
        }
        checkPendingJoin()
    }, [isAuthenticated, user, courseId])

    const handleWaitlistClick = async (e: React.MouseEvent) => {
        if (isJoined) return
        if (!isAuthenticated) {
            e.preventDefault()
            setOpen(true)
        } else {
            e.preventDefault()
            await addToWaitlist()
        }
    }

    const addToWaitlist = async () => {
        if (!user) return
        setLoading(true)
        try {
            const { success } = await CourseService.addToWaitlist(courseId, user.id)
            if (success) {
                setIsJoined(true)
                toast({
                    title: "Inscrit sur liste d'attente",
                    description: "Vous serez prévenu dès l'ouverture des inscriptions.",
                    variant: "default",
                })
            } else {
                toast({ variant: "destructive", title: "Erreur", description: "Impossible de vous ajouter. Réessayez." })
            }
        } catch (err) {
            console.error(err)
            toast({ variant: "destructive", title: "Erreur", description: "Une erreur est survenue." })
        } finally {
            setLoading(false)
        }
    }

    const handleOAuthSignIn = async (provider: 'google' | 'facebook') => {
        const supabase = createClient()
        sessionStorage.setItem('pendingWaitlistJoin', courseId)
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo: window.location.href },
        })
        if (error) {
            toast({ variant: "destructive", title: "Erreur", description: "Impossible de se connecter. Réessayez." })
        }
    }

    const handleAuthSuccess = async () => {
        sessionStorage.setItem('pendingWaitlistJoin', courseId)
        setOpen(false)
        setTimeout(() => { window.location.reload() }, 500)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    onClick={handleWaitlistClick}
                    disabled={loading || isJoined}
                    className={`w-full text-sm font-semibold text-white whitespace-nowrap ${isJoined ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}`}
                >
                    {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />
                    ) : isJoined ? (
                        <Check className="mr-2 h-4 w-4 shrink-0" />
                    ) : (
                        <Bell className="mr-2 h-4 w-4 shrink-0" />
                    )}
                    <span className="truncate">
                        {loading ? "Traitement..." : isJoined ? "En attente" : "M'avertir pour la prochaine session"}
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Connexion requise</DialogTitle>
                    <DialogDescription>
                        Connectez-vous pour rejoindre la liste d'attente.
                    </DialogDescription>
                </DialogHeader>

                {/* Email/password form with tabs */}
                <Tabs value={authView} onValueChange={(v: string) => setAuthView(v as 'login' | 'register')} className="w-full mt-2">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Connexion</TabsTrigger>
                        <TabsTrigger value="register">Inscription</TabsTrigger>
                    </TabsList>
                    <div className="mt-3">
                        {authView === 'login' ? (
                            <LoginForm
                                onRegisterClick={() => setAuthView('register')}
                                onSuccess={handleAuthSuccess}
                                compact
                            />
                        ) : (
                            <RegisterForm
                                onLoginClick={() => setAuthView('login')}
                                onSuccess={handleAuthSuccess}
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
    )
}
