"use client"

import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { Code2, Briefcase, Building2, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Link from "next/link"

export function SkillPacksSection() {
  const t = useTranslations("professionals.skillPacks")
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'

  const skillPacks = [
    {
      icon: Code2,
      packKey: "tech",
      image: "/african-professionals-working-with-data-analytics-.jpg",
    },
    {
      icon: Briefcase,
      packKey: "business",
      image: "/african-business-team-meeting-discussing-strategy-.jpg",
    },
    {
      icon: Building2,
      packKey: "construction",
      image: "/african-construction-professional-using-bim-softwa.jpg",
    },
  ]

  return (
    <section id="skill-packs" className="py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="space-y-12">
          {skillPacks.map((pack, index) => {
            const Icon = pack.icon
            const packData = t.raw(`packs.${pack.packKey}`) as any
            const isEven = index % 2 === 0
            return (
              <div
                key={index}
                className={`rounded-2xl border border-border overflow-hidden ${isEven ? "bg-gradient-to-r from-primary/5 to-transparent" : "bg-gradient-to-r from-transparent to-chart-2/5"}`}
              >
                <div className={`grid gap-8 lg:grid-cols-2 p-8 md:p-12 ${isEven ? "" : "lg:grid-flow-dense"}`}>
                  {/* Content */}
                  <div className="space-y-6 flex flex-col justify-center">
                    <div className="space-y-3">
                      <div className="inline-flex rounded-lg bg-primary/10 p-3">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold">{packData.title}</h3>
                      <p className="text-lg text-muted-foreground">{packData.headline}</p>
                    </div>

                    {/* Courses */}
                    <div className="space-y-3">
                      <h4 className="font-semibold uppercase text-sm tracking-wide text-primary">Parcours inclus:</h4>
                      <div className="grid gap-2">
                        {packData.courses.map((course: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-start text-sm">
                            <span className="font-medium">{course.name}</span>
                            <div className="text-xs text-muted-foreground text-right">
                              <div>{course.duration}</div>
                              <div>{course.level}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-2">
                      <h4 className="font-semibold uppercase text-sm tracking-wide text-primary">
                        Ce que vous obtenez:
                      </h4>
                      <div className="grid gap-2">
                        {packData.highlights.map((highlight: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <span className="text-primary">✓</span>
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Jobs & Salary */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-muted p-3">
                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Métiers visés</p>
                        <p className="text-sm font-medium line-clamp-2">{packData.jobs.slice(0, 2).join(", ")}...</p>
                      </div>
                      <div className="rounded-lg bg-muted p-3">
                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Salaires moyens</p>
                        <p className="text-sm font-medium">{packData.salary}</p>
                      </div>
                    </div>

                    <Button asChild className="w-full gap-2 bg-primary hover:bg-primary/90 text-white">
                      <Link href={`/${locale}/catalogue`}>
                        {t("cta")}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  {/* Testimonial & Image */}
                  <div className={`space-y-4 flex flex-col ${isEven ? "" : "lg:order-first"}`}>
                    <div className="relative aspect-video rounded-xl overflow-hidden">
                      <Image src={pack.image || "/placeholder.svg"} alt={packData.title} fill className="object-cover" />
                    </div>

                    <div className="rounded-xl border border-border bg-card p-4">
                      <blockquote className="text-sm font-medium italic mb-4">"{packData.testimonial.text}"</blockquote>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">{packData.testimonial.author.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{packData.testimonial.author}</p>
                          <p className="text-xs text-muted-foreground">{packData.testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
