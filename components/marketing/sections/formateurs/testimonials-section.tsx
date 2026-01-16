"use client"

import { Container } from "@/components/marketing/layout/container"
import { Star } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

export function FormateursTestimonialsSection() {
  const t = useTranslations("trainers.testimonials")

  const testimonials = [
    {
      key: "mariame",
      image: "/images/mariame-wone.jpeg",
    },
    {
      key: "auger",
      image: "/images/auger.jpeg",
    },
    {
      key: "ibrahima",
      image: "/images/ibrahima-yade.jpeg",
    },
  ]

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => {
            const testimonialData = t.raw(`testimonials.${testimonial.key}`) as any
            return (
              <div key={index} className="rounded-2xl border border-border bg-card p-8">
                <div className="mb-6 overflow-hidden rounded-full h-20 w-20">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonialData.name}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="mb-4">
                  <p className="font-bold">{testimonialData.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonialData.role}</p>
                </div>

                <p className="mb-6 text-sm leading-relaxed italic text-muted-foreground">"{testimonialData.quote}"</p>

                <div className="mb-4 flex items-center gap-1">
                  {[...Array(testimonialData.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-chart-1 text-chart-1" />
                  ))}
                </div>

                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs font-medium text-muted-foreground">Formation digitalisée:</p>
                  <p className="text-sm font-semibold">{testimonialData.course}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>{t("closing")}</p>
        </div>
      </Container>
    </section>
  )
}
