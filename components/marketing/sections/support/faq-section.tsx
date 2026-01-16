import { Container } from "@/components/marketing/layout/container"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Comment m'inscrire à une formation ?",
    answer:
      "Pour vous inscrire, cliquez sur le bouton 'S'inscrire maintenant' sur la page du parcours qui vous intéresse. Vous serez guidé à travers un processus simple en 3 étapes : création de compte, choix du mode de paiement, et confirmation d'inscription.",
  },
  {
    question: "Quels sont les modes de paiement acceptés ?",
    answer:
      "Nous acceptons Orange Money, Wave, MTN Mobile Money, Moov Money, ainsi que les paiements par carte bancaire et virement bancaire. Un paiement échelonné en 3 fois sans frais est disponible pour tous nos parcours.",
  },
  {
    question: "Puis-je obtenir un remboursement ?",
    answer:
      "Oui, nous offrons une garantie satisfait ou remboursé de 14 jours. Si vous n'êtes pas satisfait de votre formation, nous vous remboursons intégralement, sans question.",
  },
  {
    question: "Comment accéder à mes cours après inscription ?",
    answer:
      "Une fois votre inscription confirmée, vous recevrez un email avec vos identifiants de connexion. Connectez-vous sur edupro.africa avec ces identifiants pour accéder à votre espace apprenant et commencer votre formation.",
  },
  {
    question: "Les certificats sont-ils reconnus ?",
    answer:
      "Oui, tous nos certificats sont co-signés par Edupro et nos partenaires formateurs certifiés. Ils sont reconnus par de nombreuses organisations internationales (GIZ, AFD, ONU Femmes) et partenaires du secteur créatif africain.",
  },
  {
    question: "Puis-je suivre la formation depuis n'importe quel pays ?",
    answer:
      "Absolument ! Nos formations sont 100% en ligne et accessibles depuis n'importe quel pays. Vous avez juste besoin d'une connexion internet stable pour accéder aux modules et participer aux sessions live.",
  },
  {
    question: "Y a-t-il un accompagnement personnalisé ?",
    answer:
      "Oui, tous nos parcours incluent un coaching individuel avec un formateur expert. Vous bénéficiez également d'un accès à notre communauté privée et d'un support formateur par email sous 24h.",
  },
  {
    question: "Comment devenir formateur sur Edupro ?",
    answer:
      "Visitez notre page 'Formateurs' et remplissez le formulaire de candidature. Notre équipe évaluera votre profil et votre expertise, puis vous guidera dans le processus d'intégration et de création de contenu.",
  },
]

export function SupportFAQSection() {
  return (
    <section className="bg-background py-20 lg:py-32">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-foreground lg:text-4xl">Questions Fréquentes</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Les réponses aux questions les plus posées par notre communauté
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl border border-border bg-card px-6 shadow-sm transition-all hover:shadow-md"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </section>
  )
}

