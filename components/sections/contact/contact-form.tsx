"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Loader2 } from 'lucide-react'

export function ContactForm() {
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
                <h3 className="mb-2 text-2xl font-bold text-foreground">Message envoyé !</h3>
                <p className="mb-8 text-muted-foreground">
                    Merci de nous avoir contactés. Notre équipe reviendra vers vous dans les plus brefs délais.
                </p>
                <Button onClick={() => setIsSuccess(false)} variant="outline">
                    Envoyer un autre message
                </Button>
            </div>
        )
    }

    return (
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Envoyez-nous un message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="firstname">Prénom</Label>
                        <Input id="firstname" placeholder="Jean" required className="bg-background" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastname">Nom</Label>
                        <Input id="lastname" placeholder="Dupont" required className="bg-background" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email professionnel</Label>
                    <Input id="email" type="email" placeholder="jean@entreprise.com" required className="bg-background" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="subject">Sujet</Label>
                    <Select>
                        <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Sélectionnez un sujet" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="formation">Demande de formation</SelectItem>
                            <SelectItem value="partnership">Partenariat</SelectItem>
                            <SelectItem value="support">Support technique</SelectItem>
                            <SelectItem value="other">Autre</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                        id="message"
                        placeholder="Comment pouvons-nous vous aider ?"
                        className="min-h-[150px] bg-background"
                        required
                    />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Envoi en cours...
                        </>
                    ) : (
                        "Envoyer le message"
                    )}
                </Button>
            </form>
        </div>
    )
}
