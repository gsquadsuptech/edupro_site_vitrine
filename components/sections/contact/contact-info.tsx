import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react'

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
                <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6">
                    <div className="rounded-lg bg-primary/10 p-3 text-primary">
                        <Mail className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">Email</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Notre équipe vous répond sous 24h.</p>
                        <a href="mailto:hello@edupro.africa" className="mt-2 block font-medium text-primary hover:underline">
                            hello@edupro.africa
                        </a>
                    </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6">
                    <div className="rounded-lg bg-chart-2/10 p-3 text-chart-2">
                        <Phone className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">Téléphone</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Du lundi au vendredi, 9h-18h GMT.</p>
                        <a href="tel:+221338000000" className="mt-2 block font-medium text-primary hover:underline">
                            +221 33 800 00 00
                        </a>
                    </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6">
                    <div className="rounded-lg bg-chart-5/10 p-3 text-chart-5">
                        <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">Bureaux</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Venez nous rencontrer.</p>
                        <address className="mt-2 block not-italic font-medium text-foreground">
                            Mermoz Pyrotechnie<br />
                            Dakar, Sénégal
                        </address>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl bg-muted p-6 text-foreground">
                <div className="flex items-center gap-3 mb-4">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Support Client</h3>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                    Déjà client ? Consultez notre centre d'aide pour des réponses rapides.
                </p>
                <a href="#" className="text-sm font-medium text-primary underline decoration-primary underline-offset-4 hover:opacity-80">
                    Visiter le centre d'aide &rarr;
                </a>
            </div>
        </div>
    )
}
