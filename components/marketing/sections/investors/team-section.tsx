"use client"

import { Container } from "@/components/marketing/layout/container"
import Image from "next/image"
import { useTranslations } from "next-intl"

export function TeamSection() {
  const t = useTranslations("investors.team")

  const team = [
    {
      name: "Diallo Boubacar Ibou",
      role: "Co-founder & CEO",
      bio: "15 ans d'expérience écosystème formation & BPO en Afrique",
      image: "/african-male-professional-executive.jpg",
    },
    {
      name: "À compléter",
      role: "Co-founder & CTO/CPO",
      bio: "Expert systèmes scalables pour marchés émergents",
      image: "/african-tech-professional-developer.jpg",
    },
    {
      name: "À compléter",
      role: "Co-founder & [Rôle]",
      bio: "Expertise en éducation et contenu africain",
      image: "/african-education-specialist.jpg",
    },
  ]

  return (
    <section className="bg-muted/30 py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t("title")}</h2>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {team.map((member, index) => (
            <div
              key={index}
              className="rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg transition-all"
            >
              <Image
                src={member.image || "/placeholder.svg"}
                alt={member.name}
                width={300}
                height={300}
                className="h-64 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="mb-1 text-lg font-bold">{member.name}</h3>
                <div className="mb-3 text-sm font-medium text-primary">{member.role}</div>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-lg border border-border bg-card p-8">
          <h3 className="mb-6 text-xl font-bold">{t("advisors.title")}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="text-sm text-muted-foreground">{t("advisors.placeholder")}</div>
          </div>
        </div>
      </Container>
    </section>
  )
}
