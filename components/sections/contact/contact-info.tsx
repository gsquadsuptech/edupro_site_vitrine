import { Mail, MapPin, Phone } from 'lucide-react'

export function ContactInfo() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground">Contactez-nous</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Une question ? Un projet de formation ? Notre équipe est là pour vous accompagner.
                </p>
            </div>

            <div className="grid gap-6">
                <div className="flex items-start gap-4 rounded-xl border border-border bg-muted/50 p-6">
                    <div className="rounded-lg bg-primary/10 p-3 text-primary">
                        <Mail className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-foreground">Email</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Notre équipe vous répond sous 24h.</p>
                        <div className="mt-3 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">Dakar</p>
                                <a href="mailto:contact.sn@edupro.africa" className="block font-medium text-primary hover:underline">
                                    contact.sn@edupro.africa
                                </a>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">Abidjan</p>
                                <a href="mailto:contact.ci@edupro.africa" className="block font-medium text-primary hover:underline">
                                    contact.ci@edupro.africa
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border border-border bg-muted/50 p-6">
                    <div className="rounded-lg bg-chart-2/10 p-3 text-chart-2">
                        <Phone className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-foreground">Téléphone</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Du lundi au vendredi, 9h-18h GMT.</p>
                        <div className="mt-3 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">Dakar</p>
                                <a href="https://wa.me/221766651717" target="_blank" rel="noopener noreferrer" className="block font-medium text-primary hover:underline">
                                    +221 76 665 17 17
                                </a>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">Abidjan</p>
                                <a href="https://wa.me/2250554040707" target="_blank" rel="noopener noreferrer" className="block font-medium text-primary hover:underline">
                                    +225 05 54 04 07 07
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border border-border bg-muted/50 p-6">
                    <div className="rounded-lg bg-chart-1/10 p-3 text-chart-1">
                        <MapPin className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold mb-3 text-foreground">Bureaux</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="font-semibold text-foreground mb-1">Dakar</p>
                                <address className="text-sm not-italic text-muted-foreground">
                                    Mermoz Pyrotechnie<br />
                                    Lot 23, Dakar, Sénégal
                                </address>
                            </div>
                            <div>
                                <p className="font-semibold text-foreground mb-1">Abidjan</p>
                                <address className="text-sm not-italic text-muted-foreground">
                                    Cocody Rivera 2<br />
                                    Abidjan, Côte d'Ivoire
                                </address>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
