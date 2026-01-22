"use client"

import type React from "react"

import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function InvestorFormSection() {
    const [formData, setFormData] = useState({
        investorType: "",
        fullName: "",
        email: "",
        phone: "",
        linkedin: "",
        africaInvestment: "",
        sectors: [],
        stage: "",
        ticket: "",
        discovered: "",
        interest: "",
        timeline: "",
        contact: [] as string[],
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Form submitted:", formData)
    }

    return (
        <section className="py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">Accéder à Plus d'Informations</h2>
                    <p className="text-lg text-muted-foreground">
                        Remplissez ce formulaire rapide pour que nous puissions échanger
                    </p>
                </div>

                <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-8 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section 1: Qui êtes-vous */}
                        <div>
                            <h3 className="mb-6 text-lg font-bold">Section 1: Qui Êtes-Vous?</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Type d'investisseur <span className="text-accent">*</span>
                                    </label>
                                    <select
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm"
                                        value={formData.investorType}
                                        onChange={(e) => setFormData({ ...formData, investorType: e.target.value })}
                                    >
                                        <option value="">Sélectionnez...</option>
                                        <option value="angel">Angel Investor</option>
                                        <option value="vc">Fonds de Venture Capital</option>
                                        <option value="family">Family Office</option>
                                        <option value="corporate">Corporate VC</option>
                                        <option value="impact">Fonds d'Impact / DFI</option>
                                        <option value="other">Autre</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Nom complet / Nom du fonds <span className="text-accent">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium">
                                            Email professionnel <span className="text-accent">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium">
                                            Téléphone <span className="text-accent">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">LinkedIn Profile</label>
                                    <input
                                        type="url"
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm"
                                        value={formData.linkedin}
                                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Votre Intérêt */}
                        <div>
                            <h3 className="mb-6 text-lg font-bold">Section 2: Votre Intérêt</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">Vous investissez en Afrique?</label>
                                    <select
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm"
                                        value={formData.africaInvestment}
                                        onChange={(e) => setFormData({ ...formData, africaInvestment: e.target.value })}
                                    >
                                        <option value="">Sélectionnez...</option>
                                        <option value="regularly">Oui, régulièrement</option>
                                        <option value="occasionally">Oui, occasionnellement</option>
                                        <option value="no">Non, ce serait mon premier</option>
                                        <option value="researching">Je me renseigne</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">Ticket d'investissement typique</label>
                                    <select
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm"
                                        value={formData.ticket}
                                        onChange={(e) => setFormData({ ...formData, ticket: e.target.value })}
                                    >
                                        <option value="">Sélectionnez...</option>
                                        <option value="50k">{"< 50K USD"}</option>
                                        <option value="50-100k">50K - 100K USD</option>
                                        <option value="100-250k">100K - 250K USD</option>
                                        <option value="250k+">250K+ USD</option>
                                        <option value="flexible">À discuter</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">Timeline d'investissement</label>
                                    <select
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm"
                                        value={formData.timeline}
                                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                                    >
                                        <option value="">Sélectionnez...</option>
                                        <option value="immediate">Immédiatement</option>
                                        <option value="3-6">3-6 mois</option>
                                        <option value="6-12">6-12 mois</option>
                                        <option value="later">Plus tard</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Contexte */}
                        <div>
                            <h3 className="mb-6 text-lg font-bold">Section 3: Contexte</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">Comment avez-vous découvert EduPro?</label>
                                    <select
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm"
                                        value={formData.discovered}
                                        onChange={(e) => setFormData({ ...formData, discovered: e.target.value })}
                                    >
                                        <option value="">Sélectionnez...</option>
                                        <option value="referral">Référence</option>
                                        <option value="linkedin">LinkedIn / Réseaux sociaux</option>
                                        <option value="event">Événement / Conférence</option>
                                        <option value="search">Recherche active EdTech Afrique</option>
                                        <option value="article">Article / Presse</option>
                                        <option value="other">Autre</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">Qu'est-ce qui vous intéresse dans EduPro?</label>
                                    <textarea
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm"
                                        rows={3}
                                        value={formData.interest}
                                        onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                                        placeholder="Votre message..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Prochaines Étapes */}
                        <div>
                            <h3 className="mb-6 text-lg font-bold">Section 4: Prochaines Étapes</h3>

                            <div className="space-y-3">
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        className="rounded"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setFormData({ ...formData, contact: [...formData.contact, "email"] })
                                            } else {
                                                setFormData({
                                                    ...formData,
                                                    contact: formData.contact.filter((c) => c !== "email"),
                                                })
                                            }
                                        }}
                                    />
                                    <span className="text-sm">Recevoir plus d'informations par email</span>
                                </label>

                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        className="rounded"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setFormData({ ...formData, contact: [...formData.contact, "call"] })
                                            } else {
                                                setFormData({
                                                    ...formData,
                                                    contact: formData.contact.filter((c) => c !== "call"),
                                                })
                                            }
                                        }}
                                    />
                                    <span className="text-sm">Planifier un appel avec le CEO (15-30 min)</span>
                                </label>

                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        className="rounded"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setFormData({ ...formData, contact: [...formData.contact, "newsletter"] })
                                            } else {
                                                setFormData({
                                                    ...formData,
                                                    contact: formData.contact.filter((c) => c !== "newsletter"),
                                                })
                                            }
                                        }}
                                    />
                                    <span className="text-sm">Recevoir les updates mensuels (newsletter investisseurs)</span>
                                </label>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-primary to-chart-2 py-3 text-primary-foreground hover:opacity-90"
                        >
                            📩 Envoyer ma demande
                        </Button>

                        <p className="text-center text-xs text-muted-foreground">Réponse sous 48h</p>
                    </form>
                </div>
            </Container>
        </section>
    )
}
