"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Loader2, Calendar } from 'lucide-react'

export function DemoForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsSubmitting(false)
        setIsSuccess(true)
    }

    if (isSuccess) {
        return (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
                <div className="mb-6 rounded-full bg-green-500/10 p-4 text-green-500">
                    <CheckCircle2 className="h-12 w-12" />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-foreground">Demande reçue !</h3>
                <p className="mb-8 text-muted-foreground">
                    Merci de votre intérêt. Un expert EduPro va vous contacter sous 24h pour planifier votre démo personnalisée.
                </p>
                <Button onClick={() => setIsSuccess(false)} variant="outline">
                    Retour au formulaire
                </Button>
            </div>
        )
    }

    return (
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-8">
                <h2 className="mb-2 text-2xl font-bold text-foreground">Planifiez votre démo</h2>
                <p className="text-muted-foreground">
                    Découvrez comment EduPro peut transformer la formation dans votre entreprise.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="firstname">Prénom *</Label>
                        <Input id="firstname" placeholder="Jean" required className="bg-background" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastname">Nom *</Label>
                        <Input id="lastname" placeholder="Dupont" required className="bg-background" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email professionnel *</Label>
                    <Input id="email" type="email" placeholder="jean@entreprise.com" required className="bg-background" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="company">Nom de l'entreprise *</Label>
                    <Input id="company" placeholder="Votre entreprise" required className="bg-background" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="employees">Nombre de collaborateurs</Label>
                        <Select>
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Sélectionnez" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1-50">1-50</SelectItem>
                                <SelectItem value="51-200">51-200</SelectItem>
                                <SelectItem value="201-500">201-500</SelectItem>
                                <SelectItem value="500+">500+</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Votre rôle</Label>
                        <Select>
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Sélectionnez" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="rh">DRH / Responsable Formation</SelectItem>
                                <SelectItem value="ceo">Direction Générale</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="other">Autre</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="needs">Vos besoins spécifiques (optionnel)</Label>
                    <Textarea
                        id="needs"
                        placeholder="Quels sont vos enjeux actuels ?"
                        className="min-h-[100px] bg-background"
                    />
                </div>

                <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Envoi en cours...
                        </>
                    ) : (
                        <>
                            Demander ma démo
                            <Calendar className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                    En soumettant ce formulaire, vous acceptez d'être contacté par EduPro.
                </p>
            </form>
        </div>
    )
}
