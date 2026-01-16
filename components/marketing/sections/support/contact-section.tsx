import { Container } from "@/components/marketing/layout/container"
import { Card } from "@/components/ui/card"
import { Mail, MessageCircle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

const contactOptions = [
  {
    icon: Mail,
    title: "Email",
    description: "Envoyez-nous un email, nous répondons sous 24h",
    action: "support@edupro.africa",
    link: "mailto:support@edupro.africa",
  },
  {
    icon: MessageCircle,
    title: "Chat en direct",
    description: "Discutez avec notre équipe en temps réel",
    action: "Démarrer une conversation",
    link: "#",
  },
  {
    icon: Phone,
    title: "Téléphone",
    description: "Appelez-nous du lundi au vendredi, 9h-18h",
    action: "+221 77 123 45 67",
    link: "tel:+221771234567",
  },
]

export function SupportContactSection() {
  return (
    <section className="border-t border-border bg-muted/30 py-20 lg:py-32">
      <Container>
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground lg:text-4xl">Besoin d'aide supplémentaire ?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Notre équipe est disponible pour répondre à toutes vos questions
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {contactOptions.map((option, index) => (
            <Card key={index} className="border border-border bg-card p-8 text-center transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <option.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">{option.title}</h3>
              <p className="mb-6 text-muted-foreground">{option.description}</p>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <a href={option.link}>{option.action}</a>
              </Button>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}

