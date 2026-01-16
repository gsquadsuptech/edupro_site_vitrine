"use client"

import { SearchInput } from "@/components/marketing/shared/search-input"
import { Code, Briefcase, Building2, Users, Heart, TrendingUp, Palette, Languages, Monitor, Lightbulb, GraduationCap, Globe } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

// Reusing static categories for consistency, or we could accept them as props
const categories = [
    { name: "Tech & Digital", icon: Code, slug: "tech-digital", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=300&h=200" },
    { name: "Business", icon: Briefcase, slug: "business-management", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=300&h=200" },
    { name: "Construction", icon: Building2, slug: "construction-durable", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=300&h=200" },
    { name: "Soft Skills", icon: Users, slug: "soft-skills", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=300&h=200" },
    { name: "Santé", icon: Heart, slug: "sante", image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=300&h=200" },
    { name: "Finance", icon: TrendingUp, slug: "finance", image: "https://images.unsplash.com/photo-1554224155-97e3a6a9db61?auto=format&fit=crop&q=80&w=300&h=200" },
    { name: "Design", icon: Palette, slug: "design", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=300&h=200" },
    { name: "Langues", icon: Languages, slug: "langues", image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=300&h=200" }
]

interface ContextualHeroProps {
    categorySlug?: string
    locale?: string
}

export function ContextualHero({ categorySlug, locale = 'fr' }: ContextualHeroProps) {
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category') || 'all';

    // Determine background image based on category
    const activeCategory = categories.find(c => c.slug === currentCategory);
    const backgroundImage = activeCategory?.image || "https://images.unsplash.com/photo-1513258496098-b64ecf3900ca?auto=format&fit=crop&q=80&w=1920&h=600"; // Generic education background

    return (
        <section className="relative overflow-hidden bg-slate-900 text-white">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={backgroundImage}
                    alt="Background"
                    className="h-full w-full object-cover opacity-40 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
            </div>

            <div className="container relative z-10 mx-auto px-4 py-16 md:px-6 lg:px-8 lg:py-24">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                        {activeCategory ? `Formations en ${activeCategory.name}` : "Développez vos compétences"}
                    </h1>

                    <div className="mx-auto mb-12 max-w-2xl">
                        <SearchInput
                            className="h-12 w-full bg-white/10 text-white placeholder:text-white/70 backdrop-blur-sm border-white/20 focus-visible:bg-white/20"
                            placeholder="Que souhaitez-vous apprendre aujourd'hui ?"
                        />
                    </div>

                    {/* Horizontal Categories Scroll */}
                    <div className="scrollbar-hide flex snap-x gap-4 overflow-x-auto pb-4 text-left">
                        <Link
                            href={`/${locale}/catalogue/all`}
                            className={`snap-start shrink-0 cursor-pointer rounded-xl border transition-all hover:bg-white/20 overflow-hidden relative ${currentCategory === 'all' ? 'bg-white/20 border-primary' : 'bg-white/5 border-transparent'}`}
                        >
                            <div className="flex h-24 w-32 flex-col items-center justify-center gap-2">
                                <Globe className="h-8 w-8 text-blue-400" />
                                <span className="text-sm font-medium">Tout voir</span>
                            </div>
                        </Link>

                        {categories.map((category) => (
                            <Link
                                key={category.slug}
                                href={`/${locale}/catalogue/all?category=${category.slug}`}
                                className={`snap-start shrink-0 cursor-pointer rounded-xl border overflow-hidden relative transition-all hover:scale-105 ${currentCategory === category.slug ? 'border-primary ring-2 ring-primary' : 'border-transparent'}`}
                            >
                                <div className="relative h-24 w-32">
                                    <img src={category.image} alt={category.name} className="h-full w-full object-cover opacity-80" />
                                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-2">
                                        <span className="text-sm font-bold text-center leading-tight">{category.name}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
