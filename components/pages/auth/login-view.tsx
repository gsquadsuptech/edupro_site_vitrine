"use client";

import { Suspense, useState } from "react";
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import eduproHome from "@/assets/images/edupro-home3.png"
import logo from "@/assets/images/logo.png"
import { useSearchParams } from 'next/navigation';
import { AuthCarousel } from "@/components/pages/auth/auth-carousel";
import { LoginForm } from "@/components/pages/auth/login-form";
import { RegisterForm } from "@/components/pages/auth/register-form";
import { Card, CardContent } from "@/components/ui/card";

// Composant de chargement
function LoginFallback() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-4">
            <div className="mb-8 flex flex-col items-center">
                <div className="h-12 w-32 bg-muted-foreground/20 animate-pulse rounded mb-2" />
                <div className="h-6 w-40 bg-muted-foreground/20 animate-pulse rounded mb-1" />
                <div className="h-4 w-48 bg-muted-foreground/20 animate-pulse rounded" />
            </div>
            <div className="w-full max-w-md flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
        </div>
    );
}

// Contenu principal
function LoginContent() {
    const searchParams = useSearchParams();
    const expired = searchParams?.get('expired') === 'true';
    const [isRegistering, setIsRegistering] = useState(false);

    return (
        <div className="flex min-h-screen">
            {/* Côté gauche - Image avec overlay et carousel */}
            <div className="hidden lg:flex lg:w-1/2 relative min-h-screen">
                <Image
                    src={eduproHome}
                    alt="EduPro - Formation professionnelle"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/80 to-fuchsia-900/80" />
                <div className="relative z-10 w-full h-full">
                    <AuthCarousel />
                </div>
            </div>

            {/* Côté droit - Formulaire */}
            <div className="flex-1 flex flex-col items-center justify-center bg-muted p-4 lg:p-8">
                <div className="w-full max-w-md">
                    {/* Logo visible sur mobile */}
                    <div className="mb-8 flex flex-col items-center lg:hidden">
                        <Image
                            src={logo}
                            alt="EduPro Logo"
                            width={150}
                            height={48}
                            className="mb-2"
                            priority
                            style={{ objectFit: 'contain' }}
                        />
                        <p className="text-sm text-muted-foreground text-center">Plateforme de formation professionnelle pour l'Afrique</p>
                    </div>

                    {expired && (
                        <div className="bg-destructive/10 border-l-4 border-destructive p-4 mb-6">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-destructive font-medium">
                                        Confirmation de compte requise
                                    </p>
                                    <p className="text-sm text-destructive mt-1">
                                        Votre période d'essai de 7 jours est expirée.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <Card className="w-full shadow-lg">
                        <CardContent className="p-6">
                            {isRegistering ? (
                                <RegisterForm onLoginClick={() => setIsRegistering(false)} />
                            ) : (
                                <LoginForm onRegisterClick={() => setIsRegistering(true)} />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export function LoginView() {
    return (
        <Suspense fallback={<LoginFallback />}>
            <LoginContent />
        </Suspense>
    );
}
