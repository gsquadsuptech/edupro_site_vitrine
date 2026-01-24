"use client"

import type React from "react"

import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Loader2, CheckCircle2 } from "lucide-react"

export function ContactFormSection() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 2000))

        setIsSubmitting(false)
        setIsSubmitted(true)
    }

    if (isSubmitted) {
        return (
            <section className="py-20 md:py-32 bg-muted/30">
                <Container>
                    <div className="mx-auto max-w-2xl text-center">
                        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <CheckCircle2 className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="mb-4 text-3xl font-bold">Message envoyé !</h2>
                        <p className="mb-8 text-muted-foreground">
                            Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.
                        </p>
                        <Button onClick={() => setIsSubmitted(false)}>Envoyer un autre message</Button>
                    </div>
                </Container>
            </section>
        )
    }

    return (
        <section className="py-20 md:py-32 bg-muted/30">
            <Container>
                <div className="mx-auto max-w-2xl">
                    <div className="mb-8 text-center">
                        <h2 className="mb-4 text-3xl font-bold md:text-4xl">Envoyez-nous un message</h2>
                        <p className="text-muted-foreground">
                            Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-8 space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">Prénom *</Label>
                                <Input id="firstName" placeholder="Votre prénom" required disabled={isSubmitting} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lastName">Nom *</Label>
                                <Input id="lastName" placeholder="Votre nom" required disabled={isSubmitting} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input id="email" type="email" placeholder="votre@email.com" required disabled={isSubmitting} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Téléphone</Label>
                            <Input id="phone" type="tel" placeholder="+221 XX XXX XX XX" disabled={isSubmitting} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject">Sujet *</Label>
                            <Input id="subject" placeholder="Sujet de votre message" required disabled={isSubmitting} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Message *</Label>
                            <Textarea
                                id="message"
                                placeholder="Décrivez votre demande..."
                                rows={6}
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full bg-gradient-to-r from-primary to-chart-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Envoi en cours...
                                </>
                            ) : (
                                "Envoyer le message"
                            )}
                        </Button>
                    </form>
                </div>
            </Container>
        </section>
    )
}
