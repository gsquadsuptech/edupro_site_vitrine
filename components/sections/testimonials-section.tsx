"use client"

import { Container } from "@/components/marketing/container"
import Image from "next/image"
import { Star, Quote } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import auger from "@/assets/images/auger.jpeg"
import ibrahima from "@/assets/images/ibrahima-yade.jpeg"
import mariame from "@/assets/images/mariame-wone.jpeg"
import { TestimonialCard } from "@/components/ui/testimonial-card"
import { useTranslations } from "next-intl"

export function TestimonialsSection() {
  const t = useTranslations("landing.testimonials")

  const testimonials = [
    {
      quote: t("testimonials.auger.quote"),
      name: t("testimonials.auger.name"),
      role: t("testimonials.auger.role"),
      company: "",
      flag: t("testimonials.auger.flag"),
      results: {
        title: t("testimonials.auger.results.title"),
        items: [
          t("testimonials.auger.results.items.0"),
          t("testimonials.auger.results.items.1"),
          t("testimonials.auger.results.items.2"),
        ],
      },
      image: auger,
    },
    {
      quote: t("testimonials.ibrahima.quote"),
      name: t("testimonials.ibrahima.name"),
      role: t("testimonials.ibrahima.role"),
      company: "",
      flag: t("testimonials.ibrahima.flag"),
      results: {
        title: t("testimonials.ibrahima.results.title"),
        items: [
          t("testimonials.ibrahima.results.items.0"),
          t("testimonials.ibrahima.results.items.1"),
          t("testimonials.ibrahima.results.items.2"),
        ],
      },
      image: ibrahima,
    },
    {
      quote: t("testimonials.mariame.quote"),
      name: t("testimonials.mariame.name"),
      role: t("testimonials.mariame.role"),
      company: "",
      flag: t("testimonials.mariame.flag"),
      results: {
        title: t("testimonials.mariame.results.title"),
        items: [
          t("testimonials.mariame.results.items.0"),
          t("testimonials.mariame.results.items.1"),
          t("testimonials.mariame.results.items.2"),
        ],
      },
      image: mariame,
    },
  ]

  return (
    <section id="temoignages" className="py-20 md:py-32">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </Container>
    </section>
  )
}

