import { Container } from "@/components/marketing/container"
import { Building2, User, GraduationCap, TrendingUp, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function ProfilesSection() {
  const profiles = [
    {
      icon: Building2,
      title: "POUR LES ENTREPRISES & DRH",
      subtitle: "Formez vos équipes à la vitesse de l'innovation",
      features: [
        "✓ Onboarding automatisé",
        "✓ Académie digitale interne",
        "✓ ROI mesurable en temps réel",
        "✓ -60% de coûts vs présentiel"
      ],
      caseStudy: {
        title: "CAS CLIENT: Centre d'appel BPO",
        result: "-50% time-to-productivity"
      },
      cta: "Découvrir la solution entreprise",
      link: "/entreprises",
      image: "/placeholder.jpg"
    },
    {
      icon: User,
      title: "POUR LES PROFESSIONNELS",
      subtitle: "Apprenez les compétences qui boostent votre carrière",
      features: [
        "✓ Certifications reconnues",
        "✓ Parcours contextualisés",
        "✓ Accessible 24/7 depuis mobile",
        "✓ Dès 15 000 FCFA/mois"
      ],
      caseStudy: {
        title: "3 SKILL PACKS DISPONIBLES:",
        result: "Tech • Business • Construction"
      },
      cta: "Booster votre carrière",
      link: "/catalogue",
      image: "/placeholder.jpg"
    },
    {
      icon: GraduationCap,
      title: "POUR LES FORMATEURS & INSTITUTS",
      subtitle: "Digitalisez et monétisez votre expertise",
      features: [
        "✓ Outils IA de création",
        "✓ Audience panafricaine",
        "✓ Support technique complet",
        "✓ Marque blanche pour instituts"
      ],
      caseStudy: {
        title: "150+ FORMATEURS",
        result: "nous font déjà confiance"
      },
      cta: "Devenir formateur partenaire",
      link: "/formateurs",
      image: "/placeholder.jpg"
    },
    {
      icon: TrendingUp,
      title: "POUR LES INVESTISSEURS",
      subtitle: "Investissez dans l'avenir de l'Afrique",
      features: [
        "✓ Marché: 40-50Mds FCFA/an",
        "✓ Croissance: +30% post-COVID",
        "✓ ROI projeté: 206% sur 3 ans",
        "✓ Expansion: 3 pays → 15+ pays"
      ],
      caseStudy: {
        title: "PHASE PILOTE EN COURS",
        result: "Expansion prévue sur 3 marchés"
      },
      cta: "Pourquoi Investir",
      link: "/investisseurs",
      image: "/placeholder.jpg"
    }
  ]

  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            Qui que vous soyez, EduPro accélère votre impact
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {profiles.map((profile, index) => {
            const Icon = profile.icon
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-2xl"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={profile.image}
                    alt={profile.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-8">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold uppercase tracking-wide text-primary">
                    {profile.title}
                  </h3>
                  <p className="mb-6 text-lg font-semibold">{profile.subtitle}</p>

                  <ul className="mb-6 space-y-2">
                    {profile.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary">{feature.split(' ')[0]}</span>
                        <span className="text-muted-foreground">{feature.split(' ').slice(1).join(' ')}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mb-6 rounded-lg bg-muted/50 p-4">
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      {profile.caseStudy.title}
                    </p>
                    <p className="font-semibold text-foreground">{profile.caseStudy.result}</p>
                  </div>

                  <Link
                    href={profile.link}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                  >
                    {profile.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
