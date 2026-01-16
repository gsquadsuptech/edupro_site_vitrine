"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import logoWhite from "@/assets/images/edupro-logo-white.png"

// Static slides content extracted from messages/fr/auth.json
const rawSlides = [
    {
        title: "Pour les Professionnels",
        description: "Développez vos compétences et accélérez votre carrière",
        features: [
            "Formations certifiantes reconnues",
            "Apprentissage à votre rythme",
            "Accompagnement personnalisé",
            "Communauté d'apprenants active"
        ]
    },
    {
        title: "Pour les Formateurs",
        description: "Partagez votre expertise et monétisez vos connaissances",
        features: [
            "Plateforme complète de création",
            "Outils IA intégrés",
            "Gestion simplifiée des apprenants",
            "Revenus récurrents"
        ]
    },
    {
        title: "Pour les Entreprises",
        description: "Formez vos équipes et développez vos talents internes",
        features: [
            "Catalogue de formations sur mesure",
            "Suivi de progression détaillé",
            "Certifications d'équipe",
            "ROI mesurable"
        ]
    }
];

export function AuthCarousel() {
    const slides = rawSlides;
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        if (slides.length <= 1) return

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [slides.length])

    const goToSlide = (index: number) => {
        setCurrentSlide(index)
    }

    return (
        <div className="relative h-full flex flex-col justify-center p-12 text-white">
            {/* Logo */}
            <div className="mb-8">
                <Image
                    src={logoWhite}
                    alt="EduPro Logo"
                    width={180}
                    height={60}
                    className="mb-6"
                    priority
                    style={{ objectFit: "contain" }}
                />
            </div>

            {/* Carousel Content */}
            <div className="flex-1 flex flex-col justify-center">
                <div className="relative h-[400px] overflow-hidden">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? "opacity-100" : "opacity-0"
                                }`}
                        >
                            <h2 className="text-4xl font-bold mb-4">
                                {slide.title}
                            </h2>
                            <p className="text-xl text-white/90 mb-8">
                                {slide.description}
                            </p>
                            <div className="space-y-4">
                                {slide.features.map((feature, featureIndex) => (
                                    <div key={featureIndex} className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-white flex-shrink-0" />
                                        <span className="text-lg">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Carousel Indicators */}
                <div className="flex items-center justify-center gap-2 mt-8">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => goToSlide(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                ? "w-8 bg-white"
                                : "w-2 bg-white/50 hover:bg-white/75"
                                }`}
                            aria-label={`Aller au slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
